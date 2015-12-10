/**
 * Created by joshstern on 11/30/15.
 */




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
                userHomePage(un, pw);

                //Remove login block
                $("#logIn").remove();
            }
            else{
                buildLoginWindow();
                console.log("Could not login");
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
function getUserReq(user) {
    $.ajax({
        method: "GET",
        url: "requests/" + user,
        success: function(data) {
            console.log(JSON.parse(data));
            if(data != "[]") {
                populateUserReq(JSON.parse(data));
            }
        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}
function getUserAtt(user) {
    $.ajax({
        method: "GET",
        url: "attendance/" + user,
        success: function(data) {
            console.log(JSON.parse(data));
            if(data != "[]") {
                populateUserAtt(JSON.parse(data));
            }
        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}
function deleteAtt(user) {
    //Submit finished product
    $.ajax({
        type: "DELETE",
        dataType: "text",
        data: {requestID: selectedReqID},
        url: "attendance/" + user,
        success: function(data) {
            if(data == "OK") {
                console.log("Concert Request Created");
                //Remove login block
                $("#userReq").remove();
                $("#ua" + selectedReqID).remove();
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

function getShowReq() {
    $.ajax({
        method: "GET",
        url: "requestsForConcert/" + showData[selectedShowIndex].displayName,
        success: function(data) {
            console.log(data);
            if(data == "[]") { //No requests for that show
                buildCreateReqWindow();
            }
            else{
                populateShowReqs(JSON.parse(data));
            }
        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}
function getReqAttendees() {
    $.ajax({
        method: "GET",
        url: "attendees/" + selectedReqID,
        success: function(data) {
            console.log(data);
            if(data != "FAIL") { //No requests for that show
                buildUserReqWindow(JSON.parse(data));
            }
        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}
function createRequest(concert, user, numCanAttend, numCurAttend, concertDate, concertLocation) {
    //Submit finished product
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {concert: concert, numCanAttend: numCanAttend, numCurAttend: numCurAttend, concertDate: concertDate, concertLocation: concertLocation},
        url: "requests/" + user,
        success: function(data) {
            if(data != "FAIL") {
                console.log("Concert Request Created");
                //Remove login block
                $("#createReq").remove();
                getUserReq(user);
                getUserAtt(user);
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
function deleteRequest() {
    //Submit finished product
    $.ajax({
        type: "DELETE",
        dataType: "text",
        url: "requests/" + selectedReqID,
        success: function(data) {
            if(data == "OK") {
                console.log("Concert Request Created");
                //Remove login block
                $("#userReq").remove();
                $("#ur" + selectedReqID).remove();
                $("#ua" + selectedReqID).remove();
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
function addAttendee(user, reqID) {
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {requestID: reqID},
        url: "attendance/" + user,
        success: function(data) {
            if(data == "OK") {
                console.log("Added to attendance!");
            }
            else{
                console.log("ERROR: Could not attend")
            }

        },
        error: function(data) {
            console.log("ERROR");
        }
    });
}

//ajax call with the new info
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