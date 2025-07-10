import { Schema } from "mongoose";

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

export default mongoose.model("Setting", settingSchema);