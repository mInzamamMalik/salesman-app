var express = require("express");
//schemas methods
var userModel_1 = require("../../../DBrepo/userModel");
var salesmanModel_1 = require("../../../DBrepo/salesmanModel");
var orderModel_1 = require("../../../DBrepo/orderModel");
var adminRoutes = express.Router();
//this route will return with company profile information
adminRoutes.get("/getCompanyProfile", function (req, res, next) {
    userModel_1.getCompanyProfile(req.query.uid).then(function (success) {
        console.log("ending res with company profile data");
        res.json(success);
    }, function (err) {
        res.json(err);
        return;
    });
});
//return with list of salesman related to this company
adminRoutes.get("/getSalesmanList", function (req, res, next) {
    salesmanModel_1.getSalesmanList.byCompanyId(req.query.uid).then(function (salesmanList) {
        console.log("ending res with salesman list");
        res.json(salesmanList);
    }, function (err) {
        res.json(err);
        return;
    });
});
//this route will regester a salesman in company
adminRoutes.post("/salesmanSignup", function (req, res, next) {
    //  db method "salesmanSignup"" will take an object in input like this object
    // {
    //     firstName: String,
    //     lastName: String,
    //     companyUid: String,
    //     email: { type: String, unique: true, require: true },  
    //     password : String,  
    //     createdOn: { type: Date, 'default': Date.now }, 
    //     firebaseUid: String
    // }
    salesmanModel_1.salesmanSignup({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        companyUid: req.query.uid,
        firebaseUid: "" //this field will fill by the method
    }).then(function (success) {
        console.log("signup success: ", success);
        res.json({ signup: true });
    }, function (err) {
        console.log("signup error: ", err);
        res.json({ signup: false, message: err });
    });
});
adminRoutes.get("/getOrderList", function (req, res, next) {
    console.log("get order by salesman is hitted");
    orderModel_1.getOrderList.asCompany(req.query.uid).then(function (success) {
        //console.log("order is placed successfully");
        res.json(success);
    }, function (err) {
        res.json(err);
        return;
    });
});
adminRoutes.post("/deleteOrders", function (req, res, next) {
    console.log("deleteOrders is hitted");
    orderModel_1.deleteOrders(req.query.uid, req.body.arrayOfOrderId).then(function (success) {
        //console.log("order is placed successfully");
        res.json({ deleted: true });
    }, function (err) {
        res.json({
            deleted: false,
            error: err
        });
        return;
    });
});
module.exports = adminRoutes;
