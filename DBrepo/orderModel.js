var mongoose = require("mongoose"); //mongodb driver
var Firebase = require("firebase");
var q = require("q"); //to return deferred.promise from function
var ref = new Firebase("https://sales-man-app.firebaseio.com/");
//db methods
var salesmanModel_1 = require("./../DBrepo/salesmanModel");
var notificationMethods_1 = require("./../DBrepo/notificationMethods");
//////////////order schema and model///////////////////////////////////////////
var orderSchema = new mongoose.Schema({
    companyUid: String,
    salesmanUid: String,
    orderTiile: String,
    orderText: String,
    unRead: { type: Boolean, 'default': true },
    createdOn: { type: Date, 'default': Date.now } //pack 'default' in single quotes(this is Optional) to avoid compile error
});
var orderModel = mongoose.model("orders", orderSchema);
//////////////end order schema and model//////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//this function will place order as salesman , take input salesman uid and order detail
//then 
function placeOrderAsSalesMan(salesmanUid, orderTitle, orderText) {
    var deferred = q.defer();
    // input pattern of placeOrderAsSalesMan function
    // interface placeOrderAsSalesMan  {
    //     companyUid :  String, //this will contain company identification of which this order is related
    //     salesmanUid : String, //this will contain sale man identification who is placing this order
    //     orderTiile :  String, //this will contain title text of order
    //     orderText :   String  //this will contain order detail in string   
    // }
    //first getting salesman data by geSalesmanProfile() for letting know that from which company this salesman belong
    //this method is imported from salesmanModel.ts
    //---------------------------------------------------------------------------------
    // geSalesmanProfile function kch is trha ka response ly kr ay ga
    // {
    // __v: 0
    // _id: "56c1d06384edb78409d61c45"
    // companyUid: "477406ff-dc2a-427c-9495-0d3421cc8e76"
    // createdOn: "2016-02-15T13:19:31.548Z"
    // email: "salemanbhai@gmail.com"
    // firebaseUid: "d1bb87fc-6ebd-432f-90fc-3cfe6bcd0806"
    // firstName: "saleman"
    // lastName: "bhai:zzz"
    // }
    //we just need his company uid to push in order Object
    salesmanModel_1.getSalesmanProfile(salesmanUid).then(function (success) {
        //console.log("this is success : ", success);
        //let companyUid: string = success.companyUid;
        //if geSalesmanProfile return with success then place a new entry in order collection
        // this is schema of order
        // companyUid: String, //this will contain company identification of which this order is related
        // salesmanUid: String, // this will contain sale man identification who is placing this order
        // orderTiile: String, // this will contain title text of order
        // orderText: String, //this will contain order detail in string
        // unRead: { type: Boolean, 'default': true },
        // createdOn: { type: Date, 'default': Date.now }
        var newOrder = new orderModel({
            companyUid: success.companyUid,
            salesmanUid: salesmanUid,
            orderTiile: orderTitle,
            orderText: orderText
        });
        newOrder.save(function (err, data) {
            if (!err) {
                //flaging on firebase that notification is placed
                notificationMethods_1.notification.incrementOne(success.companyUid);
                //console.log("this order is placed",data);
                deferred.resolve(data);
            }
            else {
                console.log(err);
                deferred.reject(err);
            }
        });
    }, function (err) {
        deferred.reject(err);
        return;
    });
    return deferred.promise;
}
exports.placeOrderAsSalesMan = placeOrderAsSalesMan;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// this is a list of exported functions/methods
// which are exported from this .ts file 
// and free to import in any other .ts file
