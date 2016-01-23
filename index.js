var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();
app.set('port', (process.env.PORT || 3000));
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use("/", function (req, res, next) {
    res.sendFile("index.html");
});
app.listen(app.get("port"), function () {
    console.log('app is running on port', app.get('port'));
});
