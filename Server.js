/**
 * Created by joshstern on 10/29/15.
 */


var express = require('express');
var app = express();

var DataBase;


// Serving static files
app.use(express.static(__dirname));

app.post('/users', function (req, res) {

});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});