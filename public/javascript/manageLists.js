const listContainer = document.getElementById('listContainer');

async function loadLists() {
  try {
    const res = await fetch('/lists');
    if (!res.ok) {
      alert('Bitte zuerst einloggen.');
      window.location.href = '../index.html';
      return;
    }

    const lists = await res.json();
    listContainer.innerHTML = '';

    if (lists.length === 0) {
      listContainer.innerHTML = '<li>Keine Listen vorhanden.</li>';
      return;
    }

    lists.forEach(list => {
      const li = document.createElement('li');
      li.textContent = `${list.title} – ${list.description || ''}`;
      listContainer.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert('Fehler beim Laden der Listen');
  }
}

loadLists();