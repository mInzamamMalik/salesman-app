import express          = require("express");
import mongoose         = require("mongoose");
import firebase         = require("firebase");
import bodyParser       = require("body-parser");
import path             = require("path");

let app = express();

app.set('port', (process.env.PORT || 3000));


let publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));


app.use(bodyParser.json());

app.use("/", (req:express.Request, res:express.Response, next:Function)=> {

    res.sendFile("index.html");

});


app.listen(app.get("port"), ()=> {

    console.log('app is running on port', app.get('port'));
});