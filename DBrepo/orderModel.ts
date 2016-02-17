import mongoose = require("mongoose"); //mongodb driver
import Firebase = require("firebase");
import q = require("q"); //to return deferred.promise from function

let ref = new Firebase("https://sales-man-app.firebaseio.com/");
let dbURI = "mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app";
// let dbURI = 'mongodb://localhost/mydatabase';
// mongoose.connect(dbURI);

//db methods
import { getSalesmanProfile } from "./../DBrepo/salesmanModel";




//////////////order schema and model///////////////////////////////////////////
let orderSchema = new mongoose.Schema({

    companyUid: String, //this will contain company identification of which this order is related
    salesmanUid: String, // this will contain sale man identification who is placing this order
    orderTiile: String, // this will contain title text of order
    orderText: String, //this will contain order detail in string
    unRead: { type: Boolean, 'default': true },
    createdOn: { type: Date, 'default': Date.now }, //pack 'default' in single quotes(this is Optional) to avoid compile error
    
});


let orderModel = mongoose.model("orders", orderSchema);
//////////////order schema and model//////////////////////////////////////////




















//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//this function will place order as salesman , take input salesman uid and order detail
//then 
function placeOrderAsSalesMan(salesmanUid, orderTitle, orderText) {

    // interface placeOrderAsSalesMan  {
    //     companyUid :  String, //this will contain company identification of which this order is related
    //     salesmanUid : String, //this will contain sale man identification who is placing this order
    //     orderTiile :  String, //this will contain title text of order
    //     orderText :   String  //this will contain order detail in string
    // }
    
    
    //first getting salesman data for confirming that from which company this salesman belong
    //this method is imported from salesmanModel.ts
    getSalesmanProfile( salesmanUid ).then(

        (success) => {
            console.log("ending res with company profile data");
            //res.json(success);
        },
        (err) => {
            //res.json(err);
            return;
        });

    let newOrder = new orderModel({


    });



}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////











// this is a list of exported functions/methods
// which are exported from this .ts file 
// and free to import in any other .ts file
export {  }