// Elemen DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('.close-btn');

let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

// Load tasks dari localStorage saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    updateStats();
});

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

saveBtn.addEventListener('click', saveEditedTask);
cancelBtn.addEventListener('click', closeEditModal);
closeBtn.addEventListener('click', closeEditModal);
editInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveEditedTask();
    }
});

// Tutup modal saat klik di luar modal
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

// Fungsi Tambah Task
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        taskInput.focus();
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString('id-ID')
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    taskInput.value = '';
    taskInput.focus();
}

// Fungsi Edit Task
function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        editingTaskId = taskId;
        editInput.value = task.text;
        editModal.classList.add('active');
        editInput.focus();
        editInput.select();
    }
}

// Fungsi Simpan Edit
function saveEditedTask() {
    const newText = editInput.value.trim();

    if (newText === '') {
        editInput.focus();
        return;
    }

    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        task.text = newText;
        saveTasks();
        renderTasks();
        closeEditModal();
    }
}

// Fungsi Tutup Modal Edit
function closeEditModal() {
    editModal.classList.remove('active');
    editingTaskId = null;
    editInput.value = '';
}

// Fungsi Hapus Task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
    updateStats();
}

// Fungsi Toggle Completed
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Fungsi Render Tasks
function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;

    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <p>📌 ${
                    currentFilter === 'all' 
                        ? 'Belum ada tugas. Mulai tambahkan tugas baru!' 
                        : currentFilter === 'completed'
                        ? 'Belum ada tugas yang selesai'
                        : 'Tidak ada tugas aktif'
                }</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <div class="task-text-wrapper">
                <div class="task-text">${escapeHtml(task.text)}</div>
                <div class="task-time">${task.createdAt}</div>
            </div>
            <div class="task-actions">
                <button class="btn btn-edit" onclick="openEditModal(${task.id})">✏️</button>
                <button class="btn btn-delete" onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

// Fungsi Update Stats
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
}

// Fungsi Save Tasks ke localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fungsi Load Tasks dari localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
        } catch (e) {
            tasks = [];
        }
    }
}

// Fungsi Escape HTML untuk prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// Fungsi Escape HTML untuk prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
const username = localStorage.getItem("username");
const welcome = document.getElementById("welcome");
if(username){
  welcome.textContent = `Halo, ${username} 👋`;
}
