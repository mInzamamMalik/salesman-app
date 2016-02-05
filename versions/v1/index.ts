import express = require("express");
import bodyParser = require("body-parser");
import url = require("url");

//schemas methods
import { doSignup, doLogin, validateToken, getCompanyProfile } from "../../DBrepo/userModel";


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
    }


    next();

});
///////////end///if not authenticated return with 401 not autherised/authenticated///////////////////////////////////////////////////


v1.get("");








module.exports = v1;