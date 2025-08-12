const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logout-button');

async function loadCurrentUser() {
    try {
        const res = await fetch('/users/user');

        if(!res.ok) {
            window.location.href = '../index.html';
            return;
        }

        const data = await res.json();
        if(data && data.user) {
            usernameDisplay.textContent = data.user.username;
        }
    } catch (err) {
        console.error('Fehler beim Laden des Benutzers: ', err);
    }
}

async function logoutUser() {
    try {
        const res = await fetch('/users/logout');

        if(!res.ok) {
            alert('Logout fehlgeschlagen');
        } else {
            window.location.href = '../index.html';
        }
    } catch {
        console.error('Fehler beim Logout: ', err);
    }
}

logoutBtn.addEventListener('click', logoutUser);
loadCurrentUser();