# Task Manager

Internal tool: log in, create projects, add tasks, update task status (Todo / In Progress / Done).

```
task-manager-app/
├── backend/    Node.js + Express + MongoDB + JWT   (http://localhost:5000)
└── frontend/   React + Vite + Tailwind             (http://localhost:5173)
```

## Run it

You need Node 18+ and a running MongoDB (local or Atlas).

**1. Backend**
```bash
cd backend
cp .env.example .env      # then set MONGO_URI and JWT_SECRET
npm install
npm run dev
```
Check it is up: `GET http://localhost:5000/api/health`

**2. Frontend** (second terminal)
```bash
cd frontend
npm install
npm run dev
```

## API

All routes are under `/api`. Everything except `/auth/*` needs `Authorization: Bearer <token>`.

| Method | Path                  | Body                      | Notes                              |
|--------|-----------------------|---------------------------|------------------------------------|
| POST   | /auth/signup          | name, email, password     | returns `{ user, token }`          |
| POST   | /auth/login           | email, password           | returns `{ user, token }`          |
| GET    | /projects             |                           | includes `taskCount`               |
| POST   | /projects             | name                      |                                    |
| GET    | /projects/:id         |                           |                                    |
| PATCH  | /projects/:id         | name                      |                                    |
| DELETE | /projects/:id         |                           | also deletes its tasks             |
| GET    | /projects/:id/tasks   |                           |                                    |
| POST   | /projects/:id/tasks   | title, status (optional)  |                                    |
| PATCH  | /tasks/:id            | title and/or status       | status: todo, in_progress, done    |
| DELETE | /tasks/:id            |                           |                                    |

Errors always look like `{ "message": "..." }` (validation errors also include `details`).

## Backend layout

```
src/
├── config/        env, db connection, constants
├── models/        User, Project, Task
├── controllers/   all business logic
├── routes/        wiring only (path -> validator -> controller)
├── middleware/    auth (JWT), validators, errorHandler, notFound
└── app.js
```
