// Professional frontend script for Primetrade demo (index.html + dashboard.html)
const BASE_URL = "http://127.0.0.1:8000/api/v1";

// --- Helpers ---
function showAlert(el, type, message) {
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type} mb-0">${message}</div>`;
  setTimeout(()=>{ el.innerHTML = '' }, 6000);
}

async function apiFetch(path, options = {}) {
  const url = BASE_URL + path;
  options.headers = options.headers || {};
  if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json';

  // attach token
  const token = localStorage.getItem('access');
  if (token) options.headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, options);
  if (res.status === 401 && localStorage.getItem('refresh')) {
    // try refresh
    const ok = await tryRefreshToken();
    if (ok) {
      // retry original request once
      const newToken = localStorage.getItem('access');
      options.headers['Authorization'] = `Bearer ${newToken}`;
      return fetch(url, options);
    }
  }
  return res;
}

async function tryRefreshToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return false;
  try {
    const r = await fetch(BASE_URL + '/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });
    if (!r.ok) { logoutUser(); return false; }
    const data = await r.json();
    localStorage.setItem('access', data.access);
    return true;
  } catch (e) {
    logoutUser();
    return false;
  }
}

function logoutUser(){
  localStorage.removeItem('access'); localStorage.removeItem('refresh');
  window.location.href = 'index.html';
}

// --- Auth handlers (index.html) ---
async function registerUser(e){
  e?.preventDefault();
  const el = document.getElementById('regAlert');
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  if (!username || !email || !password) { showAlert(el, 'danger', 'All fields are required'); return; }

  const r = await apiFetch('/accounts/register/', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
  if (r.ok) { showAlert(el, 'success', 'Registration successful. Please login.'); }
  else {
    const data = await r.json().catch(()=>({ detail: 'Register failed' }));
    showAlert(el, 'danger', JSON.stringify(data));
  }
}

async function loginUser(e) {
  e?.preventDefault();
  const el = document.getElementById('loginAlert');
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!username || !password) { showAlert(el, 'danger', 'Enter username & password'); return; }

  const r = await fetch(BASE_URL + '/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await r.json();
  if (r.ok && data.access) {
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    window.location.href = 'dashboard.html';
  } else {
    showAlert(el, 'danger', JSON.stringify(data));
  }
}

// --- Tasks (dashboard.html) ---
async function createTask(){
  const el = document.getElementById('taskAlert');
  const title = document.getElementById('task_title').value.trim();
  const description = document.getElementById('task_description').value.trim();
  if (!title) { showAlert(el, 'danger', 'Task title is required'); return; }

  const r = await apiFetch('/tasks/', {
    method: 'POST',
    body: JSON.stringify({ title, description })
  });
  if (r.ok) {
    showAlert(el, 'success', 'Task created');
    document.getElementById('task_title').value = '';
    document.getElementById('task_description').value = '';
    fetchTasks();
  } else {
    const d = await r.json().catch(()=>({ detail:'Failed' }));
    showAlert(el, 'danger', JSON.stringify(d));
  }
}

async function fetchTasks(){
  const list = document.getElementById('taskList');
  const count = document.getElementById('countText');
  list.innerHTML = '<li class="list-group-item bg-transparent text-muted">Loading...</li>';
  const r = await apiFetch('/tasks/');
  if (r.ok) {
    const tasks = await r.json();
    count.textContent = `(${tasks.length})`;
    if (!tasks.length) {
      list.innerHTML = '<li class="list-group-item bg-transparent text-muted">No tasks found</li>';
      return;
    }
    list.innerHTML = '';
    tasks.forEach(t => {
      const li = document.createElement('li');
      li.className = 'list-group-item bg-transparent text-light d-flex justify-content-between align-items-start task-item';
      li.innerHTML = `
        <div><strong>${escapeHtml(t.title)}</strong><div class="muted small">${escapeHtml(t.description || '')}</div></div>
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-outline-danger" onclick="deleteTask(${t.id})">Delete</button>
        </div>`;
      list.appendChild(li);
    });
  } else {
    logoutUser();
  }
}

async function deleteTask(id){
  await apiFetch(`/tasks/${id}/`, { method: 'DELETE' });
  fetchTasks();
}

function escapeHtml(unsafe) {
  return String(unsafe).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  const regBtn = document.getElementById('registerBtn');
  const loginBtn = document.getElementById('loginBtn');
  const addBtn = document.getElementById('addTaskBtn');
  const clearBtn = document.getElementById('clearBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const refreshBtn = document.getElementById('refreshBtn');

  if (regBtn) regBtn.addEventListener('click', registerUser);
  if (loginBtn) loginBtn.addEventListener('click', loginUser);
  if (addBtn) addBtn.addEventListener('click', createTask);
  if (clearBtn) clearBtn.addEventListener('click', ()=>{ document.getElementById('task_title').value=''; document.getElementById('task_description').value=''; });
  if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
  if (refreshBtn) refreshBtn.addEventListener('click', fetchTasks);

  // if dashboard page, load tasks
  if (location.pathname.endsWith('dashboard.html')) {
    // if no token -> redirect to login
    if (!localStorage.getItem('access')) { window.location.href='index.html'; return; }
    fetchTasks();
  }
});
