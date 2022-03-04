const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requiredDefaultString = {
    type: String,
    default: "",
    required: true,
};

const defaultStatus = {
    type: Boolean,
    default: 1,
    enum: [0, 1],
};

const dataSchema = mongoose.Schema({
    register_no: requiredDefaultString,
    name: requiredDefaultString,
    email: requiredDefaultString,
    password: requiredDefaultString,
    mobile: {
        type: Number,
        default: "",
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "roles",
    },
    is_login: defaultStatus,
    status: defaultStatus,
    created_at: {
        type: Date,
        default: Date.now,
    },
});

mongoDbDisableId(dataSchema);
const result = mongoose.model("users", dataSchema);
module.exports = result;