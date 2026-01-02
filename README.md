# 🎵 Vibes Music App

A premium, modern music streaming application built with the PERN stack (PostgreSQL, Express, React, Node.js). Experience a seamless, high-fidelity audio environment with a sleek glassmorphism UI.

![Vibes Music App Banner](https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1200&auto=format&fit=crop&q=80)

## ✨ Features

-   **Premium UI/UX**: Glassmorphism design, fluid animations (Framer Motion), and responsive layout.
-   **Music Streaming**: High-quality audio playback with a custom player.
-   **Podcasts**: Dedicated section for podcasts with episode management.
-   **Discovery**: Trending songs, genre filters (Pop, Rock, Electronic, etc.), and search functionality.
-   **Library Management**: Liked songs, recently played tracking, and custom playlists.
-   **Authentication**: Secure user signup and login powered by Supabase.
-   **Responsive**: Fully optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

-   **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide Icons.
-   **Backend**: Node.js, Express.js.
-   **Database**: PostgreSQL (via Supabase).
-   **Deployment**: Vercel (Frontend), Render (Backend).

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   NPM
-   A Supabase project

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Anil2995/VibesMusicApp.git
    cd VibesMusicApp
    ```

2.  **Install Frontend Dependencies**
    ```bash
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies**
    ```bash
    cd ../backend
    npm install
    ```

4.  **Environment Variables**
    Create a `.env` file in `backend/` and `frontend/` with the required keys (Supabase URL, Anon Key, Service Role Key).

### Running Locally

1.  **Start Backend**
    ```bash
    cd backend
    npm run dev
    ```

2.  **Start Frontend**
    ```bash
    cd frontend
    npm run dev
    ```

## 💽 Database Seeding (Important)

This project uses a robust SQL seed script to populate the database with verified, reliable audio tracks and podcasts.

**To reset or populate your database:**
1.  Navigate to `backend/db/final_prod_seed.sql`.
2.  Copy the contents of the file.
3.  Paste and run it in your **Supabase SQL Editor**.

This ensures all "Trending Songs" and "Podcasts" are populated with guaranteed working audio.

## 📂 Project Structure

```
VibesMusicApp/
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages (Home, Library, etc.)
│   │   ├── context/    # Global state (Auth, Player)
│   │   └── ...
├── backend/            # Express Backend
│   ├── controllers/    # Route logic
│   ├── routes/         # API endpoints
│   ├── db/             # Database schemas and seeds
│   └── ...
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
