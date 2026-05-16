<div align="center">
  <!-- TODO: Replace with an actual logo or banner image -->
  <h1>👾 PixelQuest Planner</h1>
  <p><strong>A Gamified Full-Stack Productivity App</strong></p>
  <img width="1897" height="859" alt="Screenshot 2026-05-16 083755" src="https://github.com/user-attachments/assets/bec8c01b-407e-4495-972d-da64e00798f0" />

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>
</div>

## 📖 Overview

PixelQuest Planner is a full-stack, highly gamified productivity web application designed to turn your daily chores, habits, and tasks into epic quests. Built with a responsive, retro-pixel aesthetic, the app motivates users to achieve their daily goals by rewarding them with XP, leveling up their profile, and evolving their virtual pixel companion.

This project was built to demonstrate proficiency in modern **MERN stack** (MongoDB, Express, React, Node.js) development, state management, and creating engaging, dynamic user interfaces.

---

## ✨ Features

- **Gamified Task Management:** Create, track, and complete "Quests" to earn XP.
- **Dynamic Progression System:** Watch your custom pixel pet evolve as you level up and maintain your daily streak.
- **Dashboard & Analytics:** View your daily goal progress, weekly recaps, and total tasks completed.
- **Leaderboard:** Compete against friends for the most weekly XP.
- **Achievements:** Unlock special badges for hitting milestones like "7 Day Streak" or "Level 10 reached."
- **Full-Stack Architecture:** Secure, RESTful Express backend connected to a scalable MongoDB Atlas cluster.

---

## 📸 Screenshots

> **Note to Self/Recruiters:** The screenshots showcasing the retro UI and gamified features are coming soon!

<div align="center">
  <!-- Placeholders for frame pics to be added later -->
  <table>
    <tr>
      <td align="center">
        <!-- Replace this src with your actual image path later, e.g., docs/dashboard.png -->
        <img src="https://via.placeholder.com/400x250/2b2b2b/FFFFFF?text=Dashboard+Screenshot" alt="Dashboard View" width="400"/>
        <br />
        <em>The main dashboard and pixel companion</em>
      </td>
      <td align="center">
        <!-- Replace this src with your actual image path later, e.g., docs/quests.png -->
        <img src="https://via.placeholder.com/400x250/2b2b2b/FFFFFF?text=Quests+Screenshot" alt="Quests View" width="400"/>
        <br />
        <em>Managing daily quests</em>
      </td>
    </tr>
  </table>
</div>

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite):** Lightning-fast build tool and frontend framework.
- **TypeScript:** Ensuring type safety and scalable code.
- **Zustand:** Lightweight and fast global state management.
- **Tailwind CSS:** Utility-first framework used for custom pixel-art styling and responsive layouts.
- **Framer Motion:** Smooth micro-animations and page transitions.
- **TanStack Router:** Modern, type-safe routing.

### Backend
- **Node.js & Express.js:** Robust REST API to handle business logic and routing.
- **MongoDB & Mongoose:** NoSQL database for flexible data modeling of users, tasks, and quests.
- **Cors & Dotenv:** For cross-origin resource sharing and environment variable management.

---

## 🚀 Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) installed on your machine.
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB server) for the database.

### 1. Clone the repository
```bash
git clone https://github.com/Tani-2005/pixel-quest-planner.git
cd pixel-quest-planner
```

### 2. Set up the Backend
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory and add your MongoDB connection string:
```env
MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"
PORT=5000
```
Start the backend server:
```bash
npm run dev
```

### 3. Set up the Frontend
Open a new terminal window in the root of the project:
```bash
npm install
```
Create a `.env` file in the root directory to point to your local API:
```env
VITE_API_URL="http://localhost:5000"
```
Start the Vite development server:
```bash
npm run dev
```

The app will now be running on `http://localhost:8080` (or whichever port Vite assigns)!

---

## 📂 Project Structure

```text
pixel-quest-planner/
├── backend/                  # Node.js + Express API
│   ├── config/               # Database connection setup
│   ├── controllers/          # Business logic for routes
│   ├── models/               # Mongoose schemas (User, Task, Quest, etc.)
│   ├── routes/               # Express API endpoints
│   └── server.js             # Entry point for the backend
├── src/                      # React Frontend
│   ├── assets/               # Pixel art sprites and images
│   ├── components/           # Reusable UI components (HUD, Buttons, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities, API client, and Zustand store
│   └── routes/               # TanStack Router page views
└── README.md                 # Project documentation
```

---

## 💡 What I Learned

Building this application pushed my skills in bridging complex frontend UI state with backend persistent data. Some key takeaways include:
- **State Synchronization:** Managing optimistic UI updates with Zustand on the frontend while securely validating and writing data to MongoDB via Express.
- **Database Modeling:** Designing NoSQL schemas with Mongoose that support gamification mechanics (like tracking streaks and calculating XP).
- **Styling:** Creating a cohesive, unique design language using Tailwind CSS and Framer Motion, breaking away from standard corporate UI templates.

<div align="center">
  <i>If you have any questions about my code or would like to discuss my project, feel free to reach out!</i>
</div>
