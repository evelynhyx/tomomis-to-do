const toDoForm = document.querySelector('form');
const toDoInput = document.getElementById('to-do-input');
const toDoListUL = document.getElementById('to-do-list');
const modalOverlay = document.getElementById('modal-overlay');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');
const overlay = document.getElementById('info-modal-overlay');
const closeBtn = document.getElementById('info-close-btn');

let pendingDeleteIndex = null;

modalCancel.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    pendingDeleteIndex = null;
});

modalConfirm.addEventListener('click', () => {
    if (pendingDeleteIndex !== null) {
        allToDos = allToDos.filter((_, i) => i !== pendingDeleteIndex);
        saveToDos();
        updateToDoList();
        pendingDeleteIndex = null;
    }
    modalOverlay.classList.add('hidden');
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
        pendingDeleteIndex = null;
    }
});

let allToDos = getToDos();
updateToDoList();

toDoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addToDo();
});

function addToDo() {
    const toDoText = toDoInput.value.trim();
    if (toDoText.length > 0) {
        const toDoObject = {
            text: toDoText,
            completed: false
        }
        allToDos.push(toDoObject);
        updateToDoList();
        saveToDos();
        toDoInput.value = '';
    }
}

function updateToDoList() {
    toDoListUL.innerHTML = '';
    allToDos.forEach((toDo, toDoIndex) => {
        toDoItem = createToDoItem(toDo, toDoIndex);
        toDoListUL.append(toDoItem);
    });
}

function createToDoItem(toDo, toDoIndex) {
    const toDoID = 'toDo-' + toDoIndex;
    const toDoLI = document.createElement('li');
    const toDoText = toDo.text;
    toDoLI.className = 'to-do';
    toDoLI.innerHTML = `
        <input type="checkbox" id="${toDoID}">
        <label class="custom-checkbox" for="${toDoID}">
            <svg fill="transparent" viewBox="-3.5 0 19 19" height="24px" xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4.63 15.638a1.028 1.028 0 0 1-.79-.37L.36 11.09a1.03 1.03 0 1 1 1.58-1.316l2.535 3.043L9.958 3.32a1.029 1.029 0 0 1 1.783 1.03L5.52 15.122a1.03 1.03 0 0 1-.803.511.89.89 0 0 1-.088.004z"></path></g></svg>
        </label>
        <label for="${toDoID}" class="to-do-text">
            ${toDoText}
        </label>
        <button class="delete-btn">
            <svg fill="var(--secondary-color)" viewBox="0 0 24 24" height="24px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.5001 6H3.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M9.5 11L10 16" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.5 11L14 16" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path> <path d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="#000000" stroke-width="1.5"></path> </g></svg>
        </button>
    `
    const deleteBtn = toDoLI.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        deleteToDoItem(toDoIndex);
    });
    const checkbox = toDoLI.querySelector('input');
    checkbox.addEventListener('change', () => {
        allToDos[toDoIndex].completed = checkbox.checked;
        saveToDos();
    });
    checkbox.checked = toDo.completed;
    return toDoLI;
}

function deleteToDoItem(toDoIndex) {
    pendingDeleteIndex = toDoIndex;
    modalOverlay.classList.remove('hidden');
}

function saveToDos() {
    const toDosJSON = JSON.stringify(allToDos);
    localStorage.setItem('toDos', toDosJSON);
}

function getToDos() {
    const toDos = localStorage.getItem('toDos') || '[]';
    return JSON.parse(toDos);
}

document.querySelector('.info-img').addEventListener('click', () => {
    overlay.classList.remove('hidden');
});

overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
});

document.querySelector('.info-modal').addEventListener('click', (e) => {
    e.stopPropagation();
});

closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.classList.add('hidden');
});