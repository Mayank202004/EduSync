import mongoose,{ Schema } from "mongoose";

const studentSchema = new Schema({
    userId: {
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
    gender: {
        type: String,
        enum: ["male","female","other","unspecified"],
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
                enum: ["Brother", "Sister"],
            },
            isInSameSchool:{
                type: Boolean,
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