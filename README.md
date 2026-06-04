# Student Task Manager

A small web application for Software Construction Assignment 2. It applies the **Express framework** and demonstrates **RESTful web services**.

## Five Required Functionalities

1. Add a task using the website form.
2. View all tasks.
3. Search and filter tasks.
4. Add a task using the REST API: `POST /api/tasks`.
5. Update a task status using the REST API: `PATCH /api/tasks/:id/status`.

Bonus: Delete a task using `DELETE /api/tasks/:id`.

## Setup

1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Open **Terminal > New Terminal**.
4. Run:

```bash
npm install
npm start
```

5. Open: `http://localhost:3000`

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | View all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |

## Test with PowerShell

### View tasks

```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:3000/api/tasks
```

### Add a task

```powershell
Invoke-RestMethod -Method POST -Uri http://localhost:3000/api/tasks `
  -ContentType "application/json" `
  -Body '{"title":"Test REST API","description":"Created from PowerShell","status":"pending","dueDate":"2026-06-04"}'
```

### Update status

```powershell
Invoke-RestMethod -Method PATCH -Uri http://localhost:3000/api/tasks/1/status `
  -ContentType "application/json" `
  -Body '{"status":"completed"}'
```

## GitHub Upload

Create a new empty GitHub repository, then run:

```bash
git init
git add .
git commit -m "Complete Express task manager with REST API"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/student-task-manager.git
git push -u origin main
```
