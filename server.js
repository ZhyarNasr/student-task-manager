const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readTasks() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Could not read tasks.json:', error.message);
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

function normalizeTaskInput(body) {
  return {
    title: typeof body.title === 'string' ? body.title.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : '',
    status: typeof body.status === 'string' ? body.status.trim() : 'pending',
    dueDate: typeof body.dueDate === 'string' ? body.dueDate.trim() : ''
  };
}

function validateTask(task) {
  const allowedStatuses = ['pending', 'in_progress', 'completed'];
  if (!task.title) return 'Title is required.';
  if (!allowedStatuses.includes(task.status)) {
    return 'Status must be pending, in_progress, or completed.';
  }
  return null;
}

// REST API 1: View tasks. Supports optional search and status filters.
app.get('/api/tasks', (req, res) => {
  const search = String(req.query.search || '').toLowerCase();
  const status = String(req.query.status || '');

  let tasks = readTasks();

  if (search) {
    tasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search)
    );
  }

  if (status) {
    tasks = tasks.filter((task) => task.status === status);
  }

  res.json({ success: true, data: tasks });
});

// REST API 2: Create a task by sending JSON data.
app.post('/api/tasks', (req, res) => {
  const tasks = readTasks();
  const input = normalizeTaskInput(req.body);
  const validationError = validateTask(input);

  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const task = {
    id: tasks.length ? Math.max(...tasks.map((item) => item.id)) + 1 : 1,
    ...input,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  writeTasks(tasks);

  return res.status(201).json({
    success: true,
    message: 'Task created successfully.',
    data: task
  });
});

// REST API 3: Update the status of an existing task.
app.patch('/api/tasks/:id/status', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((item) => item.id === Number(req.params.id));
  const allowedStatuses = ['pending', 'in_progress', 'completed'];

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be pending, in_progress, or completed.'
    });
  }

  task.status = req.body.status;
  writeTasks(tasks);

  return res.json({
    success: true,
    message: 'Task status updated successfully.',
    data: task
  });
});

// Bonus endpoint: Delete a task.
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex((item) => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  const [deletedTask] = tasks.splice(index, 1);
  writeTasks(tasks);

  return res.json({
    success: true,
    message: 'Task deleted successfully.',
    data: deletedTask
  });
});

app.listen(PORT, () => {
  console.log(`Student Task Manager is running at http://localhost:${PORT}`);
});
