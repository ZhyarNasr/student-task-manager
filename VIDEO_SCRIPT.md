# Video Script: Keep the Recording Under Two Minutes

## 0:00–0:15 — Introduction

Hello. This is my Software Construction Assignment 2 project. I developed a Student Task Manager using the Express framework, JavaScript, HTML, CSS, and RESTful web services.

## 0:15–0:35 — Framework Setup

Show `package.json`, `server.js`, and the VS Code Explorer.

I installed Express using npm. Express is the backend framework. The server file configures the application, serves the website, and defines the REST API routes. The frontend files are stored in the public folder.

## 0:35–0:58 — Five Functionalities

Show the browser.

The application supports five main functionalities: adding a task, viewing tasks, searching tasks, filtering tasks by status, and updating task status. It also supports deleting a task as a bonus feature.

Add one task and briefly use the search box.

## 0:58–1:32 — RESTful Web Services

Show the REST section in `server.js`, then use the browser interface or PowerShell.

The POST endpoint at `/api/tasks` creates a task from JSON data. The PATCH endpoint at `/api/tasks/:id/status` updates an existing task status. The GET endpoint retrieves task data. Each route returns a JSON response.

Run the POST PowerShell command and then the PATCH PowerShell command from `README.md`.

## 1:32–1:48 — Confirm Integration

Refresh the browser.

The task created using the REST API appears on the website, and its updated status is visible. This confirms that the REST services and website use the same stored data.

## 1:48–1:58 — GitHub

Show your GitHub repository.

Finally, the full source code is uploaded to my GitHub repository. Thank you.
