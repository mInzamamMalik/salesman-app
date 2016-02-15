import express = require("express");
import bodyParser = require("body-parser");
import url = require("url");
//db methods
import { salesmanSignup, getSalesmanProfile } from "../../../DBrepo/salesmanModel";


let salesmanRoutes = express.Router()


//this route return with profile data of salesman

salesmanRoutes.get("/getSalesmanProfile", (req: express.Request, res: express.Response, next: Function) => {

    getSalesmanProfile(req.query.uid).then(

        (success) => {
            console.log("ending res with company profile data");
            res.json(success);
        },
        (err) => {

            res.json(err);
            return;
        });

});











module.exports = salesmanRoutes;