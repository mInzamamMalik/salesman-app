var express = require("express");
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(function (req, res, next) {
    res.send("hello world");
});
app.listen(app.get("port"), function () {
    console.log('app is running on port', app.get('port'));
});
