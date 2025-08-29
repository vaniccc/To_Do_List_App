const listContainer = document.getElementById('listContainer');
const listPopup = document.getElementById('listPopup');
const listPopupTitle = document.getElementById('listPopupTitle');
const listPopupDescription = document.getElementById('listPopupDescription');
const closeListPopup = document.getElementById('closeListPopup');
const openTodoPopup = document.getElementById('openTodoPopup');
const todoPopup = document.getElementById('todoPopup');
const todoPopupTitle = document.getElementById('todoPopupTitle');
const newTodo = document.getElementById('newTodo');
const closeTodoPopup = document.getElementById('closeTodoPopup');

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
        listPopup.style.display = 'flex';
        listPopupTitle.textContent = list.title;
        listPopupDescription.innerHTML = `${list.description || 'Keine Beschreibung'}`;
      });

      openTodoPopup.addEventListener('click', () => {
        listPopup.style.display = 'none';
        todoPopup.style.display = 'flex';
        todoPopupTitle.textContent =  `Todo zur Liste "${list.title}" hinzufügen.`;
      });

      listContainer.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert('Fehler beim Laden der Listen');
  }
}

closeListPopup.addEventListener('click', () => {
  listPopup.style.display = 'none';
});

closeTodoPopup.addEventListener('click', () => {
  todoPopup.style.display = 'none';
  listPopup.style.display = 'flex';
});



loadLists();