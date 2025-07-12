import mongoose,{ Schema } from "mongoose";

const settingSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});

export const Setting = mongoose.model("Setting", settingSchema);