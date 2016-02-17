import express = require("express");
import bodyParser = require("body-parser");
import url = require("url");
//db methods
import { salesmanSignup, getSalesmanProfile } from "../../../DBrepo/salesmanModel";
import { placeOrderAsSalesMan } from "../../../DBrepo/orderModel";


let salesmanRoutes = express.Router()


//this route return with profile data of salesman

salesmanRoutes.get("/getSalesmanProfile", (req: express.Request, res: express.Response, next: Function) => {

    getSalesmanProfile(req.query.uid).then(

        (success) => {
            //console.log("ending res with company profile data");
            res.json(success);
        },
        (err) => {

            res.json(err);
            return;
        });

});

salesmanRoutes.use(bodyParser.json());//this will parse body of request

salesmanRoutes.post("/placeOrderAsSalesman", (req: express.Request, res: express.Response, next: Function) => {

    console.log("place order is hitted");

    placeOrderAsSalesMan(req.query.uid , "order title" , "order text").then(

        (success) => {
            //console.log("order is placed successfully");
            res.json(success);
        },
        (err) => {

            res.json(err);
            return;
        });

})








module.exports = salesmanRoutes;