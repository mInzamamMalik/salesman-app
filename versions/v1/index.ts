import express = require("express");
import bodyParser = require("body-parser");
import url = require("url");

//schemas methods
import { doSignup, doLogin, validateToken, isAdmin } from "../../DBrepo/userModel";
import { salesmanSignup, getSalesmanList } from "../../DBrepo/salesmanModel";

//salesman routes
var salesmanRoutes = require("./salesmanRoutes");
//admin routes
var adminRoutes = require("./adminRoutes");


let v1 = express.Router()

v1.use(bodyParser.json());


////////////////////////signup request///////////////////////////////////////////////////////////////////
v1.post("/signup", (req: express.Request, res: express.Response, next: Function) => {

    interface patternOfUserObject {

        email: string,
        password: string,
        firstName: string,      //this is a interface which is must required from front end
        lastName: string,
        companyName: string

    }

    let signupObject = req.body;

    console.log("data is : ", signupObject);

    doSignup(signupObject).then((success) => {

        console.log("signup success: ", success);

        res.json({ signup: true });

    },
        (err) => {
            console.log("signup error: ", err);
            res.json({ signup: false, message: err });
        });


});
/////////////////signup request//////////////////////////////////////////////////////////////////////






///////////////login resuest/////////////////////////////////////
v1.post("/login", (req: express.Request, res: express.Response, next: Function) => {
    
    //console.log(req.body , req.body.password );
    
    doLogin({

        email: req.body.email,
        password: req.body.password

    }).then(

        (success) => {
            res.json(success);
        },

        (err) => {
            res.json(err);
        });
});
///////////////login resuest/////////////////////////////////////



/////////start/////if not authenticated return with 401 not autherised/authenticated///////////////////////////////////////////////////
v1.use((req: express.Request, res: express.Response, next: Function) => {

    console.log("token is: ", req.query.token);
    console.log("uid is: ", req.query.uid);


    if (req.query.token) {

        validateToken(req.query.token).then(
            (success) => {
                console.log("token valid hai");
                next();
                return;
            },
            (err) => {
                console.log("token galat hai");
                res.send(401);
                return;
            }
        );
    } else {

        console.log("token hai he nhee");
        res.send(401);
        return;
    };
});
///////////end///if not authenticated return with 401 not autherised/authenticated///////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////
//this route will only hit if user is authenticated
//and whenever hitted must return with isLoggedIn:true
v1.get("/isLoggedIn", (req, res, next) => {

    console.log("isLoggedIn check hitted");
    res.json({ isLoggedIn: true });
});
/////////////////////////////////////////////////////////////////////////


 
v1.use("/admin", (req: express.Request, res: express.Response, next: Function) => {
    
    ///////////////////////////checking that loggedin person is admin or not///////////////////
    isAdmin(req.query.uid).then(
        (yes) => {
            console.log("safgasd");
            
            //turn app flow to admin routes
            adminRoutes(req,res,next);

        }, (no) => {
            
            console.log("ye banda admin nhe hai");
            //return with 401 Unautherise
            res.send(401);
            return;
        });                 
    ////////////////////////////////////////////////////////////   /    
});

//turn app flow to salesman routes
v1.use(salesmanRoutes);








module.exports = v1;