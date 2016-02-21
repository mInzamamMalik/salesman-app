var express = require("express");
var mongoose = require("mongoose");
// import firebase         = require("firebase");
var path = require("path");
//app versioning
var v1 = require("./versions/v1");
var app = express();
app.set('port', (process.env.PORT || 3000));
app.use("/v1", v1);
var indexPath = path.resolve(__dirname, "frontendFiles");
app.use(express.static(indexPath));
app.listen(app.get("port"), function () {
    console.log('app is running on port', app.get('port'));
});
/////////////////////////////////////////////////////////////////////////////////////////////////
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
