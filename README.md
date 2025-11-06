# Chef Claude 🍳

A smart recipe generator powered by Google's Gemini AI. Add your ingredients and let AI create delicious recipes for you!

## Features

- ✨ Add ingredients to your pantry list
- 🤖 AI-powered recipe generation using Google Gemini
- 📱 Mobile-first responsive design
- 🔒 Secure API key management (server-side proxy)
- 🎨 Clean, modern UI

## Project Structure

```
Chef-Claude/
├── src/                    # React frontend
│   ├── App.jsx            # Main app component
│   ├── header.jsx         # Header component
│   ├── main.jsx           # Main content (ingredient list + recipe)
│   ├── index.jsx          # React entry point
│   └── index.css          # Global styles
├── server/                # Express backend (API proxy)
│   ├── index.js           # Server entry point
│   ├── package.json       # Server dependencies
│   ├── .env               # Environment variables (DO NOT COMMIT!)
│   └── .env.example       # Template for .env file
└── index.html             # HTML entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Install Frontend Dependencies

```powershell
# From the project root (Chef-Claude folder)
npm install
```

### 2. Install Server Dependencies

```powershell
# Navigate to the server folder
cd server

# Install server packages
npm install

# Go back to project root
cd ..
```

### 3. Configure API Key

```powershell
# In the server folder, copy the example env file
cd server
Copy-Item .env.example .env

# Now edit server/.env and add your actual Gemini API key:
# GEMINI_API_KEY=your_actual_key_here
```

**IMPORTANT:** Never commit your `.env` file to Git! It should already be in `.gitignore`.

### 4. Run the Application

You need to run **both** the frontend and backend servers:

#### Terminal 1 - Start the Backend Server

```powershell
# From the server folder
cd server
npm start

# Or use nodemon for auto-restart during development:
npm run dev
```

You should see:
```
🍳 Chef Claude server running on http://localhost:3001
✅ CORS enabled for: http://localhost:5173
🔐 API Key status: Configured
```

#### Terminal 2 - Start the Frontend (Vite Dev Server)

```powershell
# From the project root
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 5. Open the App

Open your browser and navigate to: **http://localhost:5173**

## How to Use

1. **Add Ingredients**: Type an ingredient (e.g., "tomato") and click "Add ingredient"
2. **Build Your List**: Add as many ingredients as you have
3. **Generate Recipe**: Click "Get Recipe" and let the AI create a custom recipe
4. **Enjoy Cooking**: Follow the AI-generated recipe instructions!

## Security Notes

⚠️ **IMPORTANT:**
- This app uses a **secure server proxy** to protect your API key
- Your Gemini API key is stored in `server/.env` and **never exposed to the browser**
- Always add `.env` to `.gitignore` before committing
- Never share your API key publicly

## Troubleshooting

### "Could not connect to the recipe server"

**Solution:** Make sure the backend server is running on port 3001
```powershell
cd server
npm start
```

### "API Key not configured"

**Solution:** 
1. Check that `server/.env` exists (not just `.env.example`)
2. Open `server/.env` and verify your API key is set:
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```
3. Restart the server after adding the key

### Port 3001 already in use

**Solution:** Either kill the process using port 3001, or change the port in `server/.env`:
```
PORT=3002
```
Then update the fetch URL in `src/main.jsx` to match.

## Development

### Project Technologies

- **Frontend:** React (Vite), CSS
- **Backend:** Express.js, CORS, dotenv
- **AI:** Google Gemini API (gemini-pro model)

### Code Structure

- `src/main.jsx` - Contains all ingredient management logic and recipe generation
- `server/index.js` - Secure proxy that calls Gemini API
- `src/index.css` - Mobile-first styling with clean, modern design

### Making Changes

1. Frontend changes auto-reload (Vite HMR)
2. Server changes require restart (use `npm run dev` with nodemon for auto-restart)

## License

MIT

## Credits

Built with ❤️ using React, Vite, Express, and Google Gemini AI
