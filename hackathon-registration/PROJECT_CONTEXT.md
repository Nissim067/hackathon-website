# 🧭 Project Overview

**Project Name:** Hackathon Registration System
**Purpose:** A modern, visually impressive web application specifically designed to handle registrations, team formations, and general workflows for the upcoming "AIML Hackathon 2026."
**Core Problem Solved:** It eliminates administrative friction in hackathon coordination by centralizing user authentication, individual and team registrations, intelligent team matching, and potentially payment handling.
**Target Users:** College students, developers, and designers seeking to participate in the hackathon, form competitive teams, or manage their entrance.

---

# 🧠 Core Concepts & Architecture

*   **System Design:** The repository employs a standard decoupled Client-Server architecture utilizing a RESTful API pattern.
    *   **Frontend:** A Single Page Application (SPA) utilizing component-based rendering and declarative UI schemas.
    *   **Backend:** A monolithic Node/Express service handling business logic, payload validation, and database operations.
    *   **Database:** A NoSQL layout structure optimizing document storage for dynamic user profiles and scalable team schemas.
*   **Authentication Flow:** Token-based stateless authentication (`JWT`) initialized upon successful login or registration, manually attached to `Authorization: Bearer <token>` headers on protected backend transactions.
*   **AI/Multi-Agent System:** *Not present in this specific codebase.* (Note: While previous conceptual repositories existed for multi-agent logic, the current repository is strictly a web registration portal. The only AI reference is a `/api/teams/suggested` endpoint theoretically meant to serve algorithm-based team matching).
*   **Plugin Architecture:** Not utilized.

---

# ⚙️ Tech Stack

**Frontend:**
*   **Language:** JavaScript (ES6+), JSX
*   **Core Framework:** React 19 / React Router DOM 7
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, PostCSS (custom Dark Mode / Glassmorphism utility design)
*   **Data Visualization/UI Plugins:** `recharts`, `canvas-confetti`

**Backend:**
*   **Language:** JavaScript (Node.js >=18)
*   **Framework:** Express.js
*   **Database Module:** MongoDB natively via Mongoose ORM
*   **Security & Auth:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS
*   **Configuration Management:** `dotenv`

---

# 📂 Codebase Structure

```text
/hackathon-registration
│
├── /frontend               # React Single Page Application
│   ├── /src
│   │   ├── /components     # Reusable UI parts (Navbar, TeamSuggestions, PaymentButton)
│   │   ├── /pages          # Route-level views (Home, Register, Login, Teams, Admin)
│   │   ├── /services       # API integration utilities (e.g., api.js)
│   │   ├── /utils          # JS helper utilities
│   │   ├── /hooks          # Custom React hooks (useDarkMode, useForm)
│   │   ├── App.jsx         # App container & theme provider
│   │   ├── main.jsx        # React root injector
│   │   └── routes.jsx      # React Router declarations mapping paths to Pages
│   ├── tailwind.config.js  # Styling variables and neon-accent definitions
│   └── vite.config.js      # Bundling configs, dev server proxy (/api -> :5000)
│
└── /backend                # Express/Node API Server
    ├── /src
    │   ├── /config         # Database (db.js) & Razorpay environment configs
    │   ├── /controllers    # Core execution logic for endpoints (auth, registration)
    │   ├── /middleware     # JWT verification blocks and Error handlers
    │   ├── /models         # Mongoose DB Schemas (User.js, Team.js)
    │   ├── /routes         # API endpoint definitions routing payloads to Controllers
    │   ├── /utils          # Server helpers (generateTeamCode.js)
    │   ├── app.js          # Express app initialization and global middleware
    │   └── server.js       # Node entry point binding DB and listening on PORT
    └── .env.example        # Environment variable schema
```

---

# 🔗 Key Workflows

