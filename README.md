# 🎵 Vibes Music App

**Live Demo:** [https://vibes-music-app-frontend.vercel.app](https://vibes-music-app-frontend.vercel.app)
**Backend API:** [https://vibes-music-api.onrender.com](https://vibes-music-api.onrender.com)

**Vibes Music App** is a premium, full-stack music streaming platform designed to deliver a high-fidelity audio experience with a modern, glassmorphism-inspired UI. Built on the **PERN stack** (PostgreSQL, Express, React, Node.js), it features valid real-time audio playback, podcast streaming, and dynamic content discovery.

![Vibes Music App Banner](https://images.unsplash.com/photo-1619983081563-430f63602796?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Key Features

### 🎧 Immersive Audio Experience
-   **High-Quality Streaming**: Gapless playback of verified, high-bitrate audio tracks.
-   **Custom Audio Player**: Feature-rich player with play/pause, next/prev, shuffle, repeat, logging, and volume controls.
-   **Waveform Visualizer**: Dynamic audio visualization that reacts to the music.

### 🎙️ Podcasts & Shows
-   **Dedicated Podcast Hub**: Browse and stream podcasts across categories like Technology, Wellness, and Comedy.
-   **Episode Management**: View and play individual episodes with descriptions and duration.

### 🔍 Discovery & Curation
-   **Trending Now**: Algorithmic "Trending" section showcasing the hottest tracks.
-   **Genre Filters**: One-click filtering for Pop, Rock, Electronic, Hip-Hop, and specialized genres like K-Pop and Lo-Fi.
-   **Smart Search**: Real-time search for tracks, artists, and podcasts.

### 📚 Personal Library
-   **Favorites**: "Like" songs to save them to your personal collection.
-   **Recently Played**: Automatic tracking of your listening history.
-   **Playlists**: Create and manage custom playlists (Coming Soon).

### 🔐 Security & tech
-   **Secure Auth**: Email/Password authentication powered by Supabase.
-   **Responsive Design**: Fully responsive layout optimized for Desktop, Tablet, and Mobile.
-   **Glassmorphism UI**: Modern aesthetic with blur effects, gradients, and smooth Framer Motion animations.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | Component-based UI library |
| | **Tailwind CSS** | Utility-first styling framework |
| | **Framer Motion** | Production-ready animation library |
| | **Lucide React** | Beautiful, consistent iconography |
| **Backend** | **Node.js** | JavaScript runtime environment |
| | **Express.js** | Fast, unopinionated web framework |
| **Database** | **PostgreSQL** | Relational database (via Supabase) |
| **Storage** | **Supabase Storage** | For asset and media management |
| **Deployment** | **Vercel** | Frontend hosting |
| | **Render** | Backend API hosting |

---

## 📂 Project Structure

A clean, organized codebase following separation of concerns.

```bash
VibesMusicApp/
├── frontend/                   # React Client Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI Components (Player, Cards, Sidebar)
│   │   ├── pages/              # Main Route Pages (Home, Podcasts, Library)
│   │   ├── context/            # React Context (AuthContext, PlayerContext)
│   │   ├── config/             # Configuration & Constants (API URLs)
│   │   ├── lib/                # Third-party library clients (Supabase)
│   │   └── assets/             # Images and local media
│   ├── index.css               # Global styles & Tailwind directives
│   └── App.jsx                 # Main Application Component
│
├── backend/                    # Node.js Express API
│   ├── config/                 # Database & Env Configuration
│   ├── controllers/            # Route Logic & Request Handlers
│   ├── routes/                 # API Endpoint Definitions
│   ├── db/                     # Database Schemas, Migrations & Seeds
│   │   ├── final_prod_seed.sql # MASTER SEED FILE (Use this!)
│   │   └── schema.sql          # Base database structure
│   └── server.js               # Express Server Entry Point
```

---

## 🚀 Installation & Setup

### Prerequisites
-   Node.js (v18 or higher)
-   npm (Node Package Manager)
-   A Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/Anil2995/VibesMusicApp.git
cd VibesMusicApp
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_for_seeding
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Start the client:
```bash
npm run dev
```

---

## 💽 Database Initialization (Critical Step)

To ensure the application has valid data with **working audio links**, you must seed the database.

1.  Go to your **Supabase Dashboard**.
2.  Open the **SQL Editor**.
3.  Copy the content of **`backend/db/final_prod_seed.sql`**.
4.  Paste and **Run** the script.

✅ This will populate your app with trending songs, podcasts, and episodes that are guaranteed to play.

---

## 🤝 Contributing

We welcome contributions!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
