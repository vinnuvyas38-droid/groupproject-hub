# GroupProject Hub 🎓

> **A centralized MERN workspace designed for student teams to track deliverables, milestones, meeting records, and individual accountability.**

---

## 📌 Problem Statement
Student group projects routinely suffer from disorganization: task assignments, deadlines, and crucial architectural decisions get buried across disparate chat threads (WhatsApp, Discord, Slack). As deadlines approach, confusion over who is working on what often leads to duplicate work, missed commitments, and unequal contribution friction.

**GroupProject Hub** solves this by providing a unified, shared workspace with a standout differentiator: **Member Accountability Summaries**, enabling transparent visibility into each teammate's completed and outstanding commitments at a single glance.

---

## ✨ Features

- **Project Workspaces**: Create, edit, switch, and manage isolated team workspaces.
- **Member Management**: Track project peers with email collision validation per project and automatic cascade unassignment.
- **Task Management**: Prioritized tasks with Status (`To Do`, `In Progress`, `Done`), Assignee Member, and Due Date tracking with real-time Overdue indicators.
- **Meeting Notes**: Document meeting summaries, key technical decisions, and attendee records with instant keyword search.
- **Project Milestones**: Keep major project deadlines and checkpoints visible with overdue warnings.
- **Project Dashboard**: Instant snapshot of task completion ratios, pending counts, next 5 upcoming deadlines, and milestones.
- **⭐ Member Summary (Differentiating Feature)**:
  - Transparent accountability cards per student.
  - Completion progress bars with color-tiered status.
  - Outstanding commitments sorted with overdue tasks placed first in bold red styling.
  - Dedicated **Unassigned Commitments** bucket ensuring zero hidden tasks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React (Vite), React Router v7, Axios, Tailwind CSS v4, Context API |
| **Backend** | Node.js, Express.js (REST API, CommonJS), Helmet, CORS, Morgan, Express Rate Limit |
| **Database** | MongoDB Atlas / Local MongoDB via Mongoose ORM |
| **Validation** | Zod (v4) schemas on server request bodies, params, & queries; matching client-side validators |

---

## 🚀 Getting Started (Windows PowerShell)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local Community Server or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

> [!NOTE]
> If running scripts on Windows PowerShell is restricted, run:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

---

### 1. Backend Setup (`/server`)

```powershell
cd d:\STUDY_FILES\groupproject-hub\server
npm install
```

#### Configure Environment Variables:
Copy `.env.example` to `.env`:
```powershell
cp .env.example .env
```
Ensure your `server/.env` contains:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/groupproject-hub
CLIENT_URL=http://localhost:5173
```
*(Replace `MONGO_URI` with your MongoDB Atlas connection string when deploying).*

#### (Optional) Populate Sample Demo Data:
To populate the database with a complete demo capstone project with 4 members, 12 tasks (including overdue tasks), notes, and milestones:
```powershell
npm run seed
```

#### Start Backend Server:
```powershell
npm run dev
```
The server will start at `http://localhost:5000`. Test via `http://localhost:5000/api/health`.

---

### 2. Frontend Setup (`/client`)

Open a new PowerShell terminal:
```powershell
cd d:\STUDY_FILES\groupproject-hub\client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 REST API Reference

All project resources are isolated and scoped by `:projectId`.

### System
- `GET /api/health` — API health check (`{ "status": "ok" }`)

### Projects
- `GET /api/projects` — List all projects
- `POST /api/projects` — Create project
- `GET /api/projects/:projectId` — Retrieve project details
- `PUT /api/projects/:projectId` — Update project
- `DELETE /api/projects/:projectId` — Delete project (cascades to all members, tasks, notes, milestones)

### Members
- `GET /api/projects/:projectId/members` — List members
- `POST /api/projects/:projectId/members` — Add member
- `PUT /api/projects/:projectId/members/:memberId` — Update member
- `DELETE /api/projects/:projectId/members/:memberId` — Delete member (unassigns tasks & removes from notes)

### Tasks
- `GET /api/projects/:projectId/tasks` — List tasks (supports `?status=` and `?assignedTo=`)
- `POST /api/projects/:projectId/tasks` — Create task (validates member belongs to project)
- `PUT /api/projects/:projectId/tasks/:taskId` — Update task
- `DELETE /api/projects/:projectId/tasks/:taskId` — Delete task

### Meeting Notes
- `GET /api/projects/:projectId/notes` — List notes (supports `?search=` keyword filter)
- `POST /api/projects/:projectId/notes` — Create note (validates attendees belong to project)
- `PUT /api/projects/:projectId/notes/:noteId` — Update note
- `DELETE /api/projects/:projectId/notes/:noteId` — Delete note

### Milestones
- `GET /api/projects/:projectId/milestones` — List milestones (sorted by due date)
- `POST /api/projects/:projectId/milestones` — Create milestone
- `PUT /api/projects/:projectId/milestones/:milestoneId` — Update milestone
- `DELETE /api/projects/:projectId/milestones/:milestoneId` — Delete milestone

### Analytics & Differentiator
- `GET /api/projects/:projectId/dashboard` — Project KPI metrics and upcoming deadlines
- `GET /api/projects/:projectId/summary/members` — Member accountability summary & unassigned tasks

---

## 📸 Screenshots & UI Preview

| View | Description |
|---|---|
| **Dashboard** | Metric cards, overdue warning highlights, upcoming tasks & milestone deadlines |
| **Member Summary** | Accountability cards with completion rates, progress bars, overdue commitments in red |
| **Task Manager** | Dual filter controls (by Status & Assignee) and inline status dropdowns |
| **Meeting Notes** | Attendance badges and instant regex keyword search |

---

## 🌐 Production Deployment Guide

### 1. Database (MongoDB Atlas)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free Shared Cluster.
2. Under **Database Access**, create a user with Read/Write privileges.
3. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere) to permit cloud hosts to connect.
4. Click **Connect** ➔ **Drivers** (Node.js) and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/groupproject-hub?retryWrites=true&w=majority
   ```

### 2. Backend Deployment (Render)
1. Push your repository to GitHub.
2. Sign up at [Render](https://render.com/) and click **New ➔ Web Service**.
3. Connect your repository.
4. Set the following configuration:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT`: `5000` (or leave default, Render sets this automatically)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/groupproject-hub`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (your frontend production URL)
6. Click **Deploy**. Note your backend live URL (e.g. `https://groupproject-hub-api.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Sign up at [Vercel](https://vercel.com/) and click **Add New ➔ Project**.
2. Import your GitHub repository.
3. In configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://groupproject-hub-api.onrender.com/api` (your Render backend API endpoint)
5. Click **Deploy**. Your student team workspace is now live on the internet!

---

## 📄 License
Distributed under the MIT License. Developed for student project teams everywhere.

