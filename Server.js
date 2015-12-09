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
    db.run("INSERT INTO Users VALUES (\""+ userCreate +"\", \""+ req.body.password +"\", \""+ req.body.nm +"\")", function(err) {
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
    db.run("UPDATE Users SET UserName=\""+ req.body.newusername +"\", Password=\""+ req.body.newpassword +"\" WHERE UserName =\"" + user + "\" AND Password =\"" + req.body.oldpassword + "\"", function(err) {
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
    db.run("DELETE FROM Users WHERE UserName =\"" + user + "\" AND Password =\"" + req.body.password + "\"", function (err) {
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
//    db.all("SELECT * FROM Users WHERE UserName=\""+ user +"\" AND Password=\""+ req.body.password +"\"", function(err, rows) {
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
    db.all("SELECT * FROM Users WHERE UserName=\""+ user +"\" AND Password=\""+ password +"\"", function(err, rows) {
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
    var out = "";
    console.log("Database----------");
    db.all("SELECT * FROM Users", function(err, rows) {
        out += "Users:<br>";
        out += JSON.stringify(rows) + "<br>";
        db.all("SELECT * FROM Requests", function(err, rows){
            out += "Requests:<br>";
            out += JSON.stringify(rows) + "<br>";
            db.all("SELECT * FROM Attendees", function(err, rows) {
                out += "Attendees:<br>";
                out += JSON.stringify(rows) + "<br>";
                res.send(out);
            });
        });
    });
    db.close();
});

/*
* Here is where all the matching database calls will happen
*
*
*/

/*
G*  given a requestID return back all the attendees
 */
app.get('/attendees/*', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var requestID = req.params[0];

    db.all("SELECT * FROM Attendees WHERE requestID = \"" + requestID +"\"" , function(err, rows) {
        console.log(err);
        res.send(JSON.stringify(rows));
    });
    db.close();
});

app.post('/attendance/*', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var user = req.params[0];

    //Check for
    db.run("INSERT INTO Attendees VALUES (\"" + req.body.requestID + "\", \"" + user + "\")" , function(err) {
        console.log(err);
        if(err == null) {
            res.send("OK");
        }
        else {
            console.log("Error creating request");
            res.send("FAIL");
        }
    });
    db.close();
});

app.delete('/attendance/*', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var user = req.params[0];

    //Check for
    db.run("DELETE FROM Attendees WHERE requestID = \"" + req.body.requestID + "\" AND user = \"" + user + "\"" , function(err) {
        console.log(err);
        if(err == null) {
            res.send("OK");
        }
        else {
            console.log("Error creating request");
            res.send("FAIL");
        }
    });
    db.close();
});

/*
 Given a user get all the requests they are attending
 This SQL query needs to be written
 */
app.get('/attendance/*', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var user = req.params[0];

    console.log("Looking for attendance for user:" + user);
    db.all("SELECT Requests.requestID, " +
        "Requests.concert, " +
        "Requests.createUser, " +
        "Requests.numCanAttend, " +
        "Requests.numCurAttend, " +
        "Requests.concertDate, " +
        "Requests.location " +
        "FROM Requests, Attendees " +
        "WHERE Requests.requestID = Attendees.requestID AND Attendees.user = \"" + user +" \"" , function(err, rows) {
        console.log(err);
        res.send(JSON.stringify(rows));
    });
    db.close();
});

/*
 Given a user get all the requests that they made
 */
app.get('/requests/*', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var user = req.params[0];
    console.log("Request made for users: " + user);
    db.all("SELECT * FROM Requests WHERE createUser = \"" + user +"\"" , function(err, rows) {
        console.log(err);
        res.send(JSON.stringify(rows));
    });
    db.close();
});

app.get('/requestsForConcert/*', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var concert = req.params[0];

    db.all("SELECT * FROM Requests WHERE concert = \"" + concert +"\"" , function(err, rows) {
        res.send(JSON.stringify(rows));
    });
    db.close();
});

app.post('/requests/*', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var user = req.params[0];

    //Check for
    db.run("INSERT INTO Requests (concert, createUser, numCanAttend, numCurAttend, concertDate, location)" +
        " VALUES (\""+ req.body.concert +"\", \""+ user +"\", \""+ req.body.numCanAttend +
        "\", \"" + req.body.numCurAttend  + "\" , \"" + req.body.concertDate + "\" , \"" + req.body.concertLocation +"\")" , function(err) {
        console.log(err);
        if(err == null) {
            res.send("OK");
        }
        else {
            console.log("Error creating request");
            res.send("FAIL");
        }
    });
    db.close();
});

app.put('/requests/*', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var requestID = req.params[0];

    //Check for
    db.run("UPDATE Requests SET numCanAttend  = \"" + req.body.numCanAttend + "\" , numCurAttend = \"" +
        req.body.numCurAttend + "\" , concertDate = \"" + req.body.concertDate + "\" , location  = \"" +
        req.body.location + "\" WHERE requestID = \"" + requestID + "\"", function(err) {
        console.log(err);
        if(err == null) {
            res.send("OK");
        }
        else {
            console.log("Error creating request");
            res.send("FAIL");
        }
    });
    db.close();
});

app.delete('/requests/*', function (req, res) {
    // Get DB file
    var db = new sqlite.Database("users.db");
    var requestID = req.params[0];
    var runFailed = true;
    //Check for
    db.run("DELETE FROM Requests WHERE requestID = \""+ requestID + "\"", function(err) {
        console.log(err);
        if(err == null) {
            runFailed = false;
        }
        else {
            console.log("Error creating request");
            res.send("FAIL");
        }
    });
    db.run("DELETE FROM Attendees WHERE requestID = \""+ requestID + "\"", function(err) {
        console.log(err);
        if(err == null) {
            res.send("OK");
        }
        else {
            console.log("Error creating request");
            res.send("FAIL");
        }
    });
    db.close();
});


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    var userDB = new sqlite.Database("users.db");
    //Make sure users table exists
    userDB.run("CREATE TABLE IF NOT EXISTS Users (UserName TEXT UNIQUE, Password TEXT, RealName TEXT)");

    //There must be some better way to format this
    userDB.run("CREATE TABLE IF NOT EXISTS Requests" +
        " (requestID INTEGER PRIMARY KEY NOT NULL, " +
        "concert TEXT NOT NULL, " +
        "createUser TEXT NOT NULL, " +
        "numCanAttend INTEGER NOT NULL, " +
        "numCurAttend INTEGER NOT NULL, " +
        "concertDate TEXT NOT NULL, " +
        "location TEXT NOT NULL)");

    userDB.run("CREATE TABLE IF NOT EXISTS Attendees (requestID INTEGER NOT NULL, user TEXT NOT NULL)");
    userDB.close();




    console.log('Example app listening at http://%s:%s', host, port);
});
