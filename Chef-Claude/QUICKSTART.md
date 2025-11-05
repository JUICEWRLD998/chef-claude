# 🚀 Quick Start Guide - Chef Claude

## STEP 1: Add Your Gemini API Key

1. Open the file: `Chef-Claude/server/.env`
2. Replace the empty value with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_key_here
   PORT=3001
   ```
3. Save the file

**Get your API key here:** https://makersuite.google.com/app/apikey

---

## STEP 2: Start the Backend Server

Open **PowerShell Terminal #1** and run:

```powershell
cd C:\Users\fadhm\OneDrive\Desktop\Chef-claude\Chef-Claude\server
npm start
```

✅ You should see:
```
🍳 Chef Claude server running on http://localhost:3001
✅ CORS enabled for: http://localhost:5173
🔐 API Key status: Configured
```

**Keep this terminal running!**

---

## STEP 3: Start the Frontend (Vite)

Open **PowerShell Terminal #2** (new terminal) and run:

```powershell
cd C:\Users\fadhm\OneDrive\Desktop\Chef-claude\Chef-Claude
npm run dev
```

✅ You should see:
```
VITE ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## STEP 4: Open the App

Open your browser and go to: **http://localhost:5173**

---

## How to Use the App

1. **Add ingredients** - Type "tomato" and click "Add ingredient"
2. **Build your list** - Add more ingredients (rice, chicken, etc.)
3. **Get recipe** - Click "Get Recipe" button
4. **Wait for AI** - The AI will generate a custom recipe
5. **Cook & enjoy!** 🍳

---

## Troubleshooting

### ❌ "Could not connect to the recipe server"
**Fix:** Make sure Terminal #1 (backend server) is running on port 3001

### ❌ "API Key not configured"
**Fix:** 
1. Check `server/.env` exists (not just `.env.example`)
2. Verify your API key is set correctly
3. Restart the server (Terminal #1)

### ❌ Port already in use
**Fix:** Kill the process or change port in `server/.env`

---

## Files You Created

✅ `src/main.jsx` - Main component with ingredient & recipe logic  
✅ `server/index.js` - Secure Express server proxy  
✅ `server/.env` - Your API key (NEVER commit this!)  
✅ `src/index.css` - Complete styling  
✅ `README.md` - Full documentation  

---

**🎉 You're all set! Happy cooking with Chef Claude!**
