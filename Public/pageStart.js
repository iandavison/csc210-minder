/**
 * Created by joshstern on 11/8/15.
 * Getting git to work
 */





function initPage() {
    if (apiKey == undefined) {
        alert("You dont have the API Key, talk to Josh to get it");
    }
    var cookie = document.cookie;
    var user = cookieToUser(cookie);
    var pass = cookieToPassword(cookie);
    if(user != false){
        loginUserCookie(user, pass);
    }
    else {
        buildLogIn();
    }
}


//Function for building user login

function buildLogIn() {
    var banner = $("#topBanner");
    var oldLogIn = $("#logIn");
    var oldCreateAccount = $("#createAccount");
    if(oldLogIn.length > 0) { //We are already on login screen
        return;
    }
    if(oldCreateAccount.length > 0) { //Distroy old create account screen if it exists
        oldCreateAccount.remove();
    }

    // Build user login
    banner.after(
        "<div id=\"logIn\" class=\"userEntry\">" +
        "<h3>User Name</h3>" +
        "<input id=\"userName\" class=\"logInText\" type=\"text\" name=\"userName\" placeholder=\"User Name\">" +
        "<h3>Password</h3>" +
        "<input id=\"password\" class=\"logInText\" type=\"text\" name=\"password\" placeholder=\"Password\">" +
        "<div class='loginButton' id=\"liButton\" onclick=\"loginUser()\">Login</div>" +
        "<div class='loginButton' id=\"cuButton\" onclick=\"buildCreateUser()\">Create New Account</div>" +
        "</div>");
    hoverColorShift($(".loginButton"));

}
function cookieToUser(cookie) {
    var name = "username" + "=";
    var cookieSplit = cookie.split(';');

    for(var i=0; i<cookieSplit.length; i++) {
        var c = cookieSplit[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function cookieToPassword(cookie) {
    var name = "password" + "=";
    var cookieSplit = cookie.split(';');

    for(var i=0; i<cookieSplit.length; i++) {
        var c = cookieSplit[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}


function hoverColorShift(el) {
    el.hover(
        function(e) { //MouseIn
            //$("#" + e.target.id).css("background", "#44ee44");
            $("#" + e.target.id).animate({backgroundColor: '#44ee44', left: '100px'}, 200);
        },
        function (e) { //MouseOut
            //$("#" + e.target.id).css("background", "#00CC00");
            $("#" + e.target.id).animate({backgroundColor: '#00CC00'}, 200);
        });
}
function buildCreateUser() {
    var banner = $("#topBanner");
    var oldLogIn = $("#logIn");
    var oldCreateAccount = $("#createAccount");
    if(oldCreateAccount.length > 0) { //Distroy old create account screen if it exists
        return;
    }
    if(oldLogIn.length > 0) { //We are already on login screen
        oldLogIn.remove();
    }
    // Build
    banner.after(
        "<div id=\"createUser\" class='userEntry'>" +
        "<h3>User Name</h3>" +
        "<input id=\"userName\" class=\"logInText\" type=\"text\" name=\"userName\" placeholder=\"User Name\">" +
        "<h3>Name</h3>" +
        "<input id=\"name\" class=\"logInText\" type=\"text\" name=\"name\" placeholder=\"Real Name\">" +
        "<h3>Password</h3>" +
        "<input id=\"password\" class=\"logInText\" type=\"text\" name=\"password\" placeholder=\"Password\">" +
        "<div class='loginButton' id=\"cuButton\" onclick=\"createUser()\">Create</div>" +
        "<div class='loginButton' id=\"liButton\" onclick=\"buildLogIn()\">Log in with existing account</div>" +
        "</div>");
    hoverColorShift($(".loginButton"));
}

//function for collecting
function getConcerts(ip) {
    $.getJSON("http://api.songkick.com/api/3.0/events.json?apikey=" + apiKey + "&location=ip:" + ip,
        function(data){
            console.log(data);
            populateShows(data);
        });
}

function populateShows(data) {
    var events = data.resultsPage.results.event;
    //Collect container
    var list = $("#showList");
    //Loop through events and display them
    for(var i = 0; i < events.length; i++) {
        list.append("<h3>");
        list.append(events[i].displayName);
        list.append("</h3>");

    }
}
function getDatabase() {
    $.ajax({
        method: "GET",
        url: "users/",
        success: function(data) {
            $("#topBanner").after(
                "<div id=\"db\">" +
                data +
                "</div id=\"db\">");
            $("body").on("click", function(event) {
                if(event.target.id != "db") {
                    $("#db").remove();
                    $("body").off("click");
                }
            });
        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}

function loginUserCookie(user, pass) {
    //Submit finished product
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {username: user, password: pass},
        url: "users/login",
        success: function(data) {
            console.log("User Created");
            if(data == "OK") {
                $("#showFeed").css("visibility", "visible");
                $.getJSON("http://jsonip.com?callback=?", function (data) {
                    userHomePage(data.ip, user, pass);
                    getConcerts(data.ip);
                });
                //Remove login block
                $("#logIn").remove();
            }

        },
        error: function(data) {
            buildLogIn();
        }
    });
}

function createCookie(user, pass) {
    var d = new Date();
    var exdays = 2;
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "username=" + user + ";" + expires;
    document.cookie = "password=" + pass + ";" + expires;
}


function loginUser() {
    //Ensure all fields are filled
    var fail = false;
    var un = $("#userName");
    var pw = $("#password");

    //Make sure all fields are filled out
    if(un.val().length == 0) {un.css("background", "#FF7777"); fail = true;}
    else {un.css("background", "#FFFFFF");}
    if(pw.val().length == 0) {pw.css("background", "#FF7777"); fail = true;}
    else {pw.css("background", "#FFFFFF");}
    if(fail) {
        console.log("Fields not filled out.");
        return;
    }
    //Submit finished product
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {username: un.val(), password: pw.val()},
        url: "users/login",
        success: function(data) {
            console.log("User Created");
            if(data == "OK") {
                $("#showFeed").css("visibility", "visible");
                createCookie(un.val(), pw.val());
                //Collect client info to be displayed
                $.getJSON("http://jsonip.com?callback=?", function (data) {
                    userHomePage(data.ip, un.val(), pw.val());
                    getConcerts(data.ip);
                });
                //Remove login block
                $("#logIn").remove();
            }

        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}

/*
 * This function should have expose the functinoality
 * to:
 *  logout
 *  update the profile connected to it
 *  delete the profile connected to it
 *
 *  And all other main user functionality we want
 *  i.e. the matching possible chating
 *
 *
 *
 */
function userHomePage(ip, user, pass) {
    $("#topBanner").append(
        " <button id='updateUser' onclick='buildUpdateUser()'>Update User</button>"
    );
    $("#topBanner").append(
        " <button id='deleteUser' onclick='buildDeleteUser()'>Delete User</button>"
    );
    $("#topBanner").append(
        " <button id='logoutUser' onclick='logoutUser()'>Logout</button>"
    );

}

function logoutUser() {
    document.cookie = "username=";
    document.cookie = "password=";
    $("#showFeed").remove();
    location.reload();

}

function buildUpdateUser() {
    var banner = $("#topBanner");
    var oldUpdate = $("#userUpdate");
    if(oldUpdate.length > 0) { //We are already on login screen
        return;
    }

    // Build user login
    banner.after(
        "<div id=\"userUpdate\" class=\"userEntry\">" +
        "<h3>User Name</h3>" +
        "<input id=\"newUserName\" class=\"updateText\" type=\"text\" name=\"newUserName\" placeholder=\"User Name\">" +
        "<h3>Password</h3>" +
        "<input id=\"newPassword\" class=\"updateText\" type=\"text\" name=\"newPassword\" placeholder=\"Password\">" +
        "<div class='updateButton' id=\"upButton\" onclick=\"updateUser()\">Update</div>" +
        "</div>");
    hoverColorShift($(".updateButton"));
}

function buildDeleteUser() {
    var banner = $("#topBanner");
    var oldUpdate = $("#userDelete");
    if(oldUpdate.length > 0) { //We are already on login screen
        return;
    }

    // Build user login
    banner.after(
        "<div id=\"userDelete\" class=\"userEntry\">" +
        "<button id=\"deleteButton\" onclick=\"deleteUser()\">Delete</>" +
        "</div>");
    hoverColorShift($(".deleteButton"));
}

//ajax call with the new info
function updateUser() {

}

//ajax call with username to delete
function deleteUser() {
    var userPass = cookieToPassword(document.cookie);
    var userName = cookieToUser(document.cookie);

    $.ajax({
        type: "DELETE",
        dataType: "text",
        data: {password: userPass},
        url: "users/" + userName,
        success: function(data) {
            console.log("User deleted");
            if(data == "OK") {
                logoutUser();
            }
        },
        error: function(data){
            console.log("Error: delete")
        }

    });
}

function buildHomePage(){

}

function createUser() {
    //Ensure all fields are filled
    var fail = false;
    var un = $("#userName");
    var n = $("#name");
    var pw = $("#password");
    //Make sure all fields are filled out
    if(un.val().length == 0) {un.css("background", "#FF7777"); fail = true;}
    else {un.css("background", "#FFFFFF");}
    if(n.val().length == 0) {n.css("background", "#FF7777"); fail = true;}
    else {n.css("background", "#FFFFFF");}
    if(pw.val().length == 0) {pw.css("background", "#FF7777"); fail = true;}
    else {pw.css("background", "#FFFFFF");}
    if(fail) {
        console.log("Fields not filled out.");
        return;
    }
    console.log(un.val() + n.val() + pw.val());

    //Submit finished product
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {password: pw.val(), nm: n.val()},
        url: "users/" + un.val(),
        success: function(data) {
            console.log("User Created");
            if(data == "OK") {
                $("#showFeed").css("visibility", "visible");
                createCookie(un.val(), pw.val());
                //Collect client info to be displayed
                $.getJSON("http://jsonip.com?callback=?", function (data) {
                    userHomePage(data.ip, un.val(), pw.val());
                    getConcerts(data.ip);
                });
                //Remove login block
                $("#createUser").remove();
            }

        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}
