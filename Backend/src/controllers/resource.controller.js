import { SchoolResource } from '../models/resource.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError}  from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Student } from '../models/student.model.js';

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

        const existingClass = await SchoolResource.findOne({ className });
        if (existingClass) {
            throw new ApiError(400, "Class already exists.");
        }

        const newClass = new SchoolResource({ class:className });
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
export const getAllClasses = asyncHandler(async (_, res) => {
    try {
        const classes = await SchoolResource.find();
        res.json(new ApiResponse(200,classes,"All classes fetched successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

// Get class by classNumber
export const getClassByNumber = asyncHandler(async (req, res) => {
    try {
        const { classNumber } = req.params;
        const schoolClass = await SchoolResource.findOne({ classNumber });

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
export const addSubject = asyncHandler(async (req, res, next) => {
    try {
        const { className,classId,subjectName } = req.body;

        if (!className && !classId || !className?.trim() && !classId?.trim()) {
            throw new ApiError(400, "Class Name or Class ID is required.");
        }        
        if (!subjectName || subjectName.trim() === '') {
            throw new ApiError(400, "Subject Name is required.");
        }

        const schoolClass = await SchoolResource.findOne({
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


// Add a resource to a chapter
export const addResource = async (req, res, next) => {
    try {
        const { classNumber, subjectName, termNumber, chapterTitle } = req.params;
        const { type, url, description } = req.body;

        const schoolClass = await SchoolResource.findOne({ classNumber });
        if (!schoolClass) return next(new ApiError('Class not found', 404));

        const subject = schoolClass.subjects.find(sub => sub.name === subjectName);
        if (!subject) return next(new ApiError('Subject not found', 404));

        const term = subject.terms.find(term => term.termNumber == termNumber);
        if (!term) return next(new ApiError('Term not found', 404));

        const chapter = term.chapters.find(chap => chap.title === chapterTitle);
        if (!chapter) return next(new ApiError('Chapter not found', 404));

        chapter.resources.push({ type, url, description });
        await schoolClass.save();

        res.json(new ApiResponse(true, 'Resource added successfully', schoolClass, 200));
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

// Delete a class
export const deleteClass = async (req, res, next) => {
    try {
        const { classNumber } = req.params;
        const deletedClass = await SchoolResource.findOneAndDelete({ classNumber });

        if (!deletedClass) {
            return next(new ApiError('Class not found', 404));
        }

        res.json(new ApiResponse(true, 'Class deleted successfully', deletedClass, 200));
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
};

export const getMyResources = asyncHandler(async (req, res) => {
    try{
        if(req.user.role !== 'student'){
            throw new ApiError(403, "Forbidden: You do not have permission to access this resource.");
        }
        const userId = req.user._id;
        const className = Student.findById(userId).class;
        if (!className) {
            throw new ApiError(404, "Class not found for this user.");
        }

        const resource = SchoolResource.findOne({ class: className });
        if (!resource) {
            throw new ApiError(404, "Resource not found for this class.");
        }
        res.status(200).json(new ApiResponse(200, resource, "Resources fetched successfully"));
    }catch (error) {
        throw new ApiError(500, error.message);
    }
});