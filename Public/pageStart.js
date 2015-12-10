/**
 * Created by joshstern on 11/8/15.
 */



var reqData;
var showData;
var userReqData;
var userAttData;
var selectedShowIndex;
var selectedReqID;


function initPage() {
    if (apiKey == undefined) {
        alert("You dont have the API Key, talk to Josh to get it");
    }
    var cookie = document.cookie;
    var user = cookieToUser(cookie);
    var pass = cookieToPassword(cookie);
    if(user != false){
        login(user, pass);
    }
    else {
        buildLoginWindow();
    }
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
function userHomePage(user, pass) {
    var topBanner = $("#topBanner");
    topBanner.append(
        " <button id='updateUser' onclick='buildUpdateUser()'>Update User</button>"
    );
    topBanner.append(
        " <button id='deleteUser' onclick='buildDeleteUser()'>Delete User</button>"
    );
    topBanner.append(
        " <button id='logoutUser' onclick='logoutUser()'>Logout</button>"
    );
    getUserReq(user);
    getUserAtt(user);
    $("#userPanel").css("visibility", "visible");
    getConcerts();

}

/*
 * Will contain an ajax call to get requests/user
 *
 *
 */
function requestsSideBar(user) {

}

/*
 * Will contain an ajax call to get attendance/user
 *
 *
 */
function attendanceSideBar(user) {

}
//Function for building user login
function buildLoginWindow() {
    var banner = $("#topBanner");
    var oldLogIn = $("#logIn");
    var oldCreateAccount = $("#createUser");
    if(oldLogIn.length > 0) { //We are already on login screen
        return;
    }
    if(oldCreateAccount.length > 0) { //Destroy old create account screen if it exists
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
        "<div class='button' id=\"cuButton\" onclick=\"buildCreateUserWindow()\">Create New Account</div>" +
        "</div>");
    hoverColorShift($(".button"));

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

function buildCreateUserWindow() {
    var banner = $("#topBanner");
    var oldLogIn = $("#logIn");
    var oldCreateAccount = $("#createUser");
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
        "<div class='button' id=\"liButton\" onclick=\"buildLoginWindow ()\">Log in with existing account</div>" +
        "</div>");
    hoverColorShift($(".button"));
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
        "<div class='button' id=\"upButton\" onclick=\"submitUserUpdate()\">Update</div>" +
        "</div>");

    hoverColorShift($(".button"));
}
function submitUserUpdate() {
    var oldPassword = cookieToPassword(document.cookie);
    var oldUsername = cookieToUser(document.cookie);
    var newUsername = $("#newUserName");
    var newPassword = $("#newPassword");
    var fail = false;
    //Make sure all fields are filled out
    if(newUsername.val().length == 0) {newUsername.css("background", "#FF7777"); fail = true;}
    else {newUsername.css("background", "#FFFFFF");}
    if(newPassword.val().length == 0) {newPassword.css("background", "#FF7777"); fail = true;}
    else {newPassword.css("background", "#FFFFFF");}
    if(!fail) {
        updateUser(oldUsername, oldPassword, newUsername.val(), newPassword.val());
    }

}