**1. Participant Registration Flow:**
*   **Client:** User visits `/register` and fills a 3-step form (Personal -> College -> Skills).
*   **Submission:** React fires a `POST` request mapped to `/api/register`.
*   **Execution:** `registrationController.js` validates all parameters.
*   **Team vs Solo logic:** 
    *   If solo -> Instantiates user profile mapping.
    *   If team-create -> Generates unique Code -> Creates Team mapping -> Maps user pointer to Team.
    *   If team-join -> Verifies valid Code -> Maps user to Team -> Appends User reference block to Team payload.
*   **Response:** JWT generated (handled typically out of auth bounds currently) and the user triggers `onSuccess`.

**2. Team Discovery Flow:**
*   **Client:** Navigates to `/teams`. React requests `/api/teams`.
*   *(Optional)* Fetches AI suggested teams from `/api/teams/suggested`.
*   **Render:** Iterates `OpenTeamCard` dynamically updating available slots.

---

# 🤖 AI / Agent System

**Assumption explicit disclaimer:** There is no structural multi-agent or LLM orchestration logic currently written inside `/frontend` or `/backend` directories of this project domain. 

The scope here is strictly data handling for the hackathon event mapping. If agents are intended to connect to this API portal remotely, they must hit local port `:5000` via standard structured `JSON` payload inputs.

---

# 🔑 Environment & Configuration

**Required `.env` (Backend):**
```env
PORT=5000
MONGO_URI=<Your-MongoDB-Connection-String>
JWT_SECRET=<Random-Secure-String>
```

**Required `.env` (Frontend):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Assumptions:**
*   Vite acts as a proxy for the backend in dev mode (`localhost:5173` -> `localhost:5000/api`).
*   MongoDB deployment utilizes MongoDB Atlas or a local Daemon accessible via connection string.

---

# 🚨 Known Issues & Limitations

*   **Mock Payment Implementation:** Features referencing `paymentController.js` logic and Razorpay SDK inside UI (`PaymentButton.jsx`) currently do not have backend logic mapping transactions. DB property `paymentStatus: 'pending'` is manually mocked.
*   **Passwordless Security Risk:** Core registration implementation does not enforce hashing a user password. Authentication bypass currently mimics validity strictly through matching an existing `email` domain. Needs strict `bcryptjs` updates.
*   **Blank Admin Dashboard:** The `/admin` route on the frontend is an empty placeholder without restricted layout guards or query parameters.

---

# 📏 Coding Standards & Conventions

*   **Case Type:** `camelCase` for variable definitions and `PascalCase` for React components and MongoDB Models (`User.js`, `Team.js`).
*   **File Organization:** Highly categorized REST methodology. Do not mix database schemas into controller logical units.
*   **Design Pattern (Frontend):** Pure functional component architecture with standard generic React Hooks avoiding Class definitions. Tailwind variables define global spacing metrics.

---

# 🎯 What the AI Should Do

*   **Feature Building:** Extend empty `paymentController.js` transactions into Razorpay logic. Complete the `Admin.jsx` dashboard mapping.
*   **Refactoring Code:** Consolidate redundant hooks or unify state logic utilizing context architectures if forms become unmanageable.
*   **What To Avoid:** 
    *   **Do not change the fundamental architecture:** Retain the client-server monolithic separation map.
    *   **Do not force multi-agent code here:** Do not install Agent architectures (like `langchain` or `autogen`) unless explicitly directed by the User. Keep it isolated to Web Portal capabilities.

---

# ❗ Important Constraints

*   DO NOT replace standard Express workflows with unknown web-framework configurations (e.g. Next.js).
*   Avoid importing heavy client-side libraries unless standard CSS or lightweight libraries fail.
*   Respect the Dark Mode visual standard currently dictated natively in Tailwind templates globally avoiding aggressive `bg-white` structural overwrites.

---

# 🚀 Future Scope

*   **Complete Security Implementation:** Standardize registration to compel JWT tokenization based on passwords hashed properly with active session invalidation limits.
*   **Admin Dashboard Population:** Hook specific `Admin` user types logic ensuring restricted control queries returning all team modifications or payment logs.
*   **AI Matchmaking Matrix:** Properly construct Python/Agent-based microservices to act on the generated DB matching user skills logically with optimal remote teams via an automated cron sync logic.
