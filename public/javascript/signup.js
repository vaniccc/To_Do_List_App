const form = document.getElementById('form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

function check_errors() {

    if(username.value.length < 4) {
        alert("Benutzername muss mindestens 4 Zeichen enthalten.");
        return;
    }
    else if(password.value.length < 1) {
        alert("Password muss mindestens 8 Zeichen enthalten.");
        return;
    }
    else if(password.value != confirmPassword.value) {
        alert("Passwörter stimmen nicht überein.");
        return;
    }
    else {
        window.location.href = "../pages/to_do_lists.html";
    }
}