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

const listTitleInput = document.getElementById('newListTitle');
const listDescriptionInput = document.getElementById('newListDescription');

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
      
      // Erstellung der Listen Items (listen)

      const li = document.createElement('li');
      li.classList.add('list-item');

      const listTitleSpan = document.createElement('span');
      listTitleSpan.textContent = list.title;

      const editListBtn = document.createElement('button');
      editListBtn.classList.add('editListBtn');
      editListBtn.innerHTML = `<i class="material-icons">edit</i>`;

      const deleteListBtn = document.createElement('button');
      deleteListBtn.classList.add('deleteListBtn');
      deleteListBtn.innerHTML = `<i class="material-icons">delete</i>`;

      li.appendChild(listTitleSpan);  
      li.appendChild(editListBtn);
      li.appendChild(deleteListBtn);

      


      // Nach anklicken der Liste
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

                if(todo.is_done) {
                  statusBtn.style.backgroundColor = 'green';
                  statusBtn.innerHTML = `<i class="material-icons">check</i>`;
                } else {
                  statusBtn.innerHTML = `<i class="material-icons">remove</i>`;
                  statusBtn.style.backgroundColor = '';
                }

                statusBtn.addEventListener('click', async () => {
                  try {
                    const res = await fetch(`/todos/${todo.todo_id}`, {
                      method: 'PATCH'
                    });

                    if(!res.ok) {
                      alert('Fehler beim Ändern des Statuses');
                      return;
                    }

                    const updatedTodo = await res.json();
                    todo.is_done = updatedTodo.is_done;

                    if (updatedTodo.is_done) {
                      statusBtn.style.backgroundColor = 'green';
                      statusBtn.innerHTML = `<i class="material-icons">check</i>`;
                    } else {
                      statusBtn.style.backgroundColor = '';
                      statusBtn.innerHTML = `<i class="material-icons">remove</i>`;
                    }
                    

                  } catch(err) {
                    console.error(err);
                  }
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('deleteTodoBtn', 'todoBtn');
                deleteBtn.innerHTML = `<i class="material-icons">delete</i>`;

                deleteBtn.addEventListener('click', async () => {
                  if(!confirm('Dieses Todo wirklich löschen?'))
                    return;

                  try {
                    const res = await fetch(`/todos/${todo.todo_id}`, { method: 'DELETE' });

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
        listContainer.appendChild(li);
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
        const res = await fetch(`/todos/${todo.todo_id}`, { method: 'DELETE' });

        if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Fehler beim Löschen:', res.status, res.statusText, errorData);
      alert(`Fehler beim Löschen des Todos: ${errorData.error || res.status}`);
      return;
    }

        console.log('Todo gelöscht:', todo.todo_id);
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