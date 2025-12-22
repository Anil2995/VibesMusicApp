# Day 3 Instructions: Backend API & Data Seeding

We have implemented the Backend API for fetching music tracks using Supabase.

## 1. Verify Prerequisites
Ensure you have completed Day 2 instructions (Created Supabase Project & Added keys to `.env` files).

## 2. Seed Mock Data
I've created a script to add some sample songs to your database so we have something to display.
1.  Open `backend/server.js` or a new terminal.
2.  Run the seed script:
    ```bash
    cd backend
    node scripts/seed.js
    ```
    *If successful, it will say "Tracks seeded successfully!".*

## 3. Test the API
1.  Start your backend server:
    ```bash
    cd backend
    npm run dev
    ```
2.  Open your browser or Postman and go to: `http://localhost:5000/api/tracks`
3.  You should see a JSON list of tracks.

## Next Steps (Day 4)
We will build the **Home Page UI** in the Frontend to display these tracks!
