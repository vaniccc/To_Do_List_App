const listContainer = document.getElementById('listContainer');
const popup = document.getElementById('todoPopup');
const popupTitle = document.getElementById('popupTitle');
const popupDescription = document.getElementById('popupDescription');
const closePopupBtn = document.getElementById('closePopup');
const openNewTodoBtn = document.getElementById('openNewTodoBtn');
const newTodoPopup = document.getElementById('newTodoPopup');
const newTodoPopupTitle = document.getElementById('newTodoPopupTitle');

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

    const lists = await res.json();
    listContainer.innerHTML = '';

    if (lists.length === 0) {
      listContainer.innerHTML = '<li>Keine Listen vorhanden.</li>';
      return;
    }

    lists.forEach(list => {
      const li = document.createElement('li');
      li.textContent = `${list.title} – ${list.description || ''}`;

      li.addEventListener('click', () => {
        popup.style.display = 'flex';
        popupTitle.textContent = list.title;
        popupDescription.innerHTML = `${list.description || 'Keine Beschreibung'}`;
      });

      listContainer.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert('Fehler beim Laden der Listen');
  }
}

closePopupBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

openNewTodoBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  newTodoPopup.style.display = 'flex';
  newTodoPopupTitle.textContent =  `Todo zur Liste "${list.title}" hinzufügen.`;
});

loadLists();