# Chef Claude 🍳

AI-powered recipe assistant with Supabase auth, Gemini-generated recipes, YouTube cook-alongs, and a Shorts-style Discover feed.

## Highlights

- ✨ Ingredient list → 🤖 Gemini AI recipes
- ▶️ Cook page: YouTube tutorial auto-matched to your recipe
- 📺 Discover: vertical scrolling food shorts feed
- 🔐 Email/password auth (Supabase) with protected routes
- 📱 Mobile-first, hamburger navigation with click-outside to close
- 👁️ Password visibility toggle on Login/Sign Up
- 🔑 API keys kept server-side via Express proxy

## Project Structure

```
Chef-Claude/
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── supabaseClient.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Main.jsx        # Generate (ingredients + recipe)
│   │   ├── Cook.jsx        # YouTube video for current recipe
│   │   ├── Discover.jsx    # Shorts-style feed
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   └── ProtectedRoute.jsx
├── server/
│   ├── index.js            # Express API proxy (Gemini + YouTube)
│   └── package.json
└── .env.local              # Frontend env (not committed)
```

## Setup

### 1) Backend env (server/.env)

Create `server/.env` with:

```
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key   # optional (Cook/Discover)
PORT=3001
# After deploying frontend, set this to your site URL for CORS
FRONTEND_URL=https://your-frontend.example.com
```

### 2) Frontend env (.env.local)

Create `.env.local` at project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Local dev backend URL; in production set this in your hosting env
VITE_API_URL=http://localhost:3001
```

### 3) Install & Run (local)

```powershell
# From project root
npm install

# Backend
cd server; npm install; npm start

# New terminal - Frontend
cd ..; npm run dev
```

Open http://localhost:5173

## Authentication (Supabase)

- Routes: `/login`, `/signup`
- Protected pages: `/`, `/cook`, `/discover` (wrapped in `ProtectedRoute`)
- Email verification may be required depending on your Supabase settings
- Required frontend env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Pages

- Generate (Home): add ingredients, get AI recipe
- Cook: auto-searches YouTube for your recipe tutorial
- Discover: vertical feed of short food videos (YouTube Data API)

## Deployment (summary)

Deploy backend first, then frontend.

1) Backend (Render recommended)

- Root Directory: `server`
- Build Command: `npm install` (a `build` script isn’t required for Node server)
- Start Command: `npm start`
- Env vars: `GEMINI_API_KEY`, `YOUTUBE_API_KEY`, `PORT`, `FRONTEND_URL`, `NODE_ENV=production`
- After deploy, note your backend URL, e.g. `https://chef-claude-server.onrender.com`

2) Frontend (Vercel/Netlify)

- Set env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` = your backend URL from step 1
- Build command: `npm run build`
- Output dir: `dist`

3) CORS

- Add your deployed frontend URL to the backend env as `FRONTEND_URL`
- Redeploy backend

## Health & Smoke Tests

- Backend health: `GET /health` → `{ status: 'ok' }`
- Recipe generate: `POST /api/generate` with `{ ingredients: ["egg","rice"] }`
- YouTube search (Cook): `POST /api/youtube-search`
- YouTube discover: `POST /api/youtube-discover`

## Troubleshooting

- Blank page after deploy → Set frontend envs (especially `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), and ensure `VITE_API_URL` points to deployed backend; redeploy.
- `supabaseUrl is required` → Frontend envs missing on hosting platform.
- "Could not connect to the recipe server" → Backend not reachable; deploy backend and set `VITE_API_URL` in frontend.
- CORS errors → Set `FRONTEND_URL` on backend to your deployed frontend, then redeploy backend.
- Invalid login credentials → Confirm user exists and email is verified in Supabase Dashboard → Authentication → Users.


Built with ❤️ using React, Vite, Express, Supabase, Google Gemini, and YouTube Data API.
