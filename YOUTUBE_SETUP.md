# YouTube API Setup Guide

To enable the Cook page feature (which shows YouTube cooking tutorials), you need to set up a YouTube Data API key.

## Steps to Get Your YouTube API Key:

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create a New Project (or select existing)
- Click "Select a project" at the top
- Click "New Project"
- Name it "Chef Claude" or anything you like
- Click "Create"

### 3. Enable YouTube Data API v3
- In the search bar at the top, search for "YouTube Data API v3"
- Click on "YouTube Data API v3"
- Click the blue "ENABLE" button

### 4. Create API Credentials
- In the left sidebar, click "Credentials"
- Click "+ CREATE CREDENTIALS" at the top
- Select "API key"
- Your new API key will be displayed - **COPY IT**

### 5. (Optional but Recommended) Restrict Your API Key
- Click on your newly created API key to edit it
- Under "API restrictions", select "Restrict key"
- Check only "YouTube Data API v3"
- Click "Save"

### 6. Add the Key to Your .env File
Open `server/.env` and add:
```bash
YOUTUBE_API_KEY=YOUR_COPIED_API_KEY_HERE
```

### 7. Restart Your Server
Stop the server (Ctrl+C) and run `npm run dev` again to load the new environment variable.

## API Quota Information

- YouTube Data API v3 has a **free daily quota of 10,000 units**
- Each search request costs **100 units**
- This means you get **100 free video searches per day**
- This should be more than enough for development and personal use

## Testing

1. Generate a recipe on the Generate page
2. Click "Cook" in the navigation
3. You should see a YouTube video tutorial for that recipe!

## Troubleshooting

**Error: "YouTube API key not configured"**
- Make sure you added `YOUTUBE_API_KEY` to `server/.env`
- Restart the server after adding the key

**Error: "No cooking videos found"**
- This is normal for some very unusual recipes
- Try generating a more common recipe

**Error: "Quota exceeded"**
- You've used all 10,000 daily units (100 searches)
- Wait until tomorrow for the quota to reset
- Or upgrade to a paid plan if needed (unlikely for personal use)

## Security Note

🔐 **NEVER commit your .env file to Git!**
- Keep your API keys secret
- The .env file is already in .gitignore
- Only share .env.example (which has placeholder values)
