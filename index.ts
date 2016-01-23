import express = require("express");
import mongoose = require("mongoose");
import firebase = require("firebase");


let app = express();
app.set('port', (process.env.PORT || 5000));


app.use((req:express.Request, res:express.Response, next:Function)=> {

    res.send("hello world");

});


app.listen(app.get("port"), ()=> {

    console.log('app is running on port', app.get('port'));
});