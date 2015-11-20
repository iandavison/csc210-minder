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


app.post('/users/*', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var userCreate = req.params[0];
    //Check for
    db.run("INSERT INTO Users VALUES (\'"+ userCreate +"\', \'"+ req.body.password +"\', \'"+ req.body.nm +"\')", function(err) {
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


app.put('/users/*', function (req, res) {
    console.log("HERE");
    var db = new sqlite.Database("users.db");
    var user = req.params[0];
    //Check for
    db.run("UPDATE Users SET UserName=\'"+ req.body.newusername +"\', Password=\'"+ req.body.newpassword +"\' WHERE UserName =\'" + user + "\' AND Password =\'" + req.body.oldpassword + "\'", function(err) {
        console.log(err);
        if(err == null) {
            res.send("OK");
        }
        else {
            res.send("FAIL");
        }
    });
    db.close();
});

app.delete('/users/*', function (req,res) {
    //get DB file
    var db = new sqlite.Database("users.db");
    var user = req.params[0];
    db.run("DELETE FROM Users WHERE UserName =\'" + user + "\' AND Password =\'" + req.body.password + "\'", function (err) {
       if(err == null) {
           res.send("OK");
       }
       else {
           res.send("FAIL");
       }
    });
    db.close();
});
// TODO: this will eventually be our get to view other peoples acounts
//app.get('/users/*', function(req, res) {
//    // Get DB file
//    var db = new sqlite.Database("users.db");
//    var data = (req.params[0]).split("&");
//    console.log(user + ":" + req.body.password);
//    //Check for
//    db.all("SELECT * FROM Users WHERE UserName=\'"+ user +"\' AND Password=\'"+ req.body.password +"\'", function(err, rows) {
//        if(rows.length > 0) {
//            res.send("OK");
//        }
//        else {
//            res.send("FAIL");
//        }
//    });
//    db.close();
//});

app.get('/userLogIn/*', function(req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var data = (req.params[0]).split("&");
    var user = data[0];
    var password = data[1];
    console.log(user + ":" + password);
    //Check for
    db.all("SELECT * FROM Users WHERE UserName=\'"+ user +"\' AND Password=\'"+ password +"\'", function(err, rows) {
        if(rows.length > 0) {
            res.send("OK");
        }
        else {
            res.send("FAIL");
        }
    });
    db.close();
});



app.get('/userDatabase', function (req, res) {
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
    //Make sure users table exists
    db.run("CREATE TABLE IF NOT EXISTS Users (UserName TEXT UNIQUE, Password TEXT, RealName TEXT)");
    db.close();

    console.log('Example app listening at http://%s:%s', host, port);
});