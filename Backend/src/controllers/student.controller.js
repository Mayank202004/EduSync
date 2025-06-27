import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

/**
 * @desc Add class and division details
 * @route /student/class-details
 * @access Private (Super Admin)
 */
export const addClassDetails = asyncHandler(async (req, res) => {
    const {studId,className,div}=req.body
    
    if (
        [studId,className,div].some(
            (field) => !field?.trim()
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    try{
        const student = await Student.findByIdAndUpdate(studId, {
            class: className,
            div: div
        }, { new: true });
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        await User.findByIdAndUpdate(student.userId, { verified: true });
        
        // Join "School" group
        const schoolChat = await Chat.findOneAndUpdate(
          { name: "School", isGroupChat: true },
          { $addToSet: { participants: user._id } }
        );

        // Join specific "Class" group (e.g., "Class 1-A")
        const classChat = await Chat.findOneAndUpdate(
          { className, div, isGroupChat: true },
          { $addToSet: { participants: user._id } }
        );
        res.status(200).json(new ApiResponse(200,student,"Added class details successfully"));
    }catch(error){
        throw new ApiError(500, error.message);
    }
});

/**
 * @desc Add Parent Information
 * @route /student/parent-details
 * @access Private (Student)
 */
export const addParentInfo = asyncHandler(async (req, res) => {
    const { fatherName, fatherOccupation, fatherIncome, motherName, motherOccupation, motherIncome } = req.body;

    if (
        [fatherName, fatherOccupation, motherName, motherOccupation].some(field => !field?.trim()) ||
        fatherIncome == null || motherIncome == null
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const student = await Student.findOneAndUpdate(
        { userId: req.user._id },
        {
            $set: {
                parentsInfo: {
                    fatherName,
                    fatherOccupation,
                    fatherIncome,
                    motherName,
                    motherOccupation,
                    motherIncome
                }
            }
        },
        { new: true, runValidators: true }
    );

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    res.status(200).json( new ApiResponse(200,student,"Parent information added successfully"));
});

/**
 * @desc Add siblings information
 * @route /student/sibling-details
 * @access Private (Student)
 */
export const addSiblingInfo = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, age, relation, isInSameSchool, class: siblingClass, div } = req.body;

    if (
        [name, relation].some(field => !field?.trim()) ||
        age == null ||
        typeof isInSameSchool !== "boolean"
    ) {
        throw new ApiError(400, "Name, age, relation, and isInSameSchool are required");
    }

    if (!["Brother", "Sister"].includes(relation)) {
        throw new ApiError(400, "Invalid relation. Must be 'Brother' or 'Sister'");
    }

    if (isInSameSchool) {
        if (![siblingClass, div].every(field => field?.trim())) {
            throw new ApiError(400, "Class and division are required when the sibling is in the same school");
        }

        if (!["Jr. KG", "Sr. KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(siblingClass)) {
            throw new ApiError(400, "Invalid class value");
        }

        if (!["A", "B", "C", "D"].includes(div)) {
            throw new ApiError(400, "Invalid division value");
        }
    }

    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const nameExists = student.siblingInfo.some(sib => sib.name.trim().toLowerCase() === name.trim().toLowerCase());

    if (nameExists) {
        throw new ApiError(400, `Sibling with the name '${name}' already exists`);
    }

    const siblingData = {
        name,
        age,
        relation,
        isInSameSchool
    };

    if (isInSameSchool) {
        siblingData.class = siblingClass;
        siblingData.div = div;
    }

    student.siblingInfo.push(siblingData);
    await student.save();

    res.status(200).json({ message: "Sibling added successfully", student });
});

/**
 * @desc Add Physical Information
 * @route /student/physical-details
 * @access Private (sports teacher)
 */
export const addPhysicalInfo = asyncHandler(async (req, res) => {
    const { studId,height, weight } = req.body;

    if(!studId?.trim()){
        throw new ApiError(400,"Student Id is required");
    }

    if (height == null && weight == null) {
        throw new ApiError(400, "At least one of height or weight must be provided");
    }

    const updateData = {};
    if (height != null) updateData.height = height;
    if (weight != null) updateData.weight = weight;

    const student = await Student.findByIdAndUpdate(
        studId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    res.status(200).json({ message: "Physical information updated successfully", student });
});

// Add other details
export const addStudentDetails = asyncHandler(async (req, res) => {
    const { address, dob, bloodGroup } = req.body;

    if (!address?.trim() && !dob && !bloodGroup) {
        throw new ApiError(400, "At least one field (address, dob, or bloodGroup) is required");
    }

    if (bloodGroup && !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodGroup)) {
        throw new ApiError(400, "Invalid blood group");
    }

    const updateData = {};
    if (address?.trim()) updateData.address = address;
    if (dob) updateData.dob = dob;
    if (bloodGroup) updateData.bloodGroup = bloodGroup;

    const student = await Student.findOneAndUpdate(
        { userId: req.user._id },
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    res.status(200).json({ message: "Student details updated successfully", student });
});


// Add Alergies
export const addAllergy = asyncHandler(async (req, res) => {
    const { allergy } = req.body;

    if (!allergy?.trim()) {
        throw new ApiError(400, "Allergy cannot be empty");
    }

    const student = await Student.findOneAndUpdate(
        { userId: req.user._id },
        { $push: { allergies: allergy } }, 
        { new: true, runValidators: true }
    );

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    res.status(200).json(new ApiResponse(200,student,"Allergy added successfully"));
});

// Add Parents Contact
export const addParentContact = asyncHandler(async (req, res) => {
    const { name,relation, phone } = req.body;

    if (!name?.trim() || !phone?.trim() || !relation.trim()) {
        throw new ApiError(400, "name, relation and phone are required");
    }

    const student = await Student.findOneAndUpdate(
        { userId: req.user._id },
        { $push: { parentContact: { name,relation, phone } } }, 
        { new: true, runValidators: true }
    );

    if (!student) {
        throw new ApiError(404, "Student not found");
    }
    res.status(200).json(new ApiResponse(200,student,"Parent contact added successfully"));
});

/**
 * @desc Get students information
 * @route /api/v1/student/me
 * @access Private (Students)  // **To Do: Later add midleware to allow both student and super admin
 */
export const getStudentInfo = asyncHandler(async (req, res) => {
  if (!req.student) {
    throw new ApiError(404, "Student not found");
  }

  const student = await Student.findById(req.student._id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json(new ApiResponse(200, student, "Student info fetched successfully"));
});

/**
 * @desc    Delete sibling info
 * @route   DELETE /api/v1/student/sibling-details/:siblingId
 * @access  Private (User - Self)
 */
export const deleteSiblingInfo = asyncHandler(async (req, res) => {
  const siblingId = req.params.siblingId;
  const studId  = req.student._id;

  const student = await Student.findById(studId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // Check if sibling exists
  const sibling = student.siblingInfo.find(
    (sibling) => sibling._id.toString() === siblingId
  );
  if (!sibling) {
    throw new ApiError(404, "Sibling not found");
  }

  // Remove the sibling
  student.siblingInfo.pull({ _id: siblingId });
  await student.save();

  res
    .status(200)
    .json(new ApiResponse(200, student.siblingInfo, "Sibling info deleted successfully"));
});


