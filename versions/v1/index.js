var express = require("express");
var firebase = require("firebase");
var bodyParser = require("body-parser");
var v1 = express.Router();
var ref = new firebase("https://sales-man-app.firebaseio.com/");
v1.use(bodyParser.json());
v1.post("/signup", function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    ref.createUser({
        email: email,
        password: password
    }, function (error, userData) {
        if (error) {
            switch (error.code) {
                case "EMAIL_TAKEN":
                    console.log("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    break;
                default:
                    console.log("Error creating user:", error);
            }
        }
        else {
            console.log("Successfully created user account with uid:", userData.uid);
        }
    });
    console.log(email, password);
    res.send("ok");
});
module.exports = v1;
