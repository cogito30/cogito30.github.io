function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const day = days[now.getDay()];
    document.getElementById('date').textContent = `${year}-${month}-${date} (${day})`;
}

setInterval(updateClock, 1000);
updateClock();

function handleKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTodo();
    }
}

function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

function renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    const todos = loadTodos();
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        
        const span = document.createElement('span');
        span.textContent = todo.text;

        const controls = document.createElement('div');
        controls.className = 'todo-controls';

        const checkBtn = document.createElement('button');
        checkBtn.innerHTML = '✅';
        checkBtn.onclick = () => {
            todo.completed = !todo.completed;
            saveTodos(todos);
            renderTodos();
        };

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.onclick = () => {
            const newText = prompt('할 일을 수정하세요:', todo.text);
            if (newText !== null) {
                todo.text = newText.trim();
                saveTodos(todos);
                renderTodos();
            }
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => {
            todos.splice(index, 1);
            saveTodos(todos);
            renderTodos();
        };

        controls.appendChild(checkBtn);
        controls.appendChild(editBtn);
        controls.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(controls);
        todoList.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById('todo-text');
    const text = input.value.trim();
    if (text === '') return;

    const todos = loadTodos();
    todos.push({ text, completed: false });
    saveTodos(todos);
    renderTodos();

    input.value = '';
}

document.addEventListener('DOMContentLoaded', renderTodos);