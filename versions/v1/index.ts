import express = require("express");
import bodyParser = require("body-parser");

//schemas methods
 import {doSignup} from "../../DBrepo/userModel";


let v1 = express.Router()
v1.use(bodyParser.json());



v1.post("/signup", (req: express.Request, res: express.Response, next: Function) => {
    
    interface patternOfUserObject {
        
        email:      string,
        password :  string,
        firstName : string,      //this is a interface which is must required from front end
        lastName :  string,
        companyName : string

    }    
    
    let signupObject : patternOfUserObject  =  req.body;
    
    console.log("data is : ",signupObject);
    
     doSignup(  signupObject  );
    
    
});




module.exports = v1;