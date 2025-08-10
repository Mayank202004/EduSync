import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { validateRegisterInput, validateUpdateUserInput} from "../validators/user.validator.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js";
import { Student } from "../models/student.model.js"; 
import { Teacher } from "../models/teacher.model.js";
import { Otp } from "../models/otp.model.js";
import { sendOtpHelper } from "../utils/otpUtil.js";
import { generateUniqueUsername, generateRandomPassword } from "../utils/userUtils.js";
import School from "../models/school.model.js";
import xlsx from "xlsx"
import { sendCredentialOverMail } from "../utils/userUtils.js";
import fs from 'fs';
import { Chat } from "../models/chat.model.js";


/**
 * @desc   Generate access and refresh tokens
 * @route  POST /api/v1/users/refresh-token
 * @access Public
 */ 
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating referesh and access token"
        );
    }
};

/**
 * @desc   Register a new user
 * @route  POST /api/v1/users/register
 * @access Public
 */ 
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password, role, class: studentClass, schoolId} = req.body;

    if (
        [fullName, email, username, password, schoolId].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }
    
    // Validate user input
    const { errors } = validateRegisterInput({fullName, email, username, password});
    if (errors) {
        return res
            .status(400)
            .json(new ApiResponse(400, errors, "Validation error"));
    }

    if(role==="student" && !studentClass){
        throw new ApiError(400, "Class is required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });
    if (existingUser) {
        throw new ApiError(400, "Username or email already exists");
    }

    // Default role to "user" if not provided
    const userRole = role || "student"; 
    if (!["super admin", "student","teacher"].includes(userRole)) {
        throw new ApiError(400, "Role must be either admin or student or teacher");
    }

    // Create new user
    const user = await User.create({
        fullName,
        email,
        username,
        password,
        role: userRole,
        verified:false,
        schoolId
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -avatar"
    );

    if (!createdUser) {
        throw new ApiError(500, "Error creating user");
    }

    // Make an entry in student schema 
    if (userRole === "student") {
        const student = await Student.create({
            userId: user._id, 
            class: studentClass.trim(),
            schoolId
        });
        if(!student){
            throw new ApiError(500,"Error Creating Student");
        }
    }
    else if(userRole ==="teacher"){
        const teacher = await Teacher.create({
            userId: user._id,
            schoolId
        });
        if(!teacher){
            throw new ApiError(500,"Error Creating Teacher");
        }
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User created successfully"));
});



/**
 * @desc   Login user
 * @route  POST /api/v1/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "Email or username is required");
    }
    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (!user) {
        throw new ApiError(404, "Invalid Credentials");
    }

    if(!user.verified){
        throw new ApiError(403,"You are not verified. Contact super admin");
    }

    if(!user.schoolId && !user.role === "system-admin"){
        throw new ApiError(403,"School not found or inactive");
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid Credentials");
    }

    // If role is admin type → Require OTP
    if (["system admin", "super admin"].includes(user.role)) {
      await sendOtpHelper(user.email, "LOGIN");

      // Temporary token valid for ~5 min
      const tempToken = jwt.sign(
        { userId: user._id, email: user.email, purpose: "LOGIN" },
        process.env.TEMP_JWT_SECRET,
        { expiresIn: process.env.TEMP_JWT_EXPIRY || "10m" }
      );

      return res.status(200).json(
        new ApiResponse(200, { otpRequired: true, otpData:{tempToken,email:user.email} }, "OTP sent to your regeistered email")
      );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    let roleData = null;
    if (loggedInUser.role === 'student') {
        roleData = await Student.findOne({ userId: loggedInUser._id }).select("-parentContact -userId -address -dob -bloodGroup -allergies -height -weight -siblingInfo -parentsInfo -createdAt -updatedAt");
    } else if (loggedInUser.role === 'teacher') {
        roleData = await Teacher.findOne({ userId: loggedInUser._id }).select("-userid -address -phone -createdAt -updatedAt");
    }

    //Options for cookies
    const options = {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    roleData,
                    accessToken,
                    refreshToken,
                },
                "User logged In Successfully"
            )
        );
});

/**
 * @desc   Verify OTP
 * @route  POST /api/v1/users/verify-otp
 * @access Public
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const tempToken = req.headers["x-temp-token"];

  if (!otp || !tempToken) throw new ApiError(400, "OTP and temp token required");

  let payload;
  try {
    payload = jwt.verify(tempToken, process.env.TEMP_JWT_SECRET);
  } catch {
    throw new ApiError(400, "Temp token invalid or expired");
  }

  const otpRecord = await Otp.findOne({
    email: payload.email,
    otp,
    purpose: "LOGIN",
  });
  if (!otpRecord) throw new ApiError(400, "Invalid OTP");

  if (otpRecord.expiresAt < new Date())
    throw new ApiError(400, "OTP expired");

  await Otp.deleteOne({ _id: otpRecord._id });

  const { accessToken, refreshToken } =
    await generateAccessAndRefereshTokens(payload.userId);

  const loggedInUser = await User.findById(payload.userId).select(
    "-password -refreshToken"
  );

  let roleData = null;
  if (loggedInUser.role === "student") {
    roleData = await Student.findOne({ userId: loggedInUser._id }).select(
      "-parentContact -userId -address -dob -bloodGroup -allergies -height -weight -siblingInfo -parentsInfo -createdAt -updatedAt"
    );
  } else if (loggedInUser.role === "teacher") {
    roleData = await Teacher.findOne({ userId: loggedInUser._id }).select(
      "-userid -address -phone -createdAt -updatedAt"
    );
  }

  const options = {
    httpOnly: true,
    secure: false, // change to true in production with HTTPS
    sameSite: "Lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          roleData,
          accessToken,
          refreshToken,
        },
        "OTP verified, login complete"
      )
    );
});


/**
 * @desc   Resend OTP
 * @route  POST /api/v1/users/resend-otp
 * @access Public
 */
export const resendOtp = asyncHandler(async (req, res) => {
  const tempToken = req.headers["x-temp-token"];

  if (!tempToken) {
    throw new ApiError(400, "Temp token is required");
  }

  let payload;
  try {
    payload = jwt.verify(tempToken, process.env.TEMP_JWT_SECRET);
  } catch {
    throw new ApiError(401, "Temp token invalid or expired");
  }

  await sendOtpHelper(payload.email, payload.purpose);

  return res.status(200).json(
    new ApiResponse(200, { otpSent: true }, "OTP resent successfully")
  );
});




/**
 * @desc   Logout user
 * @route  POST /api/v1/auth/logout
 * @access Private (User)
 */ 
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1, // this removes the field from document
        },
    });

    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

