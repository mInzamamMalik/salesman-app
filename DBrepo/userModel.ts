import mongoose = require("mongoose"); //mongodb driver
import Firebase = require("firebase");
import q = require("q"); //to return deferred.promise from function

let ref = new Firebase("https://sales-man-app.firebaseio.com/");

let dbURI = "mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);




////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function() {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function() {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function(err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function() {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function() {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////







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

let userModel = mongoose.model("users", userSchema);
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
                    deferred.reject(error);
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

    let newUser = new userModel(signupObject);
    newUser.save((err, data) => {

        if (!err) {

            console.log(data);
            deferred.resolve(data);

        } else {
            
            //===>> at this point i have to roll back firebase createUser
            ref.removeUser({                                            //
                email: signupObject.email,                          //
                password: signupObject.password                   // 
            }, (err) => {                                                  //
                if (!err) {                                               //
                    console.log("removed user");                        //
                } else {                                                  //
                    console.log("error during remove user");            //
                }                                                       //
            });                                                         //
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
            
            
            ///////////////////////////checking that loggedin person is admin or not
            isAdmin(authData.uid).then(
                (yes) => {

                    deferred.resolve({
                        logedIn: true,
                        uid: authData.uid,
                        token: authData.token,
                        email: loginObject.email,
                        photoUrl: authData.password.profileImageURL,
                        isAdmin: true
                    });


                }, (no) => {

                    deferred.resolve({
                        logedIn: true,
                        uid: authData.uid,
                        token: authData.token,
                        email: loginObject.email,
                        photoUrl: authData.password.profileImageURL,
                        isAdmin: false
                    });

                });    
            //////////////////////////       
            

            
            
            /*
                       
           { provider: 'password',
             uid: '997e255d-d76a-48ca-9909-b0f1063c359c',
             token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InByb3ZpZGVyIjoicGFzc3dvcmQiLCJ1aWQiOiI5OTdlMjU1ZC1kNzZhLTQ4Y2EtOTkwOS1iMGYxMDYzYzM1OWMifSwiaWF0IjoxNDU0NzEwOTQxfQ.tAGWXnJxGPk4cukaP3wRMBwOcjUs9tvRD0xvMWO9q5M',
             password: 
              { email: 'malikasinger@gmail.com',
                isTemporaryPassword: false,
                profileImageURL: 'https://secure.gravatar.com/avatar/1eb899bbc24cd82bd9ef9dbbe10c5b82?d=retro' },
             auth: 
              { provider: 'password',
                uid: '997e255d-d76a-48ca-9909-b0f1063c359c' },
             expires: 1454797341 }
           
           */
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


function isAdmin(companyFirebaseUid) {

    let deferred = q.defer();

    userModel.findOne({ firebaseUid: companyFirebaseUid }, (err, user) => {
        if (!err) {
            if (!user) {
                //user nhe mila
                deferred.reject("NOT_ADMIN");
                return;
            } else {
                //user mil gya
                deferred.resolve("ADMIN");
            }
            //this area should not execute if user not found 
            //and you may execute this area if user found
        }

    })
    return deferred.promise;
};
//////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////
function getCompanyProfile(companyFirebaseUid) {

    let deferred = q.defer();

    userModel.findOne({ firebaseUid: companyFirebaseUid }, (err, user) => {

        if (!err) {
            if (!user) {
                //user nhe mila
                console.log("nai mila: case 1: ", err, user);
                deferred.reject(err);
                return;
            } else {
                //user mil gya
                console.log("mil gya: case 2: ", err, user);

                deferred.resolve(user);
                
                //console.log("console after resolve will not work");
                // req.session.user = {
                // "name": user.name,
                // "email": user.email,
                // "_id": user._id
                // };
            }
            //this area should not execute if user not found
            //and you may execute this area if user found
        }
    });

    return deferred.promise;
}
//////////////////////////////////////////////////////////////////////////////////////////







export { doSignup, doLogin, validateToken, getCompanyProfile, isAdmin }

