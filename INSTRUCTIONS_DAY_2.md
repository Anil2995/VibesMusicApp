# Day 2 Instructions: Supabase Setup

Great progress! The code for Authentication and Database Schema design is ready. Now you need to link your Supabase project.

## 1. Create Supabase Project
1. Go to [database.new](https://database.new) and create a new project.
2. Wait for the database to be provisioned.

## 2. Execute Schema
1. Open `backend/db/schema.sql` in VS Code.
2. Copy all the content.
3. Go to your Supabase Dashboard > **SQL Editor**.
4. Paste the SQL and click **Run**.
   - This creates tables for `profiles`, `tracks`, `playlists`, etc.

## 3. Set Environment Variables
You need to connect your local app to Supabase.

### Frontend
Create a file `frontend/.env` and add:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

### Backend
Create a file `backend/.env` and add:
```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_public_key
PORT=5000
```

> You can find these keys in Supabase Dashboard > **Project Settings** > **API**.

## 4. Run the App
1. **Modules**: If you haven't already, run `npm install` in both `frontend` and `backend` folders (we handled this automatically, but good to check).
2. **Start Backend**: `cd backend` -> `npm run dev`
3. **Start Frontend**: `cd frontend` -> `npm run dev`

Test by signing up a new user!
