import mongoose = require("mongoose"); //mongodb driver
import Firebase = require("firebase");
import q = require("q"); //to return deferred.promise from function

mongoose.connect("mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app");
let ref = new Firebase("https://sales-man-app.firebaseio.com/");




//////////////schema and model///////////////////////////////////////////
let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    companyName: String, //this will contain company display name
    email: { type: String, unique: true, require: true },
    //password: String,
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

            console.log("Successfully created user account with uid:", userData.uid);
            
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

    let deferred = q.defer(); // a defered object created
    
    //console.log("this is under login ", loginObject);

    ref.authWithPassword({ // authWithPassword() is a function which is proveded by firebase for authenticate user

        email: loginObject.email,
        password: loginObject.password

    }, (error, authData) => { // a callback function to authWithPassword()

        if (error) { /// if any error occured during login this if will execute
            
            //console.log("Login Failed!", error);

            switch (error.code) { //this switch taking error string and reject promise with a custom message 

                case "INVALID_USER": //this case should true if user login with an email which is not exist

                    deferred.reject({
                        logedIn: false,
                        message: "this email is not exist please signup if this is your first time"
                    });
                    break;

                case "INVALID_USER": //this case should true if user enter correct email and invalid password

                    deferred.reject({
                        logedIn: false,
                        message: "you have entered an incorrect password"
                    });
                    break;

                default:// if no expected case will matched this will execute
                    deferred.reject({
                        logedIn: false,
                        message: error.code
                    });
                    break;
            }///switch which is handling errors is ended here

        
        } else { // if no error occured this else will execute and resolve promise with token and other auth data


            console.log("Authenticated successfully with payload:", authData);

            deferred.resolve({
                logedIn: true,
                uid: authData.uid,
                token: authData.token,
                email: loginObject.email
            });
        }

    });//authWithPassword() is ended here
    
    return deferred.promise;
}
//////////////////////////////do login ended/////////////////////////


///////////////this function is now working///////////////////////////////////////
function validateToken(token) {
    
    let deferred = q.defer();

    ref.auth(token, function(error, result) {
        if (error) {
            console.log("Authentication Failed!", error);
            
            deferred.reject(error);
            
        } else {
            console.log("Authenticated successfully with payload:", result.auth);
            console.log("Auth expires at:", new Date(result.expires * 1000));
            deferred.resolve(result);
        }
    });
return deferred.promise;
}
///////////////this function is now working///////////////////////////////////////








////////////////////////////////////////////////////////////////////////////////////////
function getCompanyProfile(companyFirebaseUid) {

    userModule.findOne({ firebaseUid: companyFirebaseUid }, (err, user) => {

        if (!err) {
            if (!user) {
                // res.redirect('/login?404=user');
                console.log("nai mila: case 1: ",err,user);
            } else {
                console.log("mil gya: case 2: ",err,user);
                // req.session.user = {
                // "name": user.name,
                // "email": user.email,
                // "_id": user._id
                // };
            }

        }else{
            console.log("case 3: ",err,user);
            //res.redirect('/login?404=error');
        }
    });
}
//////////////////////////////////////////////////////////////////////////////////////////







export { doSignup, doLogin, validateToken, getCompanyProfile }

