var express = require("express");
var bodyParser = require("body-parser");
//schemas methods
var userModel_1 = require("../../DBrepo/userModel");
var v1 = express.Router();
v1.use(bodyParser.json());
v1.post("/signup", function (req, res, next) {
    var signupObject = req.body.signupObject;
    userModel_1.doSignup(signupObject);
});
module.exports = v1;
