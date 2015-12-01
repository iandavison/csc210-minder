/**
 * Created by joshstern on 11/30/15.
 */


function createRequest(concert, user, numCanAttend, numCurAttend, concertDate, concertLocation) {
    //Submit finished product
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {concert: concert, numCanAttend: numCanAttend, numCurAttend: numCurAttend, concertDate: concertDate, concertLocation: concertLocation},
        url: "users/" + user,
        success: function(data) {
            if(data == "OK") {
                console.log("Concert Request Created");
                //Remove login block
                $("#createReq").remove();
            }
            else{
                console.log("ERROR: Could not create event")
            }

        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}

function createUser(un, pw, n) {
    //Submit finished product
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {password: pw, nm: n},
        url: "users/" + un,
        success: function(data) {
            if(data == "OK") {
                console.log("User Created");
                $("#showFeed").css("visibility", "visible");
                createCookie(un, pw);
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

//ajax call with the new info
function updateUser(oldUsername, oldPassword, newUsername, newPassword) {
    $.ajax({
        type: "PUT",
        dataType: "text",
        data: {oldpassword: oldPassword, newusername: newUsername, newpassword: newPassword},
        url: "users/" + oldUsername,
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

function login(un, pw) {
    //Submit finished product
    $.ajax({
        type: "GET",
        dataType: "text",
        url: "userLogIn/" + un + "&" + pw,
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
            else{
                buildLogIn();
                console.log("Could not login");
            }
        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}

function getShowReq(shIndex) {
    $.ajax({
        method: "GET",
        url: "requests/" + showList[shIndex].displayName,
        success: function(data) {
            console.log(data);
            if(data == "") { //No requests for that show
                buildCreateReq(shIndex);
            }
            else{
                // TODO: Should display available requests (With an option to create a new one)
            }
        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}

function getDatabase() {
    $.ajax({
        method: "GET",
        url: "userDatabase/",
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