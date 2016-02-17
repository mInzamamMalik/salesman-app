var mongoose = require("mongoose"); //mongodb driver
var Firebase = require("firebase");
var ref = new Firebase("https://sales-man-app.firebaseio.com/");
var dbURI = "mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app";
// let dbURI = 'mongodb://localhost/mydatabase';
// mongoose.connect(dbURI);
//////////////order schema and model///////////////////////////////////////////
var orderSchema = new mongoose.Schema({
    companyUid: String,
    salesmanUid: String,
    orderTiile: String,
    orderText: String,
    unRead: { type: Boolean, 'default': true },
    createdOn: { type: Date, 'default': Date.now },
});
var orderModel = mongoose.model("orders", orderSchema);
//////////////order schema and model//////////////////////////////////////////
function placeOrderAsSalesMan(salesmanUid) {
    // interface placeOrderAsSalesMan  {
    //     companyUid :  String, //this will contain company identification of which this order is related
    //     salesmanUid : String, //this will contain sale man identification who is placing this order
    //     orderTiile :  String, //this will contain title text of order
    //     orderText :   String  //this will contain order detail in string
    // }
}
// this is a list of exported functions/methods
// which are exported from this .ts file 
// and free to import in any other .ts file
