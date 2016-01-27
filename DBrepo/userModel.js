var mongoose = require("mongoose");
mongoose.connect("mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app");
var userSchema = new mongoose.Schema({
    firstName: String,
    LastName: String,
    email: { type: String, unique: true, require: true },
    password: String,
    createdOn: { type: Date, default: Date.now },
    firebaseToken: String
});
exports.userModel = mongoose.model("users", userSchema);
