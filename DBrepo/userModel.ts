import mongoose = require("mongoose"); //mongodb driver
import Firebase = require("firebase");
import q = require("q");

mongoose.connect("mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app");
let ref = new Firebase("https://sales-man-app.firebaseio.com/");




//////////////schema and model//////////////////////////////////////////
let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    companyName: String, //this will contain company display name
    email: { type: String, unique: true, require: true },
    password: String,
    createdOn: { type: Date, 'default': Date.now }, //pack 'default' in single quotes(this is Optional) to avoid compile error
    firebaseUid: String
});

let userModule = mongoose.model("users", userSchema);
//////////////schema and model//////////////////////////////////////////







///////////////////////do signup started/////////////////////////////////////////////////////////////////
let doSignup = (signupObject) => {

    console.log("ok");

    let deferred = q.defer();// deferred object created

    ref.createUser({

        email: signupObject.email,
        password: signupObject.password

    }, (error, userData) => {

        if (error) { //if error in firebase createUser this if will execute           
            
            //this switch is dealing with errors thrown from firebase createUser
            switch (error.code) {
                case "EMAIL_TAKEN":
                    console.log("The new user account cannot be created because the email is already in use.");
                    deferred.reject("The new user account cannot be created because the email is already in use.");
                    break;

                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    deferred.reject("The specified email is not a valid email.");
                    break;//
                    
                default:
                    console.log("Error creating user:", error);
                    deferred.reject(error);
            }// switch ended
            
        } else { // if no-error in firebase createUser this else will execute            

            console.log("Successfully created user account with uid:" , userData.uid);
            
            //injecting uid to current userobject
            signupObject.firebaseUid = userData.uid;
            

            /////==========////
            signupOnMongodb(signupObject).then((data) => {
                deferred.resolve(data);
            },
                (error) => {
                    deferred.reject(error);//===>> at this point i have to roll back firebase createUser
                });
            /////==========//// 
            
            

        }// else ended -- execute on no-error from firebase createUser

    })//createUser ended -- firebase    
    
    return deferred.promise; //promise returned  
}
///////////////////////do signup ended/////////////////////////////////////////////////////////////////





//////////////////////////start signup on mongo db////////////////////////////////////////
//this function take userObject with uid and save in mongodb

//return promise with given object on resolve
//retirn promise with mongoose error object on reject`
function signupOnMongodb(signupObject) {
    
    let deferred = q.defer();

    let newUser = new userModule(signupObject);
    newUser.save((err, data) => {

        if (!err) {
            
            console.log(data);
            deferred.resolve(data);
            
        } else {
            
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

    let deferred = q.defer();
    
    //console.log("this is under login ", loginObject);

    ref.authWithPassword({

        email       : loginObject.email,
        password    : loginObject.password

    }, function(error, authData) {

        if (error) {
            console.log("Login Failed!", error);
            
            deferred.reject({
                 logedIn : false,
                 message : error
            });
            
        } else {
            console.log("Authenticated successfully with payload:", authData);
            deferred.resolve({
                 logedIn : true,
                 uid : authData.uid,
                 token : authData.token
            });
        }

    });
    return deferred.promise;
}
//////////////////////////////do login ended/////////////////////////







export { doSignup, doLogin }

