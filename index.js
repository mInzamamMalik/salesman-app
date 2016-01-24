var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();
mongoose.connect("mongodb://malikasinger:sales@ds049935.mongolab.com:49935/salesman-app");
app.set('port', (process.env.PORT || 3000));
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use("/", function (req, res, next) {
    var indexPath = path.resolve(__dirname, "frontendFiles/index.html");
    res.sendFile(indexPath);
});
app.listen(app.get("port"), function () {
    console.log('app is running on port', app.get('port'));
});
