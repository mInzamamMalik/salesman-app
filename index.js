var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use("/v1", function (req, res, next) {
});
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
var indexPath = path.resolve(__dirname, "frontendFiles");
app.use(express.static(indexPath));
app.listen(app.get("port"), function () {
    console.log('app is running on port', app.get('port'));
});
