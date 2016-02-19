var express = require("express");
var bodyParser = require("body-parser");
//db methods
var salesmanModel_1 = require("../../../DBrepo/salesmanModel");
var orderModel_1 = require("../../../DBrepo/orderModel");
var salesmanRoutes = express.Router();
//this route return with profile data of salesman
salesmanRoutes.get("/getSalesmanProfile", function (req, res, next) {
    salesmanModel_1.getSalesmanProfile(req.query.uid).then(function (success) {
        //console.log("ending res with company profile data");
        res.json(success);
    }, function (err) {
        res.json(err);
        return;
    });
});
salesmanRoutes.use(bodyParser.json()); //this will parse body of request
salesmanRoutes.post("/placeOrderAsSalesman", function (req, res, next) {
    console.log("place order is hitted");
    orderModel_1.placeOrderAsSalesMan(req.query.uid, req.body.clientName, req.body.orderSubject, req.body.orderDetail).then(function (success) {
        //console.log("order is placed successfully");
        res.json(success);
    }, function (err) {
        res.json(err);
        return;
    });
});
module.exports = salesmanRoutes;
