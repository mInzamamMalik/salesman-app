import mongoose = require("mongoose");
import q = require("q");
mongoose.connect("mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app");

let userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    companyName : String,
    email : {type:String , unique : true , require: true},
    password : String,
    createdOn : {type : Date , default: Date.now},
    firebaseToken : String
});



let userModule = mongoose.model("users",userSchema);
module.exports = userModule;

