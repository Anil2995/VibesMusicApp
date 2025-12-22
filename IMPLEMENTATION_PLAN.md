# Music App - Implementation Plan

## Project Overview
**Goal:** Build a full-stack music and podcast streaming web application (Spotify Lite clone).
**Timeline:** 2 Weeks (Target completion: Jan 4).
**Tech Stack:**
- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)

---

## Week 1: Foundation & Core Features

### Day 1: Project Setup & Architecture (Today)
- [x] Create Project Structure (`frontend` and `backend` folders).
- [x] **Backend:** Initialize Node.js, install Express, set up basic server.
- [x] **Frontend:** Initialize React with Vite, install Tailwind CSS.
- [x] **Git:** Initialize repository.

### Day 2: Authentication & Database Schema
- [x] **Database:** Set up Supabase project. (Keys Configured)
- [x] **Schema:** Design tables for Users, Tracks, Playlists. (Created `backend/db/schema.sql`)
- [x] **Auth:** Implement Login/Signup in Frontend & Backend. (Frontend implemented)

### Day 3: Backend API - Music Data
- [x] Create specific endpoints for fetching tracks/genres. (Implemented in `backend/controllers/trackController.js`)
- [x] Integrate with Database to serve mock/real data. (Connected to Supabase)

### Day 4: Frontend - Music Listing
- [x] Build Home Page UI. (Beautiful hero section, navigation, and track grid)
- [x] Display list of tracks and genres fetched from API. (TrackCard component with genres)

### Day 5: Music Player (Core Feature)
- [ ] Implement Audio Player component (Play, Pause, Next, Prev).
- [ ] Manage global state for current track (Context API or Zustand).

### Day 6: Podcast Module
- [ ] Podcast Listing Page.
- [ ] Podcast Detail Page with episodes.

### Day 7: UI Refinement & Responsiveness
- [ ] Improve styling (spacing, colors, glassmorphism).
- [ ] Ensure mobile responsiveness.

---

## Week 2: Advanced Features & Polish

### Day 8: Playlist Management
- [ ] Create/Edit/Delete Playlists.
- [ ] Add songs to playlists.

### Day 9: Search & Discovery
- [ ] Implement Search Bar (debounce).
- [ ] Filter by Genre/Artist.

### Day 10: User Library (Favorites)
- [ ] "Like" songs (add to Favorites).
- [ ] Saved Albums/Podcasts.

### Day 11: Admin Dashboard (Basic)
- [ ] Admin interface to upload/manage tracks.

### Day 12: Performance & Optimization
- [ ] Code splitting, lazy loading.
- [ ] Optimizing images/assets.

### Day 13: Testing & Debugging
- [ ] End-to-end testing of core flows.
- [ ] Fix bugs.

### Day 14: Final Deployment
- [ ] Deploy Frontend to Vercel/Netlify.
- [ ] Deploy Backend to Render/Railway.
