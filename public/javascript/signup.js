const form = document.getElementById('form');
const username = document.getElementById('username').value;
const password = document.getElementById('password').value;
const confirmPassword = document.getElementById('confirmPassword').value;

function check() {

    // if(username.length < 4) {
    //     alert("Benutzername muss mindestens 4 Zeichen enthalten.");
    //     return;
    // }

    // if(password.length < 8) {
    //     alert("Password muss mindestens 8 Zeichen enthalten.");
    //     return;
    // }

    if(password !== confirmPassword) {
        alert("Passwörter stimmen nicht überein.");
        return;
    }
}