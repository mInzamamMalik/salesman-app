var express = require("express");
var bodyParser = require("body-parser");
//schemas methods
var userModel_1 = require("../../DBrepo/userModel");
var v1 = express.Router();
v1.use(bodyParser.json());
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
///////////////////////////////////////////////////////////////////////////////////////
v1.post("/login", function (req, res, next) {
    //console.log(req.body , req.body.password );
    userModel_1.doLogin({
        email: req.body.email,
        password: req.body.password
    }).then(function (success) {
        res.json(success);
    }, function (err) {
        res.json({ err: err });
    });
});
module.exports = v1;