/**
 * @desc   Refresh access token
 * @route  POST /api/v1/auth/refresh-token
 * @access Public
 */ 
const refreshAccessToken = asyncHandler(async (req,res) =>{
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incommingRefreshToken){
        throw new ApiError(401,"Unauthorized Request");
    }
    try {
        const decodedToken = jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id).select(
            "-password -role -avatar"
        );

        if(!user){
            throw new ApiError(401,"Invalid Refresh Token");
        }
        if(incommingRefreshToken != user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used");
        }

        const {accessToken, RefreshToken} = await generateAccessAndRefereshTokens(user._id)
        // Update refresh token in database
        user.refreshToken = RefreshToken;
        await user.save({ validateBeforeSave: false });
        
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", RefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: RefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

});

/** 
 * @desc   Change user password
 * @route  POST /api/v1/auth/change-password
 * @access Private (User)
 */ 
const changeUserPassword = asyncHandler(async (req,res) =>{
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new ApiError(400,"Old password and new password is required");
    }
    const user = await User.findById(req.user?._id);
    
    const isPasswordValid = await user.verifyPassword(oldPassword);
    if(!isPasswordValid){
        throw new ApiError(400,"Old password is incorrect");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(new ApiResponse(200,{}, "Password changed successfully"));
});

/**
 * @desc   Get current user
 * @route  GET /api/v1/auth/me
 * @access Private (User)
 */
const getCurrentUser = asyncHandler(async(req, res) => {
    let roleData = null;
    const loggedInUser=req.user;
    if (loggedInUser.role === 'student') {
        roleData = await Student.findOne({ userId: loggedInUser._id }).select("-parentContact -userId -address -dob -bloodGroup -allergies -height -weight -siblingInfo -parentsInfo -createdAt -updatedAt");
    } else if (loggedInUser.role === 'teacher') {
        roleData = await Teacher.findOne({ userId: loggedInUser._id }).select("-userid -address -phone -createdAt -updatedAt");
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            user:loggedInUser,
            roleData
        },
        "User fetched successfully"
    ))
});

/**
 * @desc   Update user details
 * @route  PUT /api/v1/auth/update
 * @access Private (User)
 */ 
const updateUser = asyncHandler(async(req,res) => {
    // Validate user input
    const { errors } = validateUpdateUserInput(req.body);
    if (errors) {
        return res
            .status(400)
            .json(new ApiResponse(400, errors, "Validation error"));
    }
    
    const {username , fullName} = req.body;

    if(!username && !fullName){
        throw new ApiError(400, "Username or Fullname is required");
    }


     // Check if username already exists (excluding the current user)
     if (username) {
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
          throw new ApiError(400, "Username already exists");
        }
    }
    const user = await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {username, fullName}
        },
        {new: true, runValidators: true }).select("-password -refreshToken");

    if(!user){
        throw new ApiError(500, "User not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

/**
 * @desc   Update user avatar
 * @route  PUT /api/v1/auth/update-avatar
 * @access Private (User)
 */ 
const updateUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.path) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete old avatar if exists
  if (user.avatar) {
    try {
      await deleteFromCloudinary(user.avatar,"edusync/avatars");
    } catch (error) {
      // Continue execution even if deletion fails
    }
  }

  // Upload new avatar
  const avatarLocalPath = req.file.path;
  const avatar = await uploadOnCloudinary(avatarLocalPath, "edusync/avatars");

  if (!avatar?.url) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  // Update avatar in DB
  user.avatar = avatar.url;
  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;
  delete updatedUser.refreshToken;

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar image updated successfully"));
});

