const taskForm = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const formMessage = document.querySelector('#form-message');
const searchInput = document.querySelector('#search');
const filterStatus = document.querySelector('#filter-status');
const refreshButton = document.querySelector('#refresh-button');
const taskTemplate = document.querySelector('#task-template');

function statusLabel(status) {
  return {
    pending: 'Pending',
    in_progress: 'In progress',
    completed: 'Completed'
  }[status] || status;
}

async function loadTasks() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
  if (filterStatus.value) params.set('status', filterStatus.value);

  const response = await fetch(`/api/tasks?${params.toString()}`);
  const result = await response.json();
  renderTasks(result.data || []);
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'}`;

  if (!tasks.length) {
    taskList.innerHTML = '<div class="empty-state">No tasks found. Add a task or change the search filter.</div>';
    return;
  }

  tasks.forEach((task) => {
    const fragment = taskTemplate.content.cloneNode(true);
    const item = fragment.querySelector('.task-item');
    const badge = fragment.querySelector('.status-badge');
    const statusSelect = fragment.querySelector('.status-select');

    fragment.querySelector('.task-title').textContent = task.title;
    fragment.querySelector('.task-description').textContent = task.description || 'No description provided.';
    fragment.querySelector('.task-meta').textContent = `Task ID: ${task.id} • Due: ${task.dueDate || 'Not set'}`;

    badge.textContent = statusLabel(task.status);
    badge.classList.add(`status-${task.status}`);
    statusSelect.value = task.status;

    fragment.querySelector('.update-button').addEventListener('click', async () => {
      await fetch(`/api/tasks/${task.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusSelect.value })
      });
      await loadTasks();
    });

    fragment.querySelector('.delete-button').addEventListener('click', async () => {
      if (!window.confirm(`Delete “${task.title}”?`)) return;
      await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
      await loadTasks();
    });

    taskList.appendChild(item);
  });
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formMessage.textContent = '';

  const formData = new FormData(taskForm);
  const task = Object.fromEntries(formData.entries());

  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });

  const result = await response.json();

  if (!response.ok) {
    formMessage.textContent = result.message || 'Could not create the task.';
    return;
  }

  taskForm.reset();
  formMessage.textContent = 'Task added successfully using POST /api/tasks.';
  await loadTasks();
});

searchInput.addEventListener('input', loadTasks);
filterStatus.addEventListener('change', loadTasks);
refreshButton.addEventListener('click', loadTasks);

loadTasks();
