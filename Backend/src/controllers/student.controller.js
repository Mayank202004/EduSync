import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import School from "../models/school.model.js";
import { ClassStructure } from "../models/classStructure.model.js";
import { deleteAllAttendance } from "./attendence.controller.js";

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
        const student = await Student.findOneAndUpdate({_id:studId, schoolId: req.school?._id}, {
            class: className,
            div: div
        }, { new: true });
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        await User.findOneAndUpdate({_id:student.userId,schoolId: req.school?._id}, { verified: true });
        
        // Join "School" group
        const schoolChat = await Chat.findOneAndUpdate(
          { name: "School", isGroupChat: true, schoolId: req.school?._id },
          { $addToSet: { participants: student.userId } }
        );

        // Join specific "Class" group (e.g., "Class 1-A") / Create new if not present
        // Check if class chat exists
        let classChat = await Chat.findOne({ className, div, isGroupChat: true, schoolId: req.school?._id });

        if (classChat) {
          // Update to add participant only if not already present
          classChat = await Chat.findOneAndUpdate(
            {_id:classChat._id ,schoolId: req.school?._id},
            { $addToSet: { participants: student.userId } },
            { new: true }
          );
        } else {
          // Create new class chat
          classChat = await Chat.create({
            name: `Class ${className}-${div}`,
            isGroupChat: true,
            className,
            div,
            schoolId: req.school?._id,
            participants: [student.userId],
          });
        }
        
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

    res.status(200).json(new ApiResponse(200,null,"Physical information added successfully"));
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

/**
 * @desc Add Parent Contact
 * @route /student/parent-contact
 * @access Private (student)
 */
