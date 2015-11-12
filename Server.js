/**
 * Created by joshstern on 10/29/15.
 */





var sqlite = require('sqlite3').verbose();
var express = require('express');
var app = express();

// required to support parsing of POST request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// Serving static files in Public folder
app.use(express.static("Public"));


var counter = 0;
app.post('/users', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    //Check for
    db.serialize(function() {
        db.run("INSERT INTO Users VALUES (\'"+ req.body.username +"\', \'"+ req.body.password +"\', \'"+ req.body.nm +"\')", function(err) {
            console.log("A user with this UserName already exists!");
        });
    });
    db.close();
    res.send("OK");
});

app.get('/users', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    db.serialize(function() {
        //Make sure users table exists
        db.each("SELECT * FROM Users", function(err, row) {
            console.log(row);
        });
    });
    db.close();
    res.send("OK");
});

app.get('/usersValidate/*', function (req, res) {
    var nameToLookup = req.params[0];
    // Get DB file
    var db = new sqlite.Database("users.db");
    console.log("Database----------");
    db.all("SELECT * FROM Users", function(err, rows) {
        res.send(JSON.stringify(rows));
    });
    db.close();
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    var db = new sqlite.Database("users.db");
    db.serialize(function() {
        //Make sure users table exists
        db.run("CREATE TABLE IF NOT EXISTS Users (UserName varchar(128) UNIQUE, Password varchar(128), RealName varchar(128))");
    });
    db.close();

    console.log('Example app listening at http://%s:%s', host, port);
});


