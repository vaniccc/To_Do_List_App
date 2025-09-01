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

const todoTitleInput = document.getElementById('todoTitle');
const todoDescriptionInput = document.getElementById('todoDescription');

let currentListId = null;


// async function loadLists() {
//   try {
//     const res = await fetch('/lists');

//     const lists = await res.json();
//     listContainer.innerHTML = '';

//     if (lists.length === 0) {
//       listContainer.innerHTML = '<li>Keine Listen vorhanden.</li>';
//       return;
//     }

//     lists.forEach(list => {
//       const li = document.createElement('li');
//       li.textContent = `${list.title} – ${list.description || ''}`;

//       li.addEventListener('click', () => {
//         listPopup.style.display = 'flex';
//         listPopupTitle.textContent = list.title;
//         listPopupDescription.innerHTML = `${list.description || 'Keine Beschreibung'}`;
      
//         currentListId = list.list_id; 
//         openTodoPopup.onclick = () => {
//         listPopup.style.display = 'none';
//         todoPopup.style.display = 'flex';
//         todoPopupTitle.textContent = `Todo zur Liste "${list.title}" hinzufügen.`;
//       };
//       });

//       listContainer.appendChild(li);
//     });
//   } catch (err) {
//     console.error(err);
//     alert('Fehler beim Laden der Listen');
//   }
// }

// closeListPopup.addEventListener('click', () => {
//   listPopup.style.display = 'none';
// });

// closeTodoPopup.addEventListener('click', () => {
//   todoPopup.style.display = 'none';
//   listPopup.style.display = 'flex';
// });



// newTodo.addEventListener('click', async (e) => {
//   e.preventDefault?.();

//   if (!currentListId) {
//     alert('Bitte zuerst eine Liste auswählen.');
//     return;
//   }

//   const title = todoTitleInput.value.trim();
//   const description = todoDescriptionInput.value.trim();

//   if (!title) {
//     alert('Bitte einen Todo-Titel eingeben.');
//     todoTitleInput.focus();
//     return;
//   }

//   try {
//     const res = await fetch('/todos', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ list_id: currentListId, title, description })
//     });

//     if (!res.ok) {
//       const data = await res.json().catch(() => ({}));
//       throw new Error(data.error || 'Fehler beim Anlegen des To-Dos');
//     }

//     const todo = await res.json();

//     todoTitleInput.value = '';
//     todoDescriptionInput.value = '';

//     todoPopup.style.display = 'none';
//     listPopup.style.display = 'flex';

//     const li = document.createElement('li');

//     const span = document.createElement('span');
//     span.textContent = todo.title;

//     const statusBtn = document.createElement('button');
//     statusBtn.classList.add('todoStatusBtn', 'todoBtn');
//     statusBtn.innerHTML = `<i class="material-icons">remove</i>`;

//     const deleteBtn = document.createElement('button');
//     deleteBtn.classList.add('deleteTodoBtn', 'todoBtn');
//     deleteBtn.innerHTML = `<i class="material-icons">delete</i>`;
      
//     li.appendChild(span);
//     li.appendChild(statusBtn);
//     li.appendChild(deleteBtn);


//     document.getElementById('listPopupTodos')?.appendChild(li);

//   } catch (err) {
//     console.error(err);
//     alert('Fehler beim Anlegen des Todos');
//   }
// });



// loadLists();


async function loadLists() {
    try {
        const res = await fetch('/lists');
        if (!res.ok) throw new Error('Fehler beim Laden der Listen');

        const lists = await res.json();
        listContainer.innerHTML = '';

        if (lists.length === 0) {
            listContainer.innerHTML = '<li>Keine Listen vorhanden.</li>';
            return;
        }

        lists.forEach(list => {
            const li = document.createElement('li');
            li.textContent = `${list.title} – ${list.description || ''}`;

            li.addEventListener('click', () => openListPopup(list));
            listContainer.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        alert('Fehler beim Laden der Listen');
    }
}

// Öffnet das Popup einer Liste und lädt deren Todos
async function openListPopup(list) {
    listPopup.style.display = 'flex';
    listPopupTitle.textContent = list.title;
    listPopupDescription.textContent = list.description || 'Keine Beschreibung';
    currentListId = list.list_id;

    const todoUl = document.getElementById('listPopupTodos');
    todoUl.innerHTML = ''; // alte Todos löschen

    try {
        const res = await fetch(`/todos/${currentListId}`);
        if (!res.ok) throw new Error('Fehler beim Laden der Todos');
        const todos = await res.json();

        todos.forEach(todo => {
            appendTodoToList(todo);
        });
    } catch (err) {
        console.error(err);
        alert('Fehler beim Laden der Todos');
    }

    openTodoPopup.onclick = () => {
        listPopup.style.display = 'none';
        todoPopup.style.display = 'flex';
        todoPopupTitle.textContent = `Todo zur Liste "${list.title}" hinzufügen.`;
    };
}

// Fügt ein Todo-Element in die Liste ein
function appendTodoToList(todo) {
    const todoUl = document.getElementById('listPopupTodos');

    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = todo.title;
    li.appendChild(span);

    const statusBtn = document.createElement('button');
    statusBtn.classList.add('todoStatusBtn', 'todoBtn');
    statusBtn.innerHTML = `<i class="material-icons">${todo.is_done ? 'check' : 'remove'}</i>`;
    statusBtn.onclick = () => toggleTodoStatus(todo.todo_id, statusBtn);
    li.appendChild(statusBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteTodoBtn', 'todoBtn');
    deleteBtn.innerHTML = `<i class="material-icons">delete</i>`;
    deleteBtn.onclick = () => deleteTodo(todo.todo_id, li);
    li.appendChild(deleteBtn);

    todoUl.appendChild(li);
}

// Neues Todo anlegen
newTodo.addEventListener('click', async () => {
    const title = todoTitleInput.value.trim();
    if (!title) {
        alert('Bitte einen Titel eingeben.');
        return;
    }

    try {
        const res = await fetch('/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ list_id: currentListId, title })
        });

        if (!res.ok) 
          throw new Error('Fehler beim Anlegen des Todos');

        const todo = await res.json();

        appendTodoToList(todo);

        todoTitleInput.value = '';
        todoDescriptionInput.value = '';

        todoPopup.style.display = 'none';
        listPopup.style.display = 'flex';
    } catch (err) {
        console.error(err);
        alert('Fehler beim Anlegen des Todos');
    }
});

// Todo-Status ändern
async function toggleTodoStatus(todoId, btn) {
    try {
        const res = await fetch(`/todos/status/${todoId}`, { method: 'PATCH' });

        if (!res.ok) 
          throw new Error('Fehler beim Ändern des Status');

        const updatedTodo = await res.json();
        btn.innerHTML = `<i class="material-icons">${updatedTodo.is_done ? 'check' : 'remove'}</i>`;
    } catch (err) {
        console.error(err);
        alert('Fehler beim Ändern des Status');
    }
}

// Todo löschen
async function deleteTodo(todoId, liElement) {
    if (!confirm('Möchten Sie dieses Todo wirklich löschen?')) return;

    try {
        const res = await fetch(`/todos/${todoId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Fehler beim Löschen');
        liElement.remove();
    } catch (err) {
        console.error(err);
        alert('Fehler beim Löschen des Todos');
    }
}

// Popup schließen
closeListPopup.addEventListener('click', () => { listPopup.style.display = 'none'; });
closeTodoPopup.addEventListener('click', () => {
    todoPopup.style.display = 'none';
    listPopup.style.display = 'flex';
});

// Listen laden beim Start
loadLists();