const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requiredDefaultString = {
    type: String,
    default: "",
    required: true,
};

const dataSchema = mongoose.Schema({
    name: requiredDefaultString,
    prefix: requiredDefaultString,
    grant_permissions: {
        type: String,
        required: true,
        enum: ["all", "custom"]
    },
    permissions: Schema.Types.Mixed,
    created_at: {
        type: Date,
        default: Date.now,
    },
});

mongoDbDisableId(dataSchema);
const result = mongoose.model("roles_permissions", dataSchema);
module.exports = result;