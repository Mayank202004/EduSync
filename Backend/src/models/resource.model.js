import mongoose from 'mongoose';

//  classes → subjects → terms → chapters → resources
// The following schema represents a class structure for educational resources like ppts,videosetc.

const resourceSchema = new mongoose.Schema({
    type: { type: String, enum: ['ppt', 'pdf', 'video', 'doc', 'link','image'], required: true },
    url: { type: String, required: true },
    description: String
});

const chapterSchema = new mongoose.Schema({
    chapterName: { type: String, required: true },
    resources: [resourceSchema]
});

const termSchema = new mongoose.Schema({
    termNumber: { type: String, enum: ["1", "2"], required: true },
    chapters: [chapterSchema]
});

const subjectSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    terms: [termSchema]
});

const classSchema = new mongoose.Schema({
    class: { type: String, required: true },  
    subjects: [subjectSchema]
});

export const SchoolResource = mongoose.model('Resource', classSchema);

