# Task Management App

An app to manage your tasks.

## Features

- Create task
- Update task
- Delete task
- View task
- Filter tasks by title
- View comments task
- Add a comment to a task
- Update a comment
- Delete a comment
- Authentication
- Pages and routes guard
- Sign Up new user
- Login

## Tech stack

- Next.js 15
- NextAuth.js
- TailwindCSS
- shadcn
- react-hook-form
- zod
- Drizzle ORM

## Requirements to run it

- node.js >= 22.14.0
- npm >= 11.3.0
- Modern browser (Google Chrome or Mozilla Firefox)

## .env

Before running the app you need to create your _.env_ file in the root folder.

```
DATABASE_URL={postgres_SQL_db_Url}
NEXTAUTH_SECRET={provided_auth_secret}
NEXTAUTH_URL=http://localhost:3000
```

## Run it locally

Install dependencies  
` npm install`  
run dev  
`npm run dev`

## API (custom)

### Tasks

- GET /api/tasks
- POST /api/tasks
- GET /api/tasks/:taskId
- PUT /api/tasks/:taskId
- DELETE /api/tasks/:taskId

---

- GET /api/tasks/:taskId/comments
- POST /api/tasks/:taskId/comments

### Comments

- PUT /api/comments/:commentId
- DELETE /api/comments/:commentId

### Sign Up

- POST /api/signup

## Authentication

Credentials based authentication with JWT session token. _NextAuth.js_ was used to implement the auth flow.
Check _auth.config.ts_ to know more. NextAuth.js default middleware was added to protect pages and API routes (check _middleware.ts_).
