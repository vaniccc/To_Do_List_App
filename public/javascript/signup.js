const form = document.getElementById('form')
const username = document.getElementById('username').value
const password = document.getElementById('password').value
const confirmPassword = document.getElementById('confirmPassword').value

if(password !== confirmPassword) {
    alert("Passwörter stimmen nicht überein.")
    return;
}

 
