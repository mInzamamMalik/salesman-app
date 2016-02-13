var mongoose = require("mongoose"); //mongodb driver
var Firebase = require("firebase");
var q = require("q"); //to return deferred.promise from function
var ref = new Firebase("https://sales-man-app.firebaseio.com/");
var dbURI = "mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);
////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected");
    // process.exit(1);
});
mongoose.connection.on('disconnected', function () {
    console.log("Mongoose is disconnected");
    process.exit(1);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});
process.on('SIGINT', function () {
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
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
var userModel = mongoose.model("users", userSchema);
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
                deferred.reject(error);
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
    var newUser = new userModel(signupObject);
    newUser.save(function (err, data) {
        if (!err) {
            console.log(data);
            deferred.resolve(data);
        }
        else {
            //===>> at this point i have to roll back firebase createUser
            ref.removeUser({
                email: signupObject.email,
                password: signupObject.password // 
            }, function (err) {
                if (!err) {
                    console.log("removed user"); //
                }
                else {
                    console.log("error during remove user"); //
                } //
            }); //
            //response of this function is not handled yet              //
            //===>> at this point i have to roll back firebase createUser
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
            ///////////////////////////checking that loggedin person is admin or not
            isAdmin(authData.uid).then(function (yes) {
                deferred.resolve({
                    logedIn: true,
                    uid: authData.uid,
                    token: authData.token,
                    email: loginObject.email,
                    photoUrl: authData.password.profileImageURL,
                    isAdmin: true
                });
            }, function (no) {
                deferred.resolve({
                    logedIn: true,
                    uid: authData.uid,
                    token: authData.token,
                    email: loginObject.email,
                    photoUrl: authData.password.profileImageURL,
                    isAdmin: false
                });
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
function isAdmin(companyFirebaseUid) {
    var deferred = q.defer();
    userModel.findOne({ firebaseUid: companyFirebaseUid }, function (err, user) {
        if (!err) {
            if (!user) {
                //user nhe mila
                deferred.reject("NOT_ADMIN");
                return;
            }
            else {
                //user mil gya
                deferred.resolve("ADMIN");
            }
        }
    });
    return deferred.promise;
}
exports.isAdmin = isAdmin;
;
//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
function getCompanyProfile(companyFirebaseUid) {
    var deferred = q.defer();
    userModel.findOne({ firebaseUid: companyFirebaseUid }, function (err, user) {
        if (!err) {
            if (!user) {
                //user nhe mila
                console.log("nai mila: case 1: ", err, user);
                deferred.reject(err);
                return;
            }
            else {
                //user mil gya
                console.log("mil gya: case 2: ", err, user);
                deferred.resolve(user);
            }
        }
    });
    return deferred.promise;
}
exports.getCompanyProfile = getCompanyProfile;
//////////////////////////////////////////////////////////////////////////////////////////
