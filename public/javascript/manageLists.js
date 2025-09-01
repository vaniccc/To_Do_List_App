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


async function loadLists() {
  try {
    const res = await fetch('/lists');

    const lists = await res.json();
    listContainer.innerHTML = '';

    if (lists.length === 0) {
      listContainer.innerHTML = '<li>Keine Listen vorhanden.</li>';
      return;
    }

    lists.forEach(list => {
      const li = document.createElement('li');
      li.textContent = `${list.title} – ${list.description || ''}`;

      li.addEventListener('click', async () => {
        listPopup.style.display = 'flex';
        listPopupTitle.textContent = list.title;
        listPopupDescription.innerHTML = `${list.description || 'Keine Beschreibung'}`;

        currentListId = list.list_id; 

        const todoUl = document.getElementById('listPopupTodos');
        todoUl.innerHTML = '';

        try {
          const resTodos = await fetch(`/todos/${currentListId}`);
          
          if (resTodos.ok) {
            const todos = await resTodos.json();
            todos.forEach(todo => {
                const li = document.createElement('li');

                const span = document.createElement('span');
                span.textContent = todo.title;

                const statusBtn = document.createElement('button');
                statusBtn.classList.add('todoStatusBtn', 'todoBtn');
                statusBtn.innerHTML = `<i class="material-icons">remove</i>`;

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('deleteTodoBtn', 'todoBtn');
                deleteBtn.innerHTML = `<i class="material-icons">delete</i>`;

                deleteBtn.addEventListener('click', async () => {
                  if(!confirm('Dieses Todo wirklich löschen?'))
                    return;

                  try {
                    const res = await fetch(`/todos/${todo.todo_id}`, {
                      method: 'DELETE'
                    });

                    if(!res.ok)
                      alert('Fehler beim Löschen des Todos');

                    li.remove();
                  } catch(err) {
                    console.error(err);
                    alert('Fehler beim Löschen des Todos');
                  }
                });

                li.appendChild(span);  
                li.appendChild(statusBtn);
                li.appendChild(deleteBtn);

                todoUl.appendChild(li);
            });
        }
    } catch (err) {
        console.error(err);
    }

    openTodoPopup.onclick = () => {
        listPopup.style.display = 'none';
        todoPopup.style.display = 'flex';
        todoPopupTitle.textContent = `Todo zur Liste "${list.title}" hinzufügen.`;
    };
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


newTodo.addEventListener('click', async (e) => {
  e.preventDefault?.();

  if (!currentListId) {
    alert('Bitte zuerst eine Liste auswählen.');
    return;
  }

  const title = todoTitleInput.value.trim();
  const description = todoDescriptionInput.value.trim();

  if (!title) {
    alert('Bitte einen Todo-Titel eingeben.');
    todoTitleInput.focus();
    return;
  }

  try {
    const res = await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ list_id: currentListId, title, description })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Fehler beim Anlegen des To-Dos');
    }

    const todo = await res.json();

    todoTitleInput.value = '';
    todoDescriptionInput.value = '';

    todoPopup.style.display = 'none';
    listPopup.style.display = 'flex';

    const todoUl = document.getElementById('listPopupTodos');

    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = todo.title;

    const statusBtn = document.createElement('button');
    statusBtn.classList.add('todoStatusBtn', 'todoBtn');
    statusBtn.innerHTML = `<i class="material-icons">remove</i>`;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteTodoBtn', 'todoBtn');
    deleteBtn.innerHTML = `<i class="material-icons">delete</i>`;

    deleteBtn.addEventListener('click', async () => {
      if(!confirm('Dieses Todo wirklich löschen?'))
        return;

      try {
        const res = await fetch(`/todos/${todo.todo_id}`, {
  method: 'DELETE'
});

        if(!res.ok)
          alert('Fehler beim Löschen des Todos');

        li.remove();
      } catch(err) {
        console.error(err);
        alert('Fehler beim Löschen des Todos');
      }
  });
      
    li.appendChild(span);
    li.appendChild(statusBtn);
    li.appendChild(deleteBtn);

    todoUl.appendChild(li);

  } catch (err) {
    console.error(err);
    alert('Fehler beim Anlegen des Todos');
  }
});

loadLists();