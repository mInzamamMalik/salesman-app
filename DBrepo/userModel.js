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
    console.log("ok");
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
                    deferred.reject("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    deferred.reject("The specified email is not a valid email.");
                    break;
                default:
                    console.log("Error creating user:", error);
                    deferred.reject(error);
            } // switch ended
        }
        else {
            console.log("Successfully created user account with uid:", userData.uid);
            //injecting uid to current userobject
            signupObject.firebaseUid = userData.uid;
            /////////
            signupOnMongodb(signupObject).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error); //===>> at this point i have to roll back firebase createUser
            });
        } // else ended -- execute on no-error from firebase createUser
    }); //createUser ended -- firebase
    return deferred.promise; //promise returned  
};
exports.doSignup = doSignup; //do signup ended
////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////start signup on mongo db////////////////////////////////////////
//this function take userObject with uid and save in mongodb
//return promise with given object on resolve
//retirn promise with mongoose error object on reject`
var signupOnMongodb = function (signupObject) {
    var deferred = q.defer();
    var newUser = new userModule(signupObject);
    newUser.save(function (err, data) {
        if (!err) {
            deferred.resolve(data);
        }
        else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};
///////////////////////end signup on mongo db/////////////////////////////////////////////////////
