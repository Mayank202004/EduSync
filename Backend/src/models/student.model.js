import mongoose,{ Schema } from "mongoose";
import { CLASS_ORDER, DIVISIONS, BLOOD_GROUPS, GENDERS, RELATIONS } from "../constants/student.constants.js";


const studentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    class: {
        type: String,
        enum: CLASS_ORDER,
    },
    div: {
        type: String,
        enum: DIVISIONS,
    },
    parentContact:[
        {
            name:{
                type:String
            },
            relation:{
                type:String,
            },
            phone:{
                type:String,
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
        enum: BLOOD_GROUPS,
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
    gender: {
        type: String,
        enum: GENDERS,
        default:"unspecified"
    },
    parentsInfo:{
        fatherName:{
            type: String,
        },
        fatherOccupation:{
            type: String,
        },
        fatherIncome:{
            type: Number,
        },
        motherName:{
            type: String,
        },
        motherOccupation:{
            type: String,
        },
        motherIncome:{
            type: Number,
        },
    },
    siblingInfo:[
        {
            name:{
                type: String,
            },
            age:{
                type: Number,
            },
            relation:{
                type: String,
                enum: RELATIONS,
            },
            isInSameSchool:{
                type: Boolean,
            },
            class:{
                type: String,
                enum: CLASS_ORDER,
            },
            div:{
                type: String,
                enum: DIVISIONS,
            }
        }
    ],
    schoolTransport:{
        type: Boolean,
        default:false
    },
    stopName:{
        type: String,
        default:"N.A."
    }
    
});

export const Student = mongoose.model("Student", studentSchema);