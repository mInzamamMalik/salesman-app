import express          = require("express");
import mongoose         = require("mongoose");
import firebase         = require("firebase");
import path             = require("path");


//app versioning
var v1 = require("./versions/v1");

let app = express();


app.set('port', (process.env.PORT || 3000));





app.use("/v1", v1 );






let publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

let indexPath = path.resolve(__dirname,"frontendFiles");
app.use(express.static(indexPath));


app.listen(app.get("port"), ()=> {
    console.log('app is running on port', app.get('port'));
});