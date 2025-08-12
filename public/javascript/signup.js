const form = document.getElementById('signupForm').addEventListener("submit", async (e) => {
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

    if(password.value != confirmPassword.value) {
        alert("FEHLER: Passwörter stimmen nicht überein.")
    }

    try{

        const response = await fetch('users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password, confirmPassword })
        });

        const data = await response.json();

        if(response.ok) {
            alert('Registrierung erfolgreich.');
            form.reset();
        } else {
            alert('Fehler bei der Registrierung: ' + data.message);
        }
    }
    catch (error) {
        alert('Serverfehler: ' + error.message);
    }
});

