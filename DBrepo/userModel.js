var mongoose = require("mongoose");
var firebase = require("firebase");
var q = require("q");
mongoose.connect("mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app");
var ref = new firebase("https://sales-man-app.firebaseio.com/");
var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    companyName: String,
    email: { type: String, unique: true, require: true },
    password: String,
    createdOn: { type: Date, default: Date.now },
    firebaseToken: String
});
var userModule = mongoose.model("users", userSchema);
////////////////////////////////////////////////////////////////////////////////
var doSignup = function (signupObject) {
    var deferred = q.defer(); // deferred object created
    ref.createUser({
        email: signupObject.email,
        password: signupObject.password
    }, function (error, userData) {
        if (error) {
            //this switch is dealing with errors thrown from firebase createUser
            switch (error.code) {
                case "EMAIL_TAKEN":
                    console.log("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    break;
                default:
                    console.log("Error creating user:", error);
            } // switch ended
        }
        else {
            console.log("Successfully created user account with uid:", userData.uid);
            signupObject.firebaseUid = userData.uid;
            signupOnMongodb(signupObject);
        } // else ended --  will execute if no error from firebase createUser
    }); //createUser ended -- firebase
    return deferred.promise; //promise returned  
};
exports.doSignup = doSignup; //do signup ended
////////////////////////////////////////////////////////////////////////////////////////
var signupOnMongodb = function (signupObject) {
};
