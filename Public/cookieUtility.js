/**
 * Created by joshstern on 12/1/15.
 */


function createCookie(user, pass) {
    var d = new Date();
    var exdays = 2;
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "username=" + user + ";" + expires;
    document.cookie = "password=" + pass + ";" + expires;
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

function logoutUser() {
    document.cookie = "username=";
    document.cookie = "password=";
    location.reload();

}