//function for collecting
function getConcerts() {
    $.getJSON("http://api.songkick.com/api/3.0/events.json?apikey=" + apiKey + "&location=clientip",
        function(data){
            populateShows(data);
        });
}
function populateShows(data) {
    console.log(data);
    //Collect interesting data
    showData = data.resultsPage.results.event;
    //Collect container
    var list = $("#showList");
    //Loop through events and display them
    for(var i = 0; i < showData.length; i++) {
        list.append("<div class='button' id='sh" + i + "'>" + showData[i].displayName + "</div>");
        $("#sh" + i).click(function(ev){
            selectedShowIndex = ev.target.id.substring(2);
            getShowReq();
        });
    }
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

function buildCreateReqWindow() {
    var page = $("body");
    // Build create request box
    page.after(
        "<div id=\"createReq\" class=\"userEntry\">" +
        "<h3>Create a New Show Request for:</h3>" +
        "<div id=\"sh"+ selectedShowIndex +"\" class=\"editText\" type=\"text\" name=\"userName\"> "+ showData[selectedShowIndex].displayName +" </div>" +
        "<h3>Max Attendees</h3>" +
        "<input id=\"maxAttend\" class=\"editText\" type=\"text\" name=\"password\" placeholder=\"Number\">" +
        "<div class='button' id=\"subButton\">Create Request</div>" +
        "<div class='button' id=\"cButton\">Cancel</div>" +
        "</div>");

    $("#subButton").click(function(e) {
        var maxAttend = $("#maxAttend");
        var fail = false;
        if(maxAttend.val().length == 0) {maxAttend.css("background", "#FF7777"); fail = true;}
        else {maxAttend.css("background", "#FFFFFF");}
        if(!fail) {
            createRequest(showData[selectedShowIndex].displayName, cookieToUser(document.cookie), maxAttend.val(), 1, showData[selectedShowIndex].start.datetime, showData[selectedShowIndex].location.city);
        }

    });
    $("#cButton").click(function(){
        $("#createReq").remove();
    });
    hoverColorShift($(".button"));
}
function populateShowReqs(data) {
    //Collect interesting data
    reqData = data;

    //Collect container
    var parentShow = $("#sh" + selectedShowIndex);
    var prevList = $("#reqList"+ selectedShowIndex);
    if(prevList.length > 0){
        prevList.remove();
    }
    //Build list div for
    parentShow.after("<div id='reqList"+ selectedShowIndex +"'></div>");
    var list = $("#reqList"+ selectedShowIndex);
    //Loop through events and display them
    for(var i = 0; i < reqData.length; i++) {
        list.append("<div class='subButton' id='re" + i + "'>" + reqData[i].requestID + "</div>");
        $("#re" + i).click(function(ev){

            selectedReqID = ev.target.innerText;
            console.log(selectedReqID);
            //Add user to list of people going
            addAttendee(cookieToUser(document.cookie), selectedReqID);
        });
    }
    hoverColorShift($(".subButton"));
}
function populateUserReq(data) {
    userReqData = data;
    var userReqList = $("#userReqList");
    for(var i = 0; i < data.length; i++) {
        userReqList.append("<div class='button' id='ur" + data[i].requestID + "'>" + data[i].concert + "</div>");
        $("#ur" + i).click(function(ev){
            selectedReqID = ev.target.id.substring(2);
            // Add user to list of people going
            getReqAttendees();
        });
    }
}
function buildUserReqWindow() {
    var page = $("body");
    // Build create request box
    page.after(
        "<div id=\"userReq\" class=\"userEntry\">" +
        "<h3>Your Request</h3>" +
        "<h3>Max Attendees</h3>" +
        "<div class='button' id=\"delButton\">Delete Request</div>" +
        "<div class='button' id=\"cButton\">Cancel</div>" +
        "</div>");

    $("#delButton").click(function(e) {
        deleteRequest(selectedReqID);
    });
    $("#cButton").click(function(){
        $("#createReq").remove();
    });
    hoverColorShift($(".button"));
}
function populateUserAtt(data) {
    userAttData = data;
    var userAttList = $("#userAttendList");
    for (var i = 0; i < data.length; i++) {
        userAttList.append("<div class='button' id='ua" + data[i].requestID + "'>" + data[i].concert + "</div>");
        $("#re" + i).click(function(ev){
            selectedReqID = ev.target.id.substring(2);
        });
    }
}


function hoverColorShift(el) {
    el.hover(
        function(e) { //MouseIn
            //$("#" + e.target.id).css("background", "#44ee44");
            $("#" + e.target.id).animate({backgroundColor: '#44ee44'}, 200);
        },
        function (e) { //MouseOut
            //$("#" + e.target.id).css("background", "#00CC00");
            $("#" + e.target.id).animate({backgroundColor: '#00CC00'}, 200);
        });
}
