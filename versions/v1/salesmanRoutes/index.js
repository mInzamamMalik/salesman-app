var express = require("express");
//db methods
var salesmanModel_1 = require("../../../DBrepo/salesmanModel");
var salesmanRoutes = express.Router();
//this route return with profile data of salesman
salesmanRoutes.get("/getSalesmanProfile", function (req, res, next) {
    salesmanModel_1.getSalesmanProfile(req.query.uid).then(function (success) {
        console.log("ending res with company profile data");
        res.json(success);
    }, function (err) {
        res.json(err);
        return;
    });
});
module.exports = salesmanRoutes;
