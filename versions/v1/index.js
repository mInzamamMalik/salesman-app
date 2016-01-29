var express = require("express");
var firebase = require("firebase");
var bodyParser = require("body-parser");
//schemas and data models
var userModel = require("../../DBrepo/userModel");
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
            if (userData.uid) {
                var newUser = new userModel({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    companyName: req.body.companyName,
                    email: req.body.email,
                    firebaseToken: userData.uid
                });
                newUser.save(function (err, saved) {
                    if (err) {
                        console.log("erorr is: ", err);
                        return;
                    }
                    if (saved) {
                        console.log("saved: ", saved);
                    }
                });
            }
        }
    });
    console.log(email, password);
    res.send("ok");
});
module.exports = v1;
