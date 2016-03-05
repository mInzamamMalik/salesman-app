import express          = require("express");
import mongoose         = require("mongoose");
// import firebase         = require("firebase");
import path             = require("path");
let cors                = require('cors')


//app versioning
var v1 = require("./versions/v1");

let app = express();


app.set('port', (process.env.PORT || 3000));

// abhi tk zaroorat nhe pari iski
app.use( cors() );



app.use("/v1", v1 );







let indexPath = path.resolve(__dirname,"frontendFiles");
app.use(express.static(indexPath));


app.listen(app.get("port"), ()=> {
    console.log('app is running on port', app.get('port'));
});













/////////////////////////////////////////////////////////////////////////////////////////////////
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
