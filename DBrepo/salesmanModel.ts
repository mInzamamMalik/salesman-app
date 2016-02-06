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

let userModule = mongoose.model("users", userSchema);
//////////////schema and model//////////////////////////////////////////
