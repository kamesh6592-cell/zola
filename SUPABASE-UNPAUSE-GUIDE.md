# 🔓 How to Unpause Your Supabase Project

## Current Issue
Your Supabase project is showing as **PAUSED** in the dashboard, which is why the Google login authentication is failing with connection errors.

---

## ✅ Quick Fix: Unpause Your Project

### Method 1: Using Supabase Dashboard (Easiest)

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Find your project** in the projects list (you can see it's currently paused)
3. **Click on the project** to open it
4. **Look for the "Restore" or "Unpause" button** - usually at the top of the dashboard or in the settings
5. **Click "Restore Project"** or **"Unpause"**
6. **Wait 2-5 minutes** for the project to fully restore (you'll see services becoming "Healthy")

### Method 2: Project Settings

1. Go to: https://supabase.com/dashboard/project/ukcdooajfthgsjkrgaev
2. Click on **Settings** (gear icon on the left sidebar)
3. Go to **General** settings
4. Scroll down to find **"Pause Project"** or **"Project Status"** section
5. Click **"Restore Project"** or **"Resume Project"**
6. Confirm the action

---

## 🕐 Why Projects Get Paused

Supabase automatically pauses projects when:
- **Free tier**: No activity for 7 days
- **Payment issues**: If on paid plan and payment failed
- **Manual pause**: You paused it manually
- **Inactivity**: Extended period of no database/API activity

---

## 📊 Monitoring Restoration

After clicking restore, watch the dashboard for:

✅ **Database**: Should show "Healthy" (green)  
✅ **Auth**: Should show "Healthy" (green)  
✅ **Storage**: Should show "Healthy" (green)  
✅ **Realtime**: Should show "Healthy" (green)  
✅ **Edge Functions**: Should show "Healthy" (green)

**Restoration typically takes 2-5 minutes.**

---

## 🔧 After Project is Restored

### 1. **Test the Connection**

Run this to verify your Supabase connection:

```powershell
cd "e:\AJ STUDIOZ\zola"
npm run dev
```

Then try the Google login again.

### 2. **Check Your Environment Variables**

Make sure your `.env.local` has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ukcdooajfthgsjkrgaev.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE=your_service_role_key_here
```

Get these from: https://supabase.com/dashboard/project/ukcdooajfthgsjkrgaev/settings/api

### 3. **Configure Google OAuth**

After unpausing, you need to set up Google authentication:

1. Go to: https://supabase.com/dashboard/project/ukcdooajfthgsjkrgaev/auth/providers
2. Find **Google** provider
3. Enable it
4. Add your Google OAuth credentials:
   - **Client ID**
   - **Client Secret**
5. Set authorized redirect URLs:
   ```
   https://ukcdooajfthgsjkrgaev.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```

---

## 🔑 Getting Google OAuth Credentials

If you haven't already set up Google OAuth:

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add **Authorized redirect URIs**:
   ```
   https://ukcdooajfthgsjkrgaev.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
7. Copy the **Client ID** and **Client Secret**
8. Paste them into Supabase Auth Providers (Google)

---

## 🚨 Preventing Future Pauses

### For Free Tier:
- **Use your app at least once a week** to keep it active
- Set up a simple uptime monitor (like UptimeRobot) to ping your API weekly
- Consider upgrading to **Pro plan** ($25/month) for no auto-pausing

### For Paid Plans:
- Keep payment method up to date
- Monitor billing emails from Supabase

---

## 💡 Alternative: Local Development Without Supabase

If you want to test without Supabase authentication:

1. **Comment out Supabase auth** temporarily
2. **Use Ollama** for local AI (no auth needed):
   ```powershell
   # Install Ollama
   # Download from: https://ollama.ai/download/windows
   
   ollama pull llama3.2
   cd "e:\AJ STUDIOZ\zola"
   npm run dev
   ```
3. **Add API keys directly** to `.env.local` to use AI models without auth

---

## 📞 Need Help?

**Your Supabase Project Details:**
- **Project ID**: ukcdooajfthgsjkrgaev
- **Project Name**: zola
- **Status**: Currently PAUSED (needs restoration)
- **Dashboard**: https://supabase.com/dashboard/project/ukcdooajfthgsjkrgaev

**Common Issues After Unpausing:**
- ❌ Still getting errors? Wait 5 more minutes for full restoration
- ❌ Auth not working? Check Google OAuth setup
- ❌ Database errors? Run the database setup scripts from INSTALL.md

---

## ✅ Quick Checklist

- [ ] Go to Supabase dashboard
- [ ] Click "Restore Project" or "Unpause"
- [ ] Wait 2-5 minutes for services to become Healthy
- [ ] Verify all services show green "Healthy" status
- [ ] Test Google login again
- [ ] If needed, set up Google OAuth credentials
- [ ] Add OAuth credentials to Supabase Auth Providers

---

**Once restored, your Google login should work immediately!** 🎉