export const addParentContact = asyncHandler(async (req, res) => {
  const { name, relation, phone } = req.body;

  if (!name?.trim() || !relation?.trim() || !phone?.trim()) {
    throw new ApiError(400, "Name, relation, and phone are required");
  }

  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const existingContacts = student.parentContact || [];

  const normalizedRelation = relation.trim().toLowerCase();
  const normalizedName = name.trim().toLowerCase();

  // Check if already existing
  if (["father", "mother"].includes(normalizedRelation)) {
    const alreadyHasRelation = existingContacts.some(
      (contact) => contact.relation.trim().toLowerCase() === normalizedRelation
    );
    if (alreadyHasRelation) {
      throw new ApiError(400, `Contact with relation '${relation}' already exists`);
    }
  } else {
    const nameExists = existingContacts.some(
      (contact) => contact.name.trim().toLowerCase() === normalizedName
    );
    if (nameExists) {
      throw new ApiError(400, `Contact with name '${name}' already exists`);
    }
  }

  // Push new contact
  student.parentContact.push({ name, relation, phone });
  await student.save();

  res
    .status(200)
    .json(new ApiResponse(200, student, "Parent contact added successfully"));
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

/**
 * @desc    Delete parent contact
 * @route   DELETE /api/v1/student/parent-contact/:contactId
 * @access  Private (User - Self)
 */
export const deleteParentContact = asyncHandler(async (req, res) => {
  const contactId = req.params.contactId;
  const studId = req.student._id;

  const student = await Student.findById(studId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // Ensure there is more than one contact before allowing deletion
  if (student.parentContact.length <= 1) {
    throw new ApiError(400, "At least one parent contact must be present");
  }

  const contact = student.parentContact.find(
    (c) => c._id.toString() === contactId
  );

  if (!contact) {
    throw new ApiError(404, "Parent contact not found");
  }

  student.parentContact.pull({ _id: contactId });
  await student.save();

  res.status(200).json(
    new ApiResponse(200, student.parentContact, "Parent contact deleted successfully")
  );
});

/**
 * @desc Delete Allergy
 * @route DELETE /api/v1/student/allergy/:allergyName
 * @access Private (User - Self)
 */
export const deleteAllergy = asyncHandler(async (req, res) => {
  const {  allergyName } = req.body;
  const studId = req.student._id;

  const student = await Student.findById(studId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const allergyToDelete = student.allergies.find(
    (a) => a.trim().toLowerCase() === allergyName.trim().toLowerCase()
  );

  if (!allergyToDelete) {
    throw new ApiError(404, `Allergy '${allergyName}' not found`);
  }

  student.allergies.pull(allergyToDelete);

  await student.save();

  res.status(200).json(
    new ApiResponse(200, student.allergies, `Allergy '${allergyName}' deleted successfully`)
  );
});

/**
 * @desc Fetch unverified Students
 * @route GET /api/v1/student/unverified
 * @access Private (Super Admin)
 */
export const getUnverifiedStudents = asyncHandler(async (req, res) => {
  const unverifiedStudents = await Student.find({
    class: { $exists: true, $ne: "" }, // Only filter class here
    schoolId: req.school?._id
  })
    .populate({
      path: "userId",
      match: { role: "student", verified: false }, // Filter based on user fields
      select: "fullName email role verified",       // Select only necessary user fields
    })
    .select("class userId");

  // Filter out where populate() failed (no match)
  const filtered = unverifiedStudents.filter((s) => s.userId);

  res.status(200).json(
    new ApiResponse(200, filtered, "Unverified students fetched successfully")
  );
});

/**
 * @desc Promote students to next class
 * @route PATCH /api/v1/student/promote
 * @access Private (Super Admin)
 */
export const promoteStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({schoolId: req.school?._id}).populate("userId", "verified");

  const studentBulkOps = [];
  const userBulkOps = [];

  const school = await School.findById(req.school?._id).select("classOrder").lean();
  const classOrder = school.classOrder;


  for (const student of students) {
    // Skip if class and div are both missing (already graduated or unverified)
    if ((!student.class && !student.div ) || !student.userId.verified) continue;

    const currentClass = student.class;
    const index = classOrder.indexOf(currentClass);

    if (index === -1 || index === classOrder.length - 1) {
      // Graduate: null class/div, mark user unverified
      studentBulkOps.push({
        updateOne: {
          filter: { _id: student._id },
          update: {
            $set: {
              class: null,
              div: null,
            },
          },
        },
      });

      if (student.userId) {
        userBulkOps.push({
          updateOne: {
            filter: { _id: student.userId._id },
            update: { $set: { verified: false } },
          },
        });
      }
    } else {
      // Promote to next class
      studentBulkOps.push({
        updateOne: {
          filter: { _id: student._id },
          update: { $set: { class: classOrder[index + 1] } },
        },
      });
    }
  }
  if (studentBulkOps.length > 0) {
    await Student.bulkWrite(studentBulkOps);
  }
  if (userBulkOps.length > 0) {
    await User.bulkWrite(userBulkOps);
  }
  deleteAllAttendance(req.school?._id);
  res.status(200).json(new ApiResponse(200, {}, "Students promoted successfully"));
});


/**
 * @desc Shuffle divisions
 * @route PATCH /api/v1/student/shuffle
 * @access Private (Super Admin)
 */
export const shuffleDivisions = asyncHandler(async (req, res) => {
  const updatedChatParticipants = {}; // { "1-A": [userId1, userId2], ... }

  const school = await School.findById(req.school?._id).select("classOrder").lean();
  const classOrder = school.classOrder;

  for (const className of classOrder) {
    // Fetch class structure
    const classStructure = await ClassStructure.findOne({
      className,
      schoolId: req.school?._id,
    });

    if (!classStructure || classStructure.divisions.length === 0) continue;

    const divisions = classStructure.divisions;

    // Get verified students
    const students = await Student.find({ class: className, schoolId: req.school?._id })
      .populate({
        path: "userId",
        match: { verified: true },
        select: "_id verified",
      }).lean();

    const verifiedStudents = students.filter((s) => s.userId);
    if (verifiedStudents.length === 0) continue;

    const shuffled = verifiedStudents.sort(() => Math.random() - 0.5);

    const bulkOps = [];

    for (let i = 0; i < shuffled.length; i++) {
      const student = shuffled[i];
      const assignedDiv = divisions[i % divisions.length];

      // Collect for chat update
      const key = `${className}-${assignedDiv}`;
      if (!updatedChatParticipants[key]) updatedChatParticipants[key] = [];
      updatedChatParticipants[key].push(student.userId._id);

      // Add to student bulk update
      bulkOps.push({
        updateOne: {
          filter: { _id: student._id },
          update: { $set: { div: assignedDiv } },
        },
      });
    }

    await Student.bulkWrite(bulkOps);
  }

  // Update Chat participants for each class-division chat
  const chatBulkOps = [];

  for (const key in updatedChatParticipants) {
    const [className, div] = key.split("-");
    chatBulkOps.push({
      updateOne: {
        filter: {
          className,
          div,
          isGroupChat: true,
          schoolId: req.school?._id,
        },
        update: {
          $set: {
            participants: updatedChatParticipants[key],
          },
        },
      },
    });
  }

  if (chatBulkOps.length > 0) {
    await Chat.bulkWrite(chatBulkOps);
  }
  deleteAllAttendance(req.school?._id);

  res.status(200).json(new ApiResponse(200, {}, "Divisions shuffled and chat participants updated successfully"));
});


/**
 * @desc Manually assign divisions
 * @route PATCH /api/v1/student/assign-divisions
 * @access Private (Super Admin)
 */
export const manuallyAssignDivisions = asyncHandler(async (req, res) => {
  const { className, assignments } = req.body;

  if (!className || !Array.isArray(assignments) || assignments.length === 0) {
    throw new ApiError(400, "className and assignments are required");
  }

  // Verify students
  const studentIds = assignments.map((a) => a._id);
  const existingStudents = await Student.find({
    _id: { $in: studentIds },
    class: className,
    schoolId: req.school?._id,
  }).populate({
    path: "userId",
    match: { verified: true },
    select: "_id verified",
  });

  if (existingStudents.length !== assignments.length) {
    throw new ApiError(400, "Some students do not exist or are not in the specified class");
  }

  // Map studentId to userId for chat updates
  const userMap = {};
  for (const student of existingStudents) {
    if (student.userId) {
      userMap[student._id.toString()] = student.userId._id;
    }
  }

  const bulkOps = [];
  const chatParticipants = {}; // { "A": [userId1, userId2], ... }

  for (const { _id, div } of assignments) {
    bulkOps.push({
      updateOne: {
        filter: { _id, class: className },
        update: { $set: { div } },
      },
    });

    const userId = userMap[_id];
    if (userId) {
      if (!chatParticipants[div]) chatParticipants[div] = [];
      chatParticipants[div].push(userId);
    }
  }

  // Apply student updates
  await Student.bulkWrite(bulkOps);

  // Update or create chat for each division
  for (const [div, userIds] of Object.entries(chatParticipants)) {
    await Chat.findOneAndUpdate(
      {
        className,
        div,
        isGroupChat: true,
        schoolId: req.school?._id,
      },
      {
        $set: {
          participants: userIds,
          name: `Class ${className}-${div}`,
        },
      },
      { upsert: true, new: true }
    );
  }
  deleteAllAttendance(req.school?._id,className);

  res.status(200).json(new ApiResponse(200, {}, "Divisions manually assigned and chats updated successfully"));
});
