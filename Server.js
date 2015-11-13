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
app.use("/Public/libs", express.static(__dirname + "/Public/libs"));


app.post('/users/create', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");

    //Check for
    db.run("INSERT INTO Users VALUES (\'"+ req.body.username +"\', \'"+ req.body.password +"\', \'"+ req.body.nm +"\')", function(err) {
        console.log(err);
        if(err == null) {
            res.send("OK");
        }
        else {
            console.log("A user with this UserName already exists!");
            res.send("FAIL");
        }
    });
    db.close();
});

app.post('/users/login', function(req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");

    //Check for
    db.all("SELECT * FROM Users WHERE UserName=\'"+ req.body.username +"\' AND Password=\'"+ req.body.password +"\'", function(err, rows) {
        if(rows.length > 0) {
            res.send("OK");
        }
        else {
            res.send("FAIL");
        }
    });
    db.close();
});

app.get('/users/', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    console.log("Database----------");
    db.all("SELECT * FROM Users", function(err, rows) {
        res.send(JSON.stringify(rows));
    });
    db.close();
});

app.post('/users/login', function(req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");

    //Check for
    db.all("SELECT * FROM Users WHERE UserName=\'"+ req.body.username +"\' AND Password=\'"+ req.body.password +"\'", function(err, rows) {
        if(rows.length > 0) {
            res.send("OK");
        }
        else {
            res.send("FAIL");
        }
    });
    db.close();
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    var db = new sqlite.Database("users.db");
    //Make sure users table exists
    db.run("CREATE TABLE IF NOT EXISTS Users (UserName varchar(128) UNIQUE, Password varchar(128), RealName varchar(128))");
    db.close();

    console.log('Example app listening at http://%s:%s', host, port);
});


