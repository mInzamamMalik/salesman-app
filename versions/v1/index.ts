import express = require("express");
import firebase = require("firebase");
import bodyParser = require("body-parser");
//schemas and data models
import userModel = require("../../DBrepo/userModel");


let v1 = express.Router()

let ref = new firebase("https://sales-man-app.firebaseio.com/");

v1.use(bodyParser.json());






v1.post("/signup", (req: express.Request, res: express.Response, next: Function) => {

    let email = req.body.email;
    let password = req.body.password;

    ref.createUser({
        email: email,
        password: password
    }, (error, userData) => {
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
        } else {
            console.log("Successfully created user account with uid:", userData.uid);


            if (userData.uid) {

                let newUser =new userModel({
                    
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    companyName: req.body.companyName,
                    email: req.body.email,
                                        
                    firebaseToken: userData.uid
                });
                
                newUser.save((err,saved)=>{
                    if(err){
                        console.log("erorr is: ",err);
                        return;
                    }
                    if(saved){
                        console.log("saved: " , saved);
                    }
                });
                
                

            }

        }
    });

    console.log(email, password);

    res.send("ok");

});








module.exports = v1;