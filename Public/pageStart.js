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
        submitUserCookie(user, pass);
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
        "<input id=\"userName\" class=\"editText\" type=\"text\" name=\"userName\" placeholder=\"User Name\">" +
        "<h3>Password</h3>" +
        "<input id=\"password\" class=\"editText\" type=\"text\" name=\"password\" placeholder=\"Password\">" +
        "<div class='button' id=\"liButton\" onclick=\"submitUserLogin()\">Login</div>" +
        "<div class='button' id=\"cuButton\" onclick=\"buildCreateUser()\">Create New Account</div>" +
        "</div>");
    hoverColorShift($(".button"));

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
        "<input id=\"userName\" class=\"editText\" type=\"text\" name=\"userName\" placeholder=\"User Name\">" +
        "<h3>Name</h3>" +
        "<input id=\"name\" class=\"editText\" type=\"text\" name=\"name\" placeholder=\"Real Name\">" +
        "<h3>Password</h3>" +
        "<input id=\"password\" class=\"editText\" type=\"text\" name=\"password\" placeholder=\"Password\">" +
        "<div class='button' id=\"cuButton\" onclick=\"submitUserCreate()\">Create</div>" +
        "<div class='button' id=\"liButton\" onclick=\"buildLogIn()\">Log in with existing account</div>" +
        "</div>");
    hoverColorShift($(".button"));
}

//function for collecting
function getConcerts(ip) {
    $.getJSON("http://api.songkick.com/api/3.0/events.json?apikey=" + apiKey + "&location=clientip",
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

function submitUserCookie(user, pass) {
    //Submit finished product
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {username: user, password: pass},
        url: "users/login",
        success: function(data) {
            if(data == "OK") {
                console.log("LoginSuccess")
                $("#showFeed").css("visibility", "visible");
                userHomePage(data.ip, user, pass);
                getConcerts(data.ip);
                //Remove login block
                $("#logIn").remove();
            }
            else {
                buildLogIn();
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


function submitUserLogin() {
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
    }
    else {
        login(un.val(), pw.val());
    }

}
function login(un, pw) {
    //Submit finished product
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {username: un, password: pw},
        url: "users/login",
        success: function(data) {
            if(data == "OK") {
                console.log("Login Success");
                $("#showFeed").css("visibility", "visible");
                createCookie(un, pw);
                //Collect client info to be displayed
                userHomePage(data.ip, un, pw);
                getConcerts(data.ip);
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
    location.reload();

}

function buildUpdateUser() {
    var banner = $("#topBanner");
    var oldUpdate = $("#userUpdate");
    if(oldUpdate.length > 0) {
        return;
    }
    banner.after(
        "<div id=\"userUpdate\" class=\"userEntry\">" +
        "<h3>User Name</h3>" +
        "<input id=\"newUserName\" class=\"editText\" type=\"text\" name=\"newUserName\" placeholder=\"User Name\">" +
        "<h3>Password</h3>" +
        "<input id=\"newPassword\" class=\"editText\" type=\"text\" name=\"newPassword\" placeholder=\"Password\">" +
        "<div class='button' id=\"upButton\" onclick=\"updateUser()\">Update</div>" +
        "</div>");
    hoverColorShift($(".button"));
}

function buildDeleteUser() {
    var banner = $("#topBanner");
    var oldUpdate = $("#userDelete");
    if(oldUpdate.length > 0) { //We are already on login screen
        return;
    }
    banner.after(
        "<div id=\"userDelete\" class=\"userEntry\">" +
        "<button id=\"button\" onclick=\"deleteUser()\">Delete</>" +
        "</div>");
    hoverColorShift($(".button"));
}

//ajax call with the new info
function updateUser() {
    var userPass = cookieToPassword(document.cookie);
    var userName = cookieToUser(document.cookie);
    var newUsername = $("#newUserName");
    var newPassword = $("#newPassword");
    var fail = false;
    //Make sure all fields are filled out
    if(newUsername.val().length == 0) {newUsername.css("background", "#FF7777"); fail = true;}
    else {newUsername.css("background", "#FFFFFF");}
    if(newPassword.val().length == 0) {newPassword.css("background", "#FF7777"); fail = true;}
    else {newPassword.css("background", "#FFFFFF");}
    if(fail) {
        console.log("HERE");
        return;
    }
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {oldusername: userName, oldpassword: userPass, newusername: newUsername.val(), newpassword:newPassword.val()},
        url: "users/edit",
        success: function(data) {
            if(data == "OK") {
                console.log("User edited")
            }
            $("#userUpdate").remove();
        },
        error: function(data){
            console.log("Error: edit")
        }
    });
}

//ajax call with username to delete
function deleteUser() {
    var userPass = cookieToPassword(document.cookie);
    var userName = cookieToUser(document.cookie);

    $.ajax({
        type: "DELETE",
        dataType: "text",
        data: {username: userName, password: userPass},
        url: "users/",
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

function submitUserCreate() {
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
    createUser(un.val(), pw.val(), n.val());
    console.log(un.val() + n.val() + pw.val());
}
function createUser(un, pw, n) {
    //Submit finished product
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {password: pw, username: un, nm: n},
        url: "users/create",
        success: function(data) {
            if(data == "OK") {
                console.log("User Created");
                $("#showFeed").css("visibility", "visible");
                createCookie(un, pw);
                //Collect client info to be displayed
                userHomePage(data.ip, un, pw);
                getConcerts();
                //Remove login block
                $("#createUser").remove();
            }

        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}
