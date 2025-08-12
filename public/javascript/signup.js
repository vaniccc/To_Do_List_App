const form = document.getElementById('signupform').addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if(username.value.length < 4) {
        alert("FEHLER: Der Benutzername muss mindestens 4 Zeichen lang sein.");
        return;
    }

    if(password.value.length < 1) {
        alert("FEHLER: Das Passwort muss mindestens 8 Zeichen betragen")
    }

    if(password != confirmPassword) {
        alert("FEHLER: Passwörter stimmen nicht überein.")
    }

    const response = await fetch("http://10.3.15.52:3000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ username, password, confirmPassword })
    });

    if(response.ok) {
        alert('Registrierung erfolgreich.');
    } else {
        alert('Fehler bei der Registrierung.');
    }
});

