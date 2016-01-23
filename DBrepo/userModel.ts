import mongoose = require("mongoose");
import q = require("q");


let userSchema = new mongoose.Schema({
    firstName : String,
    LastName : String,
    email : {type:String , unique : true , require: true},
    password : String,
    createdOn : {type : Date , default: Date.now}
    ,
    firebaseToken : String
});



let userModel = mongoose.model("users",userSchema);