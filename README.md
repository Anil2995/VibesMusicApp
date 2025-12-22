# Music App (Vibes)

Full-stack music and podcast streaming application.

## Prerequisites
- Node.js installed.
- Supabase account (for database & auth).

## Getting Started

### 1. Backend Setup
The backend is located in the `backend` folder.
```bash
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:5000`.

### 2. Frontend Setup
The frontend is located in the `frontend` folder.
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`.

### 3. Supabase Setup (Required for Day 2)
1. Go to [Supabase](https://supabase.com/).
2. Create a new project.
3. Copy the `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. Create a `.env` file in the `frontend` folder and add:
   ```
   VITE_SUPABASE_URL=your_url_here
   VITE_SUPABASE_ANON_KEY=your_key_here
   ```

## Project Structure
- `frontend/`: React + Vite application.
- `backend/`: Node.js + Express API.
- `IMPLEMENTATION_PLAN.md`: Daily progress guide.

## Daily Progress
- **Day 1**: Project Setup (Done).
- **Day 2**: Auth & DB (Next).
