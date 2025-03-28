import { Schema } from "mongoose";

const studentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    class: {
        type: String,
        enum: ["Jr. KG","Sr. KG","1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    div: {
        type: String,
        enum: ["A", "B", "C", "D"],
    },
    parentContact:[
        {
            relation:{
                type:String,
                required: true
            },
            contact:{
                type:String,
                required: true
            }
        }
    ],
    address: {
        type: String,
    },
    dob: {
        type: Date,
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    allergies: [
        {
            type: String,
        },
    ],
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    parentsInfo:{
        fatherName:{
            type: String,
            required: true
        },
        fatherOccupation:{
            type: String,
            required: true
        },
        fatherIncome:{
            type: Number,
            required: true
        },
        motherName:{
            type: String,
            required: true
        },
        motherOccupation:{
            type: String,
            required: true
        },
        motherIncome:{
            type: Number,
            required: true
        },
    },
    siblingInfo:[
        {
            name:{
                type: String,
                required: true
            },
            age:{
                type: Number,
                required: true
            },
            relation:{
                type: String,
                enum: ["Brother", "Sister"],
                required: true
            },
            isInSameSchool:{
                type: Boolean,
                required: true
            },
            class:{
                type: String,
                enum: ["Jr. KG","Sr. KG","1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            },
            div:{
                type: String,
                enum: ["A", "B", "C", "D"],
            }
        }
    ],
    
});