const form = document.getElementById('addListForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    try {
        const result = fetch('/lists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description})
        });

        if(result.ok) {
            alert('Liste erfolgreich erstellt');
            document.getElementById('title').value = "";
            document.getElementById('description').value = "";
        } else {
            const data = result.json();
            alert(data.error || "Fehler beim Laden");
        }
    } catch(err) {
        console.error(err);
        alert('Fehler');
    }
});