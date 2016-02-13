import mongoose = require("mongoose"); //mongodb driver
import Firebase = require("firebase");
import q = require("q"); //to return deferred.promise from function

let ref = new Firebase("https://sales-man-app.firebaseio.com/");
let dbURI = "mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app";
// let dbURI = 'mongodb://localhost/mydatabase';
// mongoose.connect(dbURI);




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
let salesmanSchema = new mongoose.Schema({

    firstName: String,
    lastName: String,
    companyUid: String, //this will contain company identification of current salesman
    email: { type: String, unique: true, require: true },
    //password: String,//password will not be present in mongolab
    createdOn: { type: Date, 'default': Date.now }, //pack 'default' in single quotes(this is Optional) to avoid compile error
    firebaseUid: String
});

let salesmanModel = mongoose.model("salesmans", salesmanSchema);
//////////////schema and model//////////////////////////////////////////








///////////////////////do signup of sales man started/////////////////////////////////////////////////////////////////
//  this function will take an object in input like this object
// {
//     firstName: String,
//     lastName: String,
//     companyUid: String,
//     email: { type: String, unique: true, require: true }, 
//     password : string   
//     createdOn: { type: Date, 'default': Date.now }, 
//     firebaseUid: String
// }


let salesmanSignup = (signupObject) => {

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
///////////////////////do signup of sales man ended/////////////////////////////////////////////////////////////////





//////////////////////////start salesman signup on mongo db////////////////////////////////////////
//this function take userObject with uid and save in mongodb

//return promise with given object on resolve
//retirn promise with mongoose error object on reject`
function signupOnMongodb(signupObject) {

    let deferred = q.defer();

    let newUser = new salesmanModel(signupObject);
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
///////////////////////end salesman signup on mongo db/////////////////////////////////////////////////////



let getSalesmanList = {// this is an object of functions, in which varity of functions
                       // will be found for getting salesmans list

    //==>salesman schema detail                       
    // firstName: String,
    // lastName: String,
    // companyUid: String, //this will contain company identification of current salesman
    // email: { type: String, unique: true, require: true },
    // //password: String,//password will not be present in mongolab
    // createdOn: { type: Date, 'default': Date.now }, //pack 'default' in single quotes(this is Optional) to avoid compile error
    // firebaseUid: String
    
    byCompanyId: (firebaseUid) => {//this method will take company firebaseUid 
                                   //and return all salesman list related to the company
        let deferred = q.defer();
        
        salesmanModel.find({ firebaseUid: firebaseUid },
            (err, userArray) => {
                if (!err) {
                    deferred.resolve(userArray);
                }else{
                    deferred.reject(err);   
                }
            });
        
        return deferred.promise;
    }



}


















// this is a list of exported functions/methods
// which are exported from this .ts file 
// and free to import in any other .ts file
export { salesmanSignup, getSalesmanList }