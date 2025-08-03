import mongoose,{ Schema } from "mongoose";

const settingSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School",
        required: true,
    },
});

export const Setting = mongoose.model("Setting", settingSchema);