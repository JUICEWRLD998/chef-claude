# Supabase Authentication Setup Guide

## What You Need from Supabase

Follow these steps to get your Supabase credentials and set up authentication:

### 1. Create a Supabase Account
- Go to https://supabase.com
- Click "Start your project" or "Sign Up"
- Create a free account (no credit card required)

### 2. Create a New Project
- Click "New Project"
- Choose an organization (or create one)
- Fill in:
  - **Project Name**: `chef-claude` (or any name you prefer)
  - **Database Password**: Create a strong password (save this!)
  - **Region**: Choose the closest region to you
- Click "Create new project"
- Wait 1-2 minutes for the project to be set up

### 3. Get Your Project Credentials

Once your project is ready:

#### Option A: From Project Settings
1. Go to **Project Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:

**📋 Copy these values:**
- **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
- **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

#### Option B: From the Dashboard
- The credentials are also shown on the project home page under "Project API keys"

### 4. Add Credentials to Your Project

Open the `.env.local` file in the root of your Chef-Claude project and replace the placeholder values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** 
- Replace `your_supabase_project_url_here` with your actual Project URL
- Replace `your_supabase_anon_key_here` with your actual anon key
- The anon key is safe to use in the frontend (it's public)

### 5. Configure Authentication Settings (Optional but Recommended)

In your Supabase dashboard:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Configure email settings:
   - Go to **Authentication** → **Email Templates**
   - Customize the confirmation email if you want

4. **Email Confirmation Settings:**
   - Go to **Authentication** → **Settings**
   - Under "User Signups", you can choose:
     - **Enable email confirmations**: Users must verify email (recommended)
     - **Disable email confirmations**: Users can log in immediately (for development)

### 6. Test Your Setup

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:5173/signup`

3. **Create a test account:**
   - Enter an email and password
   - If email confirmation is enabled, check your email
   - Verify and then log in

4. **Check if it worked:**
   - In Supabase dashboard, go to **Authentication** → **Users**
   - You should see your new user listed

## Important Notes

### Security
✅ The `.env.local` file is already in `.gitignore` - your keys won't be committed
✅ The `anon` key is safe for frontend use (it's public and has limited permissions)
⚠️ Never commit the `.env.local` file to version control

### Email Verification
- By default, Supabase requires email verification
- For development, you can disable this in Authentication settings
- Check your spam folder if you don't receive the confirmation email

### Row Level Security (RLS)
- Supabase has RLS enabled by default on all tables
- For now, authentication works without additional setup
- If you store user data later, you'll need to configure RLS policies

## Troubleshooting

### "Invalid API key" error
- Double-check that you copied the full anon key (it's very long)
- Make sure there are no extra spaces in the `.env.local` file
- Restart your dev server after updating `.env.local`

### Email not received
- Check spam/junk folder
- Verify email settings in Supabase dashboard
- Try disabling email confirmation for testing

### "Session expired" error
- This is normal - users just need to log in again
- Supabase sessions last 1 hour by default

## What's Been Set Up

✅ **Login page** (`/login`) - Users can log in with email/password
✅ **Sign Up page** (`/signup`) - Users can create accounts
✅ **Protected routes** - All main pages require authentication
✅ **Logout button** - In the header navigation
✅ **Auto-redirect** - Unauthenticated users are sent to login
✅ **Session management** - Supabase handles tokens automatically

## Next Steps (Optional)

Once authentication is working, you can:
- Store user-specific recipes in Supabase database
- Add password reset functionality
- Add social login (Google, GitHub, etc.)
- Customize email templates
- Add user profiles

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs/guides/auth
- Supabase Discord: https://discord.supabase.com
