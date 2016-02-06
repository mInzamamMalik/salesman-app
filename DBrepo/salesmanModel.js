var mongoose = require("mongoose"); //mongodb driver
var Firebase = require("firebase");
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
var userModule = mongoose.model("users", userSchema);
//////////////schema and model//////////////////////////////////////////
