var express = require("express");
var path = require("path");
//app versioning
var v1 = require("./versions/v1");
var app = express();
app.set('port', (process.env.PORT || 3000));
app.use("/v1", v1);
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
var indexPath = path.resolve(__dirname, "frontendFiles");
app.use(express.static(indexPath));
app.listen(app.get("port"), function () {
    console.log('app is running on port', app.get('port'));
});
