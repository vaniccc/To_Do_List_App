const form = document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    try {
        const result = await fetch('/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description})
        });

        
    } catch(err) {
        console.error(err);
        alert('Fehler');
    }

});