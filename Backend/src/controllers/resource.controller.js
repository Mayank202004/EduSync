import { SchoolResource } from '../models/resource.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError}  from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Student } from '../models/student.model.js';
import { Teacher } from '../models/teacher.model.js';
import { uploadOnCloudinary, deleteFromCloudinary} from '../utils/cloudinary.js';

/**
 * @desc Add a new class
 * @route POST /api/resource/add-class
 * @access Privte (Super Admin)
 */
export const addClass = asyncHandler(async (req, res) => {
    try {
        const { className } = req.body;

        if (!className) {
            throw new ApiError(400, "Class Name is required.");
        }

        const existingClass = await SchoolResource.findOne({ class:className, schoolId:req.school?._id});
        if (existingClass) {
            throw new ApiError(400, "Class already exists.");
        }

        const newClass = new SchoolResource({ class:className, schoolId: req.school._id });
        await newClass.save();

        res.status(201).json(new ApiResponse(201,newClass,"Class created successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});


/**
 * @desc Get all classes
 * @route GET /api/resource/classes
 * @access Private (Super Admin)
 */
export const getAllClasses = asyncHandler(async (req, res) => {
    try {
        const classes = await SchoolResource.find({schoolId: req.school?._id});
        res.json(new ApiResponse(200,classes,"All classes fetched successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

// Get class by classNumber
export const getClassByNumber = asyncHandler(async (req, res) => {
    try {
        const { classNumber } = req.params;
        const schoolClass = await SchoolResource.findOne({ classNumber, schoolId: req.school?._id });

        if (!schoolClass) {
            throw new ApiError(404, 'Class not found');
        }

        res.json(new ApiResponse(true, 'Class details fetched', schoolClass, 200));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

/**
 * @desc Add a new subject to a class
 * @route POST /api/resource/addSubject
 * @access Private (Super Admin)
 */
export const addSubject = asyncHandler(async (req, res) => {
    try {
        const { className,classId,subjectName } = req.body;

        if (!className && !classId || !className?.trim() && !classId?.trim()) {
            throw new ApiError(400, "Class Name or Class ID is required.");
        }        
        if (!subjectName || subjectName.trim() === '') {
            throw new ApiError(400, "Subject Name is required.");
        }

        const schoolClass = await SchoolResource.findOne({
            schoolId: req.school?._id,
            $or: [{ class: className }, { _id: classId }]
        });
        
        if (!schoolClass) {
            throw new ApiError(404, "Class not found.");
        }
        const existingSubject = schoolClass.subjects.find(sub => sub.subjectName === subjectName);
        if (existingSubject) {
            throw new ApiError(400, "Subject already exists.");
        }

        const newSubject = {
            subjectName,
            terms: [
                { termNumber: 1, chapters: [] },
                { termNumber: 2, chapters: [] }
            ]
        };

        schoolClass.subjects.push(newSubject);
        await schoolClass.save();

        res.json(new ApiResponse(200, schoolClass, "Subject added successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});


/**
 * @desc Add a new term to a subject
 * @route POST /api/resource/add-chapter
 * @access Private (super admin)
 */
export const addChapter = asyncHandler(async (req, res) => {
    try {
        const { className, classId, subjectName, termNumber, chapterName } = req.body;

        if (!(className || classId)) {
            throw new ApiError(400, "Class Name or Class ID is required.");
        }
        if (!subjectName?.trim() || !termNumber?.trim()) {
            throw new ApiError(400, "Subject Name and Term Number are required.");
        }
        if (!chapterName?.trim()) {
            throw new ApiError(400, "Chapter Name is required.");
        }

        const schoolClass = await SchoolResource.findOne({
            schoolId: req.school?._id,
            $or: [{ class: className }, { _id: classId }],
            "subjects.subjectName": subjectName,
            "subjects.terms.termNumber": termNumber
        });
        if (!schoolClass) {
            throw new ApiError(404, "Class, Subject, or Term not found.");
        }

        const subject = schoolClass.subjects.find(sub => sub.subjectName === subjectName);
        if (!subject) {
            throw new ApiError(404, "Subject not found.");
        }

        const term = subject.terms.find(t => t.termNumber === termNumber);
        if (!term) {
            throw new ApiError(404, "Term not found.");
        }

        // Check if chapter already exists
        if (term.chapters.some(ch => ch.chapterName === chapterName)) {
            throw new ApiError(400, "Chapter already exists.");
        }

        term.chapters.push({ chapterName });

        await schoolClass.save();
        res.json(new ApiResponse(200, schoolClass, "Chapter added successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

/**
 * @desc Add a resource to a chapter
 * @route POST /api/resource/add-resource
 * @access Private (Super Admin)
 */
export const addResource = asyncHandler(async (req, res) => {
    try {
        const { className, subjectName, termNumber, chapterName } = req.body;

        // Validate required fields
        if ([className, subjectName, termNumber, chapterName].some(field => !field?.trim())) {
            throw new ApiError(400, "All fields are required.");
        }

        // Check if files exist
        if (!req.files || req.files.length === 0) {
            throw new ApiError(400, "At least one file is required.");
        }

        // Upload each file to Cloudinary
        const uploadedFiles = await Promise.all(
            req.files.map(async (file) => {
                const cloudinaryResponse = await uploadOnCloudinary(file.path,`edusync/resource/${className}/${subjectName}/${chapterName}`);
                if (!cloudinaryResponse) {
                    throw new ApiError(500, "Error while uploading file.");
                }
                return { type: cloudinaryResponse.resource_type, url: cloudinaryResponse.secure_url };
            })
        );

        const updatedClass = await SchoolResource.findOneAndUpdate(
            { 
                schoolId: req.school?._id,
                class: className, 
                "subjects.subjectName": subjectName,  
                "subjects.terms.termNumber": termNumber,  
                "subjects.terms.chapters.chapterName": chapterName  
            },
            {
                $push: { 
                    "subjects.$[subject].terms.$[term].chapters.$[chapter].resources": { $each: uploadedFiles }
                }
            },
            {
                arrayFilters: [
                    { "subject.subjectName": subjectName },  
                    { "term.termNumber": termNumber },      
                    { "chapter.chapterName": chapterName }  
                ],
                new: true
            }
        );

        if (!updatedClass) {
            throw new ApiError(404, "Class, subject, term, or chapter not found.");
        }

        res.status(200).json(new ApiResponse(200,updatedClass, "Resources added successfully"));
    } catch (error) {
        throw new ApiError(400,error.message)
    }
});

/**
 * @desc Delete a resource from a chapter and Cloudinary
 * @route DELETE /api/resource/delete-resource
 * @access Private (Super Admin)
 */
export const deleteResource = asyncHandler(async (req, res) => {
    try {
        const { className, subjectName, termNumber, chapterName, resourceUrl } = req.body;

        if ([className, subjectName, termNumber, chapterName, resourceUrl].some(field => !field?.trim())) {
            throw new ApiError(400, "All fields are required.");
        }

        // Delete from Cloudinary
        const cloudinaryFolderPath = `edusync/resource/${className}/${subjectName}/${chapterName}`;
        await deleteFromCloudinary(resourceUrl, cloudinaryFolderPath);

        const updatedClass = await SchoolResource.findOneAndUpdate(
            {
                schoolId: req.school?._id,
                class: className,
                "subjects.subjectName": subjectName,
                "subjects.terms.termNumber": termNumber,
                "subjects.terms.chapters.chapterName": chapterName
            },
            {
                $pull: {
                    "subjects.$[subject].terms.$[term].chapters.$[chapter].resources": {
                        url: resourceUrl
                    }
                }
            },
            {
                arrayFilters: [
                    { "subject.subjectName": subjectName },
                    { "term.termNumber": termNumber },
                    { "chapter.chapterName": chapterName }
                ],
                new: true
            }
        );

        if (!updatedClass) {
            throw new ApiError(404, "Class, subject, term, or chapter not found.");
        }

        res.status(200).json(new ApiResponse(200, updatedClass, "Resource deleted successfully"));
    } catch (error) {
        throw new ApiError(error.statusCode ?? 400, error.message ?? "Something went wrong");
    }
});


// Delete a class To Do test
export const deleteClass = asyncHandler(async (req, res) => {
    try {
        const { classNumber } = req.params;
        const deletedClass = await SchoolResource.findOneAndDelete({ classNumber, schoolId: req.school?._id });

        if (!deletedClass) {
            throw new ApiError(404,'Class not found');
        }

        res.json(new ApiResponse(true, 'Class deleted successfully', deletedClass, 200));
    } catch (error) {
        throw new ApiError(error.statusCode ?? 500, error.message ?? "Something went wrong");
    }
});

/**
 * @desc Get Students Resources (based on his class)
 * @route /resource/me
 * @access Private (user)
 */
export const getMyResources = asyncHandler(async (req, res) => {
    try{
        if(req.user.role !== 'student'){
            throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
        }
        const userId = req.user._id;

        const student = await Student.findOne({ userId: userId });
        if (!student || !student.class) {
            throw new ApiError(404, "Class not found for this user.");
        }

        const className = student.class;

        const resource = await SchoolResource.findOne({ class: className, schoolId: req.school?._id });
        if (!resource) {
            throw new ApiError(404, "Resource not found for this class.");
        }
        res.status(200).json(new ApiResponse(200, resource.subjects, "Resources fetched successfully"));
    }catch (error) {
        throw new ApiError(500, error.message);
    }
});


/**
 * @desc Get all teacher resources (Based of classes/subjects he/she teaches)
 * @route GET /api/resource/teacher-resource
 * @access Private (Teacher)
 */
export const getTeacherResources = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the teacher based on the userId
        const teacher = await Teacher.findOne({ userId: userId });
        if (!teacher) {
            throw new ApiError(404, "Teacher not found.");
        }

        // Check if the teacher has subjects assigned
        if (!teacher.subjects || teacher.subjects.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], "No subjects assigned to this teacher."));
        }

        // Prepare the result to filter the class and return only those subjects
        const teacherResources = [];

        // Iterate over the teacher's subjects
        for (const subject of teacher.subjects) {
            for (const cls of subject.classes) {
                // Find the class in SchoolResource
                const resource = await SchoolResource.findOne({ class: cls.class, schoolId: req.school?._id });

                let subjectData = {
                    subjectName: subject.name,
                    terms: []
                };

                // If resource exists, get the subject details
                if (resource && resource.subjects) {
                    const foundSubject = resource.subjects.find(resSub => resSub.subjectName === subject.name);

                    if (foundSubject) {
                        subjectData.terms = Array.isArray(foundSubject.terms) 
                            ? foundSubject.terms.map(term => ({
                                termNumber: term.termNumber,
                                chapters: term.chapters || []
                            }))
                            : [];
                    }
                }

                // Check if class is already in the result
                let classIndex = teacherResources.findIndex(item => item.class === cls.class);

                if (classIndex === -1) {
                    // If class doesn't exist, create a new entry
                    teacherResources.push({
                        _id: cls._id,
                        class: cls.class,
                        subjects: [subjectData],
                    });
                } else {
                    // If class exists, add the subject to that class
                    teacherResources[classIndex].subjects.push(subjectData);
                }
            }
        }

        return res.status(200).json(new ApiResponse(200, teacherResources, "Teacher resources fetched successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});
