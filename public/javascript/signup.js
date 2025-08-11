const form = document.getElementById('form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

function check() {

    // if(username.length < 4) {
    //     alert("Benutzername muss mindestens 4 Zeichen enthalten.");
    //     return;
    // }

    // if(password.length < 8) {
    //     alert("Password muss mindestens 8 Zeichen enthalten.");
    //     return;
    // }
    alert(username.value + ", " + password.value);

    if(password.value != confirmPassword.value) {
        alert("Passwörter stimmen nicht überein.");
        return;
    }
}