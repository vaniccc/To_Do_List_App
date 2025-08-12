const form = document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    try {
        const res = await fetch('users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if(!res.ok) {
            alert('Fehler: ' + data.error);
            return;
        }
    
        alert(data.message);
        window.location.href = '../pages/to_do_lists.html';

    } catch (err) {
        console.error(err);
        alert('Fehler beim Login');
    }
});