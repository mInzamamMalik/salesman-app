var mongoose = require("mongoose"); //mongodb driver
var Firebase = require("firebase");
var q = require("q"); //to return deferred.promise from function
var ref = new Firebase("https://sales-man-app.firebaseio.com/");
//////////////schema and model///////////////////////////////////////////
var salesmanSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    companyUid: String,
    email: { type: String, unique: true, require: true },
    //password: String,//password will not be present in mongolab
    createdOn: { type: Date, 'default': Date.now },
    firebaseUid: String
});
var salesmanModel = mongoose.model("salesmans", salesmanSchema);
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
var salesmanSignup = function (signupObject) {
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
exports.salesmanSignup = salesmanSignup;
///////////////////////do signup of sales man ended/////////////////////////////////////////////////////////////////
//////////////////////////start salesman signup on mongo db////////////////////////////////////////
//this function take userObject with uid and save in mongodb
//return promise with given object on resolve
//retirn promise with mongoose error object on reject`
function signupOnMongodb(signupObject) {
    var deferred = q.defer();
    var newUser = new salesmanModel(signupObject);
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
///////////////////////end salesman signup on mongo db/////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
var getSalesmanList = {
    // will be found for getting salesmans list
    //==>salesman schema detail                       
    // firstName: String,
    // lastName: String,
    // companyUid: String, //this will contain company identification of current salesman
    // email: { type: String, unique: true, require: true },
    // //password: String,//password will not be present in mongolab
    // createdOn: { type: Date, 'default': Date.now }, //pack 'default' in single quotes(this is Optional) to avoid compile error
    // firebaseUid: String
    byCompanyId: function (companyFirebaseUid) {
        //this method will take company firebaseUid 
        //and return all salesman list related to the company
        var deferred = q.defer();
        console.log(companyFirebaseUid);
        salesmanModel.find({ companyUid: companyFirebaseUid.toString() }, function (err, userArray) {
            if (!err) {
                deferred.resolve(userArray);
            }
            else {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }
};
exports.getSalesmanList = getSalesmanList;
/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
function getSalesmanProfile(salesmanFirebaseUid) {
    var deferred = q.defer();
    salesmanModel.findOne({ firebaseUid: salesmanFirebaseUid }, function (err, salesman) {
        if (!err) {
            if (!salesman) {
                //user nhe mila
                //console.log("koi salesman nai mila: case 1: ", err, salesman);
                deferred.reject(err);
                return;
            }
            else {
                //user mil gya
                //console.log("salesman mil gya: case 2: ", err, salesman);
                deferred.resolve(salesman);
            }
        }
    });
    return deferred.promise;
}
exports.getSalesmanProfile = getSalesmanProfile;
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// this is a list of exported functions/methods
// which are exported from this .ts file 
// and free to import in any other .ts file