/**
 * @desc   Bulk register students from Excel (same class & div for all)
 * @route  POST /api/v1/users/bulk-register-students
 * @access Private (Super Admin)
 */
const bulkRegisterStudents = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Excel file is required");
    }

    const schoolId = req.school?._id;
    if (!schoolId) {
        throw new ApiError(400, "School ID is required");
    }

    // Get class order from school
    const school = await School.findById(schoolId).select("classOrder").lean();
    if (!school) throw new ApiError(404, "School not found");

    const CLASS_ORDER = school.classOrder;

    // Parse Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
        throw new ApiError(400, "Excel sheet is empty");
    }

    // Assuming class/div same for all students, take from first row
    const firstRow = sheetData[0];
    const commonClass = firstRow.class;
    const commonDiv = firstRow.div;

    if (!commonClass || !commonDiv) {
        throw new ApiError(400, "Class and division are required in the first row");
    }

    if (!CLASS_ORDER.includes(String(commonClass))) {
        throw new ApiError(400, `Invalid class: ${commonClass}. Check if class exist in school order`);
    }


    const toCreateUsers = [];
    const failedRows = [];
    const allCredentials = [];

    // Preload existing emails (case-insensitive, trimmed)
    const emailsFromSheet = sheetData.map(r => r.email?.trim().toLowerCase());
    const existingEmails = new Set(
        (await User.find({ email: { $in: emailsFromSheet } }).select("email"))
            .map(u => u.email.toLowerCase())
    );

    for (const [index, row] of sheetData.entries()) {
        try {
            const { fullName, email } = row;

            if (!fullName || !email) {
                failedRows.push({ row: index + 2, reason: "Missing required fields" });
                continue;
            }

            const normalizedEmail = email.trim().toLowerCase();
            if (existingEmails.has(normalizedEmail)) {
                failedRows.push({ row: index + 2, reason: "Email already exists" });
                continue;
            }

            const username = await generateUniqueUsername(fullName);
            //const plainPassword = generateRandomPassword(); To Do : use this 
            const plainPassword  = "admin@123456"; // To Do: Remove this later after testing
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // Push only user data — let Mongo generate _id
            toCreateUsers.push({
                fullName,
                email: normalizedEmail,
                username,
                password: hashedPassword,
                role: "student",
                verified: true,
                schoolId
            });

            // Store credentials for email sending
            allCredentials.push({
                email: normalizedEmail,
                username,
                password: plainPassword
            });

        } catch (err) {
            failedRows.push({ row: index + 2, reason: err.message });
        }
    }

    // Stage 1: Insert users, Mongo creates _id
    const insertedUsers = await User.insertMany(toCreateUsers, { ordered: false });

    // Stage 2: Create Student docs using the actual _id values
    const toCreateStudents = insertedUsers.map(user => ({
        userId: user._id,
        class: commonClass,
        div: commonDiv,
        schoolId
    }));

    await Student.insertMany(toCreateStudents, { ordered: false });

    // ---- Bulk add to chats ----
    const bulkOps = [];

    // Add to school chat
    bulkOps.push({
        updateOne: {
            filter: { name: "School", isGroupChat: true, schoolId },
            update: {
                $addToSet: {
                    participants: { $each: insertedUsers.map(u => u._id) }
                }
            }
        }
    });

    // Add to class/div chat (create if not exists)
    bulkOps.push({
        updateOne: {
            filter: { className: commonClass, div: commonDiv, isGroupChat: true, schoolId },
            update: {
                $setOnInsert: {
                    name: `Class ${commonClass}-${commonDiv}`,
                    isGroupChat: true,
                    schoolId,
                    className: commonClass,
                    div: commonDiv,
                    createdAt: new Date()
                },
                $addToSet: {
                    participants: { $each: insertedUsers.map(u => u._id) }
                }
            },
            upsert: true
        }
    });

    if (bulkOps.length) {
        await Chat.bulkWrite(bulkOps);
    }

    // Send credentials through email
    const emailPromises = allCredentials.map(creds =>
        sendCredentialOverMail(creds.email, {
            username: creds.username,
            password: creds.password
        }).catch(err => {
            console.error(`Failed to send credentials to ${creds.email}: ${err.message}`);
        })
    );

    // This runs all email sends at once (in parallel) and waits for all to complete
    await Promise.all(emailPromises);


    // Remove uploaded file
    try{    
        fs.unlinkSync(req.file.path);
    }catch(err){
        //Skip
    }

    return res.status(201).json(
        new ApiResponse(201, {
            createdCount: insertedUsers.length,
            failed: failedRows
        }, "Bulk student registration completed")
    );
});



export { registerUser, loginUser, logoutUser, refreshAccessToken, changeUserPassword, getCurrentUser, updateUser, updateUserAvatar, bulkRegisterStudents};
