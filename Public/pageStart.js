/**
 * Created by joshstern on 11/8/15.
 */





function initPage() {
    if (apiKey == undefined) {
        alert("You dont have the API Key, talk to Josh to get it");
    }
    buildLogIn();
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
                //Collect client info to be displayed
                $.getJSON("http://jsonip.com?callback=?", function (data) {
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
        data: {username: un.val(), password: pw.val(), nm: n.val()},
        url: "users/create",
        success: function(data) {
            console.log("User Created");
            if(data == "OK") {
                $("#showFeed").css("visibility", "visible");
                //Collect client info to be displayed
                $.getJSON("http://jsonip.com?callback=?", function (data) {
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