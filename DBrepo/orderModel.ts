import mongoose = require("mongoose"); //mongodb driver
import Firebase = require("firebase");
import q = require("q"); //to return deferred.promise from function

let ref = new Firebase("https://sales-man-app.firebaseio.com/");


//db methods
import { getSalesmanProfile } from "./../DBrepo/salesmanModel";
import { notification , hiddenNotification } from "./../DBrepo/notificationMethods";



//////////////order schema and model///////////////////////////////////////////
let orderSchema = new mongoose.Schema({

    companyUid: String, //this will contain company identification of which this order is related
    salesmanUid: String, // this will contain sale man identification who is placing this order
    
    clientName: String, // this will contain client which order is placing for
    
    orderSubject: String, // this will contain subject of order
    
    orderDetail: String, //this will contain order detail in string
    geoCoords: [Number],
    unRead: { type: Boolean, 'default': true },
    suspended: { type: Boolean, 'default': false },
    createdOn: { type: Date, 'default': Date.now } //pack 'default' in single quotes(this is Optional) to avoid compile error
    
});

let orderModel = mongoose.model("orders", orderSchema);
//////////////end order schema and model//////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////
//this function will place order as salesman , take input salesman uid and order detail
//then 
function placeOrderAsSalesMan(salesmanUid, clientName, orderSubject, orderDetail, geoCoords) {

    let deferred = q.defer();
    
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

    getSalesmanProfile(salesmanUid).then(
        (success) => {
            
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
            
            
            let newOrder = new orderModel({
                companyUid: success.companyUid,
                salesmanUid: salesmanUid,
                clientName: clientName,
                orderSubject: orderSubject,
                orderDetail: orderDetail,
                geoCoords: geoCoords
            });

            newOrder.save((err, data) => {

                if (!err) { 
                    //flaging on firebase that notification is placed
                    notification.incrementOne(success.companyUid);
                                                      
                    //console.log("this order is placed",data);
                    deferred.resolve(data);
                } else {
                    console.log(err);
                    deferred.reject(err);
                }
            });
        },
        (err) => {
            deferred.reject(err);
            return;
        });

    return deferred.promise;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////get order methods///////////////////////////////////////////////////////////////////
let getOrderList = {

    asSalesman: function(salesmanUid) {
        let deferred = q.defer();

        orderModel.find({ 'salesmanUid': salesmanUid }, // all orders placed by this salesman    
            (err, orderList) => {
                if (!err) {
                    console.log(orderList);
                    deferred.resolve(orderList);
                } else {
                    deferred.reject(err);
                }
            });
        return deferred.promise;
    },



    asCompany: function(companyUid) {
        let deferred = q.defer();

        orderModel.find({ 'companyUid': companyUid }, // all orders placed by this salesman    
            (err, orderList) => {
                if (!err) {
                    console.log(orderList);
                    deferred.resolve(orderList);

                } else {
                    deferred.reject(err);
                }
            });
        return deferred.promise;
    }
}
/////////////get order methods///////////////////////////////////////////////////////////////////










/////////////delete order methods////////////////////////////////////////////////////////

//only for admin
function deleteOrders(companyUid: string, orderId: string[]) {

    let deferred = q.defer();
   
        ///$in takes an array, so orderId must be an array   
        orderModel.remove({ companyUid: companyUid, _id: { $in: orderId } }, function(err) {
            if (!err) {
                console.log("this is not error");
                
                hiddenNotification.incrementOne();
                
                deferred.resolve();
            } else {
                console.log("this is  error", err);
                deferred.reject(err);
            }
        });
    return deferred.promise;
}
//for checking
//  deleteOrders("477406ff-dc2a-427c-9495-0d3421cc8e76",["56c78a497a1190280a98e0b0","56c78a827a1190280a98e0b1"  ]);

/////////////get order methods///////////////////////////////////////////////////////////////////











// this is a list of exported functions/methods
// which are exported from this .ts file 
// and free to import in any other .ts file
export { placeOrderAsSalesMan, getOrderList, deleteOrders}