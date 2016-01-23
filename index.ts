import express = require("express");
import mongoose = require("mongoose");
import firebase = require("firebase");


let app = express();


app.listen(3000, ()=> {
    console.log("listening at 3000");
});