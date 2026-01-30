# 🐼 The Flying Panda - Visa Alert Tracker (Internal Tool)

A full-stack internal tool for tracking visa slot alerts. This project was built as a technical assessment, focusing on clean architecture, type safety, and production-ready design patterns.

---

## 🛠️ Tech Stack

| Category     | Technology                                             |
| :----------- | :----------------------------------------------------- |
| **Backend**  | Node.js, Express.js, TypeScript, Mongoose, Zod, Docker |
| **Frontend** | React, TypeScript, Vite, Redux, RTK Query              |
| **Database** | MongoDB                                                |

---

## 🚀 Setup & Installation

> **Prerequisites**: Docker, npm

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/blue0206/flying-panda-visa-tracker.git
    cd flying-panda-visa-tracker
    ```

2.  **Environment Variables (Root):**
    Create a `.env` file in the same (root) directory based on the `.env.example` file.
    Make sure to set the environment variables (MongoDB username and pass).

    ```bash
    cp .env.example .env
    ```

3.  **Environment Variables (Backend):**
    Create a `.env` file in the `backend` directory based on the `.env.example` file.
    Make sure to add the username and password you chose in Step 2 to the `DATABASE_URL`

    ```bash
    cd backend
    cp .env.example .env
    ```

4.  **Install Packages (Backend):**
    Make sure you are in root directory.

    ```bash
    cd backend
    npm install
    ```

5.  **Install Packages (Frontend):**
    Make sure you are in root directory.

    ```bash
    cd frontend
    npm install
    ```

### Fast Startup

1.  **Start using the startup script:**
    Make sure you are in root directory.

    ```bash
    chmod +x start-services.sh
    ./start-services.sh
    ```

    Press Ctrl+C to exit.

### Manual Startup

Make sure you are in root directory.

1.  **Run docker-compose:**

    ```bash
    docker-compose up -d
    ```

2.  **Run backend:**

    ```bash
    cd backend
    npm run start
    ```

3.  **Run frontend:**
    Open a new terminal session in frontend directory.

    ```bash
    npm run build
    npm run preview
    ```

### Access

- **Frontend:** `http://localhost:4173`
- **Backend API:** `http://localhost:8000/api/v1`

---

## 💡 Architectural & Design Decisions

The architecture was designed for maintainability, scalability, and type safety, reflecting modern production standards.

1.  **Decoupled Backend (Repository Pattern):**
    I abstracted away the data access (see [src/services/alert.service.ts](backend/src/services/alert.service.ts)). This allows the data source to be swapped (say, from MongoDB to PostgreSQL) with zero-changes to the controllers ([src/controllers/alert.controller.ts](backend/src/controllers/alert.controller.ts)).

2.  **Strict Type Safety & Validation (TypeScript + Zod):**
    I used **TypeScript** across the full stack. To prevent bad data from ever hitting the database, all incoming API requests (Body, Params, and Query) are validated against a strict Zod schema via a custom middleware (see [src/middlewares/validateRequest.ts](backend/src/middlewares/validateRequest.ts)). This ensures runtime safety.

3.  **Centralized Error Handling:**
    I implemented a global error handling middleware in the Express backend (see [src/middlewares/errorHandler.ts](backend/src/middlewares/errorHandler.ts)). This ensures all errors are caught and formatted into a consistent JSON response, preventing stack traces from leaking and simplifying client-side error management.

4.  **Logging with Pino:**
    Pino has been used as the logger with log levels and prettifying errors in development (see [src/core/logger.ts](backend/src/core/logger.ts)). Also attached child loggers and requestId to requests to uniquely identify logs of a particular request (see [src/middlewares/assignRequestId.ts](backend/src/middlewares/assignRequestId.ts)). Also the request events (start and end) are also logged with complete details and timestamps (see [src/middlewares/loggerMiddleware.ts](backend/src/middlewares/loggerMiddleware.ts)).

5.  **Environment Variables Validation at Startup:**
    The environment variables are validated using Zod for robustness and prevent any env related issues. See [src/core/config.ts](backend/src/core/config.ts).

6.  **Redux with RTK Query:**
    Redux is used for state management and RTK Query for data fetching in the frontend. RTK Query handles caching, invalidation, and also centralizes the API definition. See [src/app/](frontend/src/app/).

7.  **Custom API Response interface and API Error Class:**
    The API Response structure to be returned has been standardized so that a uniform and determinant response is returned to the client in case of success or failure. The `ApiError` class extends the base `Error` class to show a proper stack trace.See [src/types/api.ts](backend/src/types/api.ts).

8.  **Graceful Shutdown and Global Exception/Rejection Handlers:**
    Implemented Graceful Shutdown to ensure smooth and clean exit of server, also handling the lifespan of the resources ensuring proper cleanup. Also implemented Global Exception/Rejection handlers to catch uncaught exceptions and unhandled rejections. See [src/app.ts](backend/src/app.ts).

---

## 🔮 What I would Improve for Production

I made this project to mimic production standards (taking a few shortcuts here and there). If this were a real production system, these are some of the things I would improve:

- **Shared Types Package:** As you can see, the types that are used in both frontend and backend are hardcoded in both places. This leads to code duplication and can also lead to potential errors. Therefore, types should be shared via a shared package.

- **API Documentation:** I believe API documentation for the backend API is a must. In my own experience, it prevents us from searching through the Backend repo and for each route, check what request body/params/query is expected, what are the possible errors thrown, what response is returned.

- **Database Error Handling:** The current implementation throws a generic error for any database error other than "NOT FOUND". While the error is thrown and properly logged (hence not missing out on any critical context), it would still be a better practice to uniquely handle the common DB-related errors like "CONFLICT", "UNIQUE CONSTRAINT VIOLATION", etc.

- **Application Performance Monitoring and Error Tracking:** Use tools like Sentry for monitoring application performance, and track, manage, and correct errors in the application.

- **Web Analytics:** Use web analytics tools like Google Analytics 4 for analyzing web data to understand and optimize UX and website performance.

---

## 🤖 AI Usage

- **🤖 Where AI Helped:**
  - UI is the only thing I used AI for. I believe coming up with pretty and aesthetic designs is one thing I'm really bad at, I'm not a very artistic person. The only design I enjoy is System Design.
  - I used Google Antigravity IDE to vibe code the frontend using the prompt in [REQUIREMENTS.md](frontend/REQUIREMENTS.md).

- **🧠 Where I Had to Think:**
  - Apart from UI, every single thing—the entire backend, the docker-compose, the redux store and RTK Query api setup—is engineered by me, coded in VS Code.

---

_Made with ❤️ by [blue0206](https://github.com/blue0206)_
