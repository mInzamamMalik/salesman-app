var mongoose = require("mongoose"); //mongodb driver
var Firebase = require("firebase");
var q = require("q"); //to return deferred.promise from function
mongoose.connect("mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app");
var ref = new Firebase("https://sales-man-app.firebaseio.com/");
//////////////schema and model///////////////////////////////////////////
var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    companyName: String,
    email: { type: String, unique: true, require: true },
    //password: String,
    createdOn: { type: Date, 'default': Date.now },
    firebaseUid: String
});
var userModule = mongoose.model("users", userSchema);
//////////////schema and model//////////////////////////////////////////
///////////////////////do signup started/////////////////////////////////////////////////////////////////
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
                    break; //
                default:
                    console.log("Error creating user:", error);
                    deferred.reject(error);
            } // switch ended
        }
        else {
            console.log("Successfully created user account with uid:", userData.uid);
            //injecting uid to current userobject
            signupObject.firebaseUid = userData.uid;
            /////==========////
            signupOnMongodb(signupObject).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error); //===>> at this point i have to roll back firebase createUser
            });
        } // else ended -- execute on no-error from firebase createUser
    }); //createUser ended -- firebase    
    return deferred.promise; //promise returned  
};
exports.doSignup = doSignup;
///////////////////////do signup ended/////////////////////////////////////////////////////////////////
//////////////////////////start signup on mongo db////////////////////////////////////////
//this function take userObject with uid and save in mongodb
//return promise with given object on resolve
//retirn promise with mongoose error object on reject`
function signupOnMongodb(signupObject) {
    var deferred = q.defer();
    var newUser = new userModule(signupObject);
    newUser.save(function (err, data) {
        if (!err) {
            console.log(data);
            deferred.resolve(data);
        }
        else {
            console.log(err);
            deferred.reject(err);
        }
    });
    return deferred.promise;
}
///////////////////////end signup on mongo db/////////////////////////////////////////////////////
/////////////////do login started/////////////////////////////////////////////
//this function takes an object wuth email and password property
//and return token if user exist
function doLogin(loginObject) {
    var deferred = q.defer(); // a defered object created
    //console.log("this is under login ", loginObject);
    ref.authWithPassword({
        email: loginObject.email,
        password: loginObject.password
    }, function (error, authData) {
        if (error) {
            //console.log("Login Failed!", error);
            switch (error.code) {
                case "INVALID_USER":
                    deferred.reject({
                        logedIn: false,
                        message: "this email is not exist please signup if this is your first time"
                    });
                    break;
                case "INVALID_USER":
                    deferred.reject({
                        logedIn: false,
                        message: "you have entered an incorrect password"
                    });
                    break;
                default:
                    deferred.reject({
                        logedIn: false,
                        message: error.code
                    });
                    break;
            } ///switch which is handling errors is ended here
        }
        else {
            console.log("Authenticated successfully with payload:", authData);
            deferred.resolve({
                logedIn: true,
                uid: authData.uid,
                token: authData.token,
                email: loginObject.email
            });
        }
    }); //authWithPassword() is ended here
    return deferred.promise;
}
exports.doLogin = doLogin;
//////////////////////////////do login ended/////////////////////////
///////////////this function is now working///////////////////////////////////////
function validateToken(token) {
    var deferred = q.defer();
    ref.auth(token, function (error, result) {
        if (error) {
            console.log("Authentication Failed!", error);
            deferred.reject(error);
        }
        else {
            console.log("Authenticated successfully with payload:", result.auth);
            console.log("Auth expires at:", new Date(result.expires * 1000));
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}
exports.validateToken = validateToken;
///////////////this function is now working///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
function getCompanyProfile(companyFirebaseUid) {
    var deferred = q.defer();
    userModule.findOne({ firebaseUid: companyFirebaseUid }, function (err, user) {
        if (!err) {
            if (!user) {
                // res.redirect('/login?404=user');
                console.log("nai mila: case 1: ", err, user);
                deferred.reject(err);
            }
            else {
                console.log("mil gya: case 2: ", err, user);
                deferred.resolve(user);
            }
        }
        else {
            console.log("case 3: ", err, user);
            //res.redirect('/login?404=error');
            deferred.reject(err);
        }
    });
    return deferred.promise;
}
exports.getCompanyProfile = getCompanyProfile;
//////////////////////////////////////////////////////////////////////////////////////////
