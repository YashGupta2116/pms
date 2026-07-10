# Promanage: Enterprise Project Management System

An end-to-end, high-performance project management solution built with a modern TypeScript stack, featuring interactive Gantt charts, real-time board interfaces with drag-and-drop capability, granular permission/role assignments, search telemetry, and secure JWT-based authentication.

---

## Architectural Overview

Promanage is split into a decoupled Client and Server architecture designed for rapid scaling, minimal latency, and high developer velocity.

### Technology Stack
- **Frontend Core**: [Next.js 16 (App Router)](file:///Volumes/yashSSD/fullstack/project-management/client/package.json) with React 19.
- **State Management**: Redux Toolkit with RTK Query for automated server state synchronization and client-side persistence ([redux.tsx](file:///Volumes/yashSSD/fullstack/project-management/client/app/redux.tsx)).
- **UI Design System**: Tailwind CSS v4 coupled with Material UI components for seamless custom layouts and production-grade tables.
- **Backend API**: Node.js and Express running TypeScript.
- **Database Layer**: Prisma ORM targeting PostgreSQL.
- **Session Security**: JSON Web Token (JWT) with HTTP-only cookies, token rotation, and local state sync.

---

## Workspace Structure

The project repository is structured as a monorepo containing distinct frontend and backend environments:

```
project-management/
├── client/                     # Next.js frontend application
│   ├── app/                    # Next.js App Router structure
│   ├── components/             # Reusable UI component library
│   ├── state/                  # Redux slices and RTK Query client API definitions
│   └── package.json            # Client dependencies and build configurations
├── server/                     # Express.js REST API
│   ├── prisma/                 # Database schema and ORM generation configurations
│   ├── src/                    # API source code (routes, controllers, middlewares)
│   ├── ecosystem.config.cjs    # PM2 Process Manager deployment configuration
│   └── package.json            # Server dependencies and build configurations
└── README.md                   # System documentation
```

---

## Core Features

- **Dashboard Panel**: Provides real-time metrics, project completion ratios, priority counts, and dynamic charts powered by Recharts ([client/app/home/page.tsx](file:///Volumes/yashSSD/fullstack/project-management/client/app/home/page.tsx)).
- **Kanban Board**: Drag-and-drop workspace for moving tasks between statuses, utilizing React DnD.
- **Timeline View**: Visual schedule tracking via an interactive Gantt chart.
- **List and Table Views**: Fast, searchable task registries featuring MUI DataGrid for advanced filtering and sorting.
- **Telemetry and Tele-search**: Instant global search functionality querying projects, users, tasks, and teams simultaneously.
- **User and Team Administration**: Integrated leader assignments, member onboarding, and custom user role updates.
- **Secure Authentication Flow**: Secure credentials checking, protected API middleware, and automatic silent token refreshing.

---

## Database Architecture

Database models are declared in [server/prisma/schema.prisma](file:///Volumes/yashSSD/fullstack/project-management/server/prisma/schema.prisma):

| Entity Name | Description | Key Relations |
| :--- | :--- | :--- |
| `User` | Stores identity credentials, passwords (hashed), role configurations, and associations. | Authors/Assigns tasks, manages teams, owns project teams. |
| `Team` | Groups users under specific project objectives. | Belongs to multiple projects via ProjectTeam associations. |
| `Project` | Tracks parent deliverables. | Owns multiple tasks and activity logs. |
| `Task` | Represents distinct development deliverables. | Maps to assignee users, projects, comments, and attachments. |
| `ActivityLog` | Logs system activities and telemetry. | Maps to project histories. |

---

## Environment Setup

### 1. Client Environment Configuration
Create a [client/.env.local](file:///Volumes/yashSSD/fullstack/project-management/client/.env.local) file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 2. Server Environment Configuration
Create a [server/.env](file:///Volumes/yashSSD/fullstack/project-management/server/.env) file:
```env
PORT=8000
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?sslmode=require"
JWT_SECRET="your_secure_jwt_secret_key"
CLIENT_URL="http://localhost:3000"
```

---

## Deployment & Running Locally

### Development Server Execution

#### 1. Backend API Service Setup
Navigate to the server directory:
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

The database client is automatically generated using the Prisma Client generator configuration. Development servers run concurrently using Nodemon and tsc.

#### 2. Client Application Setup
Navigate to the client directory:
```bash
cd client
npm install
npm run dev
```

The client will automatically load on `http://localhost:3000`.

### Production Deployment

#### Build Pipeline
To bundle both applications for production environments:

- **Client Bundle**: Run `npm run build` in the `client` directory to generate the optimized Next.js build output.
- **Server Compile**: Run `npm run build` in the `server` directory to compile TS files to JavaScript in the `dist` directory.

#### Process Management
For node clustering and production process management, run the server using PM2 with the provided ecosystem file:
```bash
pm2 start server/ecosystem.config.cjs
```

---

## API Endpoints Registry

All routes listed below are prefixed with the base API URL (e.g. `http://localhost:8000`). Except for auth endpoints, all routes require a valid Bearer token inside the Authorization header.

### Authentication Endpoints
- `POST /auth/register` - Creates a new user profile and returns access tokens.
- `POST /auth/login` - Authenticates user credentials, sets refresh token cookies.
- `POST /auth/logout` - Revokes sessions and clears active cookie payloads.
- `POST /auth/refresh` - Generates new short-lived access tokens via valid refresh tokens.

### Project Endpoints
- `GET /projects` - Fetches all projects assigned to the user's workspace context.
- `POST /projects` - Initializes a new project entity.

### Task Endpoints
- `GET /tasks?projectId=:id` - Fetches all tasks associated with a project.
- `POST /tasks` - Registers a new task within a project.
- `PATCH /tasks/:taskId/status` - Modifies status columns.
- `POST /tasks/:taskId/comments` - Appends a text comment to a specific task.
- `POST /tasks/:taskId/attachments` - Adds file attachments.

### User & Team Endpoints
- `GET /users` - Fetches all registered platform users.
- `PATCH /users/:userId/team` - Changes user team enrollment.
- `GET /teams` - Lists all team configurations.
- `POST /teams` - Creates a new team workspace.
- `POST /teams/:teamId/join` - Enrolls the current authenticated user into a team.
- `PATCH /teams/:teamId/leadership` - Updates designated Product Owner and Project Manager user IDs.

### Search Telemetry
- `GET /search?query=:term` - Performs a multi-entity query across users, teams, projects, and tasks.

### Activity Logs
- `GET /activities` - Returns project action timelines and log history.
