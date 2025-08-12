const form = document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if(username.length < 4) {
        alert("FEHLER: Der Benutzername muss mindestens 4 Zeichen lang sein.");
        return;
    }

    if(password.length < 1) {
        alert("FEHLER: Das Passwort muss mindestens 8 Zeichen betragen");
        return;
    }

    if(password != confirmPassword) {
        alert("FEHLER: Passwörter stimmen nicht überein.");
        return;
    }

    try{

        const res = await fetch('/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, confirmPassword })
        });

        const data = await res.json();

       if (!res.ok) {
            alert('Fehler bei der Registrierung: ' + data.error);
        } else {
            alert('Registrierung erfolgreich.');
            document.getElementById('signupForm').reset();
        }
    }
    catch (err) {
        console.error(err);
        alert('Serverfehler:');
    }
});

