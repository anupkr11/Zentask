# ZenTask — Task Management System
A full-stack productivity platform to create, manage, and track tasks with a Kanban-style board, priority filters, and a real-time workspace health dashboard.
**Live Demo:** https://zentask-kappa.vercel.app/login  &nbsp;|&nbsp; **API:** https://zentask-backend-618a.onrender.com/
---
## Screenshots
> Login Page | Dashboard (Dark Mode) | Dashboard (Light Mode)
---
## Features
- **JWT Authentication** — Secure register & login with hashed passwords
- **Task CRUD** — Create, read, update, and delete tasks
- **Kanban Board** — Drag-and-drop tasks across Pending → In Progress → Completed columns
- **Filters & Search** — Filter tasks by status, priority, and keyword search
- **Workspace Health Sidebar** — SVG progress ring showing completion percentage and priority breakdown
- **Dark / Light Mode** — Theme toggle with `localStorage` persistence
- **Protected Routes** — Unauthenticated users are redirected to login
- **Custom 404 Page** — Friendly error page for invalid routes
---
## Tech Stack
### Frontend
 React.js (Vite) 
|
 UI framework 
|
|
 Tailwind CSS v4 
|
 Styling 
|
|
 React Router v6 
|
 Client-side routing 
|
|
 Axios 
|
 HTTP requests 
|
|
 React Context API 
|
 Global auth state 
|
### Backend
 Node.js + Express.js 
|
 REST API server 
|
|
 MongoDB Atlas + Mongoose 
|
 Database & ODM 
|
|
 JSON Web Token (JWT) 
|
 Authentication 
|
|
 bcryptjs 
|
 Password hashing 
|
|
 dotenv 
|
 Environment config 
|
### Deployment

 Vercel 
|
 Frontend hosting 
|
|
 Render 
|
 Backend hosting 
|
|
 MongoDB Atlas 
|
 Cloud database 
|
---
## Project Structure
```
AB_Task/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Get profile
│   │   └── taskController.js      # CRUD task operations
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT token verification
│   │   └── errorMiddleware.js     # Global error handler
│   ├── models/
│   │   ├── User.js                # User Mongoose schema
│   │   └── Task.js                # Task Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth routes
│   │   └── taskRoutes.js          # /api/tasks routes
│   ├── .env                       # Environment variables (not committed)
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── check-square.svg       # Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Top navigation + theme toggle
│   │   │   ├── TaskBoard.jsx      # Kanban drag-and-drop board
│   │   │   ├── TaskCard.jsx       # Individual task card
│   │   │   ├── TaskForm.jsx       # Create / edit task modal
│   │   │   └── TaskStats.jsx      # Workspace health sidebar
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state + API_URL
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── NotFound.jsx       # Custom 404 page
│   │   ├── App.jsx                # Routes & protected route wrapper
│   │   ├── main.jsx
│   │   └── index.css              # Tailwind + custom theme
│   ├── vercel.json                # SPA routing fix for Vercel
│   └── index.html
│
├── ZenTask.postman_collection.json
└── AI_USAGE_REPORT.md
```
---
## API Endpoints
Base URL: `https://zentask-backend-618a.onrender.com/api`
### Auth Routes — `/api/auth`

`POST`
|
`/auth/register`
|
 Public 
|
 Register a new user 
|
|
`POST`
|
`/auth/login`
|
 Public 
|
 Login and receive JWT token 
|
|
`GET`
|
`/auth/me`
|
 🔒 Private 
|
 Get authenticated user profile 
|
### Task Routes — `/api/tasks`

`GET`
|
`/tasks`
|
 🔒 Private 
|
 Get all tasks (supports 
`?search=`
, 
`?status=`
, 
`?priority=`
) 
|
|
`POST`
|
`/tasks`
|
 🔒 Private 
|
 Create a new task 
|
|
`GET`
|
`/tasks/:id`
|
 🔒 Private 
|
 Get a task by ID 
|
|
`PUT`
|
`/tasks/:id`
|
 🔒 Private 
|
 Update a task 
|
|
`DELETE`
|
`/tasks/:id`
|
 🔒 Private 
|
 Delete a task 
|
> All private routes require `Authorization: Bearer <token>` header.
---
## Getting Started (Local Development)
### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
### 1. Clone the repository
```bash
git clone https://github.com/your-username/zentask.git
cd zentask
```
### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev       # with nodemon (development)
# or
npm start         # production
```
### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
The app will be running at `http://localhost:5173`
---
## Environment Variables
### Backend (`backend/.env`)

`PORT`
|
 Server port (default: 5000) 
|
|
`MONGODB_URI`
|
 MongoDB Atlas connection string 
|
|
`JWT_SECRET`
|
 Secret key for signing JWT tokens 
|
|
`NODE_ENV`
|
`development`
 or 
`production`
|
---
## Postman Collection
A complete Postman collection is included at the root of this project:
📁 `ZenTask.postman_collection.json`
**Import steps:**
1. Open Postman → Click **Import**
2. Drag in `ZenTask.postman_collection.json`
3. Run **Login User** first — the token is automatically saved to collection variables
4. All other protected requests will use `{{token}}` automatically
---
## Deployment
### Frontend → Vercel
The `vercel.json` file at `frontend/vercel.json` handles SPA routing so React Router works correctly on direct URL access:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
### Backend → Render
Deploy the `backend/` folder as a **Web Service** on Render. Set environment variables in the Render dashboard under **Environment**.
> ⚠️ Render free tier spins down after inactivity. First request may take ~30 seconds to wake up.
---
## License
This project is for educational purposes as part of a Full-Stack Application Development assignment.
