/**
 * Created by joshstern on 11/30/15.
 */



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
function updateUser(oldPassword, newUsername, newPassword) {
    $.ajax({
        type: "PUT",
        dataType: "text",
        data: {oldpassword: oldPassword, newusername: newUsername.val(), newpassword:newPassword.val()},
        url: "users/" + userName,
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