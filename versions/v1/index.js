var express = require("express");
var bodyParser = require("body-parser");
//schemas methods
var userModel_1 = require("../../DBrepo/userModel");
//salesman routes
var salesmanRoutes = require("./salesmanRoutes");
//admin routes
var adminRoutes = require("./adminRoutes");
var v1 = express.Router();
v1.use(bodyParser.json());
////////////////////////signup request///////////////////////////////////////////////////////////////////
v1.post("/signup", function (req, res, next) {
    var signupObject = req.body;
    console.log("data is : ", signupObject);
    userModel_1.doSignup(signupObject).then(function (success) {
        console.log("signup success: ", success);
        res.json({ signup: true });
    }, function (err) {
        console.log("signup error: ", err);
        res.json({ signup: false, message: err });
    });
});
/////////////////signup request//////////////////////////////////////////////////////////////////////
///////////////login resuest/////////////////////////////////////
v1.post("/login", function (req, res, next) {
    //console.log(req.body , req.body.password );
    userModel_1.doLogin({
        email: req.body.email,
        password: req.body.password
    }).then(function (success) {
        res.json(success);
    }, function (err) {
        res.json(err);
    });
});
///////////////login resuest/////////////////////////////////////
/////////start/////if not authenticated return with 401 not autherised/authenticated///////////////////////////////////////////////////
v1.use(function (req, res, next) {
    console.log("token is: ", req.query.token);
    console.log("uid is: ", req.query.uid);
    if (req.query.token) {
        userModel_1.validateToken(req.query.token).then(function (success) {
            console.log("token valid hai");
            next();
            return;
        }, function (err) {
            console.log("token galat hai");
            res.send(401);
            return;
        });
    }
    else {
        console.log("token hai he nhee");
        res.send(401);
        return;
    }
    ;
});
///////////end///if not authenticated return with 401 not autherised/authenticated///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//this route will only hit if user is authenticated
//and whenever hitted must return with isLoggedIn:true
v1.get("/isLoggedIn", function (req, res, next) {
    console.log("isLoggedIn check hitted");
    res.json({ isLoggedIn: true });
});
/////////////////////////////////////////////////////////////////////////
v1.use("/admin", function (req, res, next) {
    ///////////////////////////checking that loggedin person is admin or not///////////////////
    userModel_1.isAdmin(req.query.uid).then(function (yes) {
        console.log("safgasd");
        //turn app flow to admin routes
        adminRoutes(req, res, next);
    }, function (no) {
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
