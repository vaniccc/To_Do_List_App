const listContainer = document.getElementById('listContainer');

async function loadLists() {
  try {
    const res = await fetch('/lists');

     if (!res.ok) {
      if (res.status === 401) {
        alert('Bitte zuerst einloggen.');
        window.location.href = '/pages/login.html';
        return;
      }
      throw new Error('Fehler beim Laden: ' + res.status);
    }

    const lists = res.json();
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