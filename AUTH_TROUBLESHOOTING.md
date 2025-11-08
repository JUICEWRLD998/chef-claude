# 🔧 Supabase Authentication Troubleshooting

## "Invalid Credentials" Error - How to Fix

### Step 1: Check Your Supabase Dashboard

1. **Go to:** https://supabase.com/dashboard
2. **Log in** to your Supabase account
3. **Select** your Chef Claude project
4. Click **Authentication** → **Users** in the left sidebar

### Step 2: Verify Your User Account

You should see your registered user(s) in the list. Check the following:

#### ✅ Account Status:
- **✓ Confirmed** = Account is ready to use → You can log in
- **✗ Unconfirmed** = Email not verified → **Check your email for verification link**

#### 📧 Email Address:
- Make sure you're logging in with the **exact same email** you used to sign up
- Email addresses are case-sensitive in some systems
- Check for typos (extra spaces, wrong domain, etc.)

### Step 3: Common Issues & Solutions

#### Issue 1: Email Not Confirmed
**Symptom:** "Invalid credentials" or "Email not confirmed"

**Solution:**
1. Check your email inbox (including spam/junk folder)
2. Look for an email from Supabase with subject "Confirm your signup"
3. Click the confirmation link
4. Try logging in again

**If you didn't receive the confirmation email:**
- In Supabase Dashboard → Authentication → Users
- Find your user and click the "..." menu
- Select "Send email confirmation"

#### Issue 2: Wrong Password
**Symptom:** "Invalid login credentials"

**Solution:**
- Double-check your password (it's case-sensitive)
- Try typing it slowly to avoid mistakes
- If you forgot it, see "Password Reset" section below

#### Issue 3: Account Doesn't Exist
**Symptom:** "Invalid login credentials" and you don't see your email in the Users list

**Solution:**
- Sign up again at `/signup`
- Make sure you're using the correct Supabase project
- Check that your `.env.local` has the right credentials

#### Issue 4: Email Confirmation Disabled
If you want to **skip email confirmation for testing:**

1. Go to Supabase Dashboard
2. Click **Authentication** → **Settings**
3. Scroll to **User Signups** section
4. **Uncheck** "Enable email confirmations"
5. Click **Save**
6. Sign up again with a new test account

### Step 4: Reset Everything (Fresh Start)

If nothing works, start fresh:

1. **Delete existing users** (in Supabase Dashboard → Authentication → Users)
2. **Clear browser data:**
   - Open DevTools (F12)
   - Go to Application tab
   - Clear "Local Storage" and "Session Storage"
   - Close browser and reopen
3. **Sign up again** with a fresh account
4. **Check email** for confirmation (if enabled)
5. **Log in** with the new credentials

---

## How to View Your User Details in Supabase

### Method 1: Dashboard UI
1. Supabase Dashboard → Authentication → Users
2. You'll see:
   - Email addresses
   - User IDs
   - Last sign-in time
   - Confirmation status
   - Created date

### Method 2: SQL Editor (Advanced)
1. Supabase Dashboard → SQL Editor
2. Run this query:
```sql
SELECT 
  email, 
  confirmed_at, 
  created_at, 
  last_sign_in_at
FROM auth.users;
```

---

## Password Reset (Feature Not Yet Implemented)

Currently, the app doesn't have a password reset feature. To reset a password:

### Option A: Supabase Dashboard
1. Go to Authentication → Users
2. Find the user
3. Click "..." menu → "Reset password"
4. User will receive a password reset email

### Option B: Delete and Recreate
1. Delete the user in Supabase Dashboard
2. Sign up again with the same email

---

## Enable Browser Console Logs

The updated Login component now logs detailed information. To see it:

1. Open your browser
2. Press **F12** to open DevTools
3. Go to the **Console** tab
4. Try logging in
5. Look for messages like:
   - "Attempting login with email: ..."
   - "Supabase auth error: ..."
   - "Login successful: ..."

This will show you the exact error from Supabase.

---

## Test with a Known Good Account

Create a test account to verify everything works:

1. Go to `/signup`
2. Use a simple test account:
   - Email: `test@example.com`
   - Password: `test123456`
3. If email confirmation is enabled, check email
4. Log in with those exact credentials
5. If this works, the issue was with your previous credentials

---

## Still Having Issues?

### Check These:
- ✅ `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- ✅ Dev server was restarted after adding credentials
- ✅ Supabase project is active (not paused)
- ✅ Using the correct email (check for typos)
- ✅ Password is at least 6 characters

### Get Help:
1. Check browser console (F12) for errors
2. Check Supabase Dashboard → Logs for authentication events
3. Supabase Discord: https://discord.supabase.com
4. Supabase Docs: https://supabase.com/docs/guides/auth

---

## Quick Checklist

Before logging in, verify:

- [ ] I created an account at `/signup`
- [ ] I confirmed my email (if email confirmation is enabled)
- [ ] I can see my user in Supabase Dashboard → Authentication → Users
- [ ] My user status is "confirmed" (not "unconfirmed")
- [ ] I'm using the exact same email I signed up with
- [ ] My password is correct (case-sensitive)
- [ ] My `.env.local` file has the correct Supabase credentials
- [ ] I restarted the dev server after adding credentials

If all checks pass and it still doesn't work, clear browser cache and try again!
