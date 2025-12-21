# 🚀 Complete Deployment Guide for SavoryShelf

## STEP 1: Verify Local Setup is Working

First, ensure your app runs locally without errors:

```bash
cd C:\Users\ADMIN\Downloads\savoryshelf-main\savoryshelf-main
npm install
npm install --prefix client
npm run dev
```

**Expected Results:**
- Server running on http://localhost:5000
- Client running on http://localhost:5173
- Signup/Login working
- No console errors

---

## STEP 2: Verify GitHub Push

Ensure all latest changes are pushed to GitHub:

```bash
git status
git log --oneline -5
```

**All latest commits should show:**
1. Remove base href tag causing React hydration error #418
2. Fix build command - use npm instead of bash for cross-platform compatibility
3. And previous commits

If not, run:
```bash
git add .
git commit -m "Final deployment ready"
git push
```

---

## STEP 3: Set Up Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your **savory** project
3. Click **Settings** → **Environment Variables**
4. Add these variables:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | `mongodb+srv://rinupranitha_db_user:A5khixnkkoWQhurO@savoryshelf.eqrlf1f.mongodb.net/?appName=savoryshelf` |
| `JWT_SECRET` | `7x!A%D*G-KaPdSgVkYp3s6v9y$B&E(H+MbQeThWmZq4t7w!z%C*F)J@NcRfUjXn2r` |

5. Set both for **Production** environment
6. Click **Save**

---

## STEP 4: Verify Vercel Configuration

Your `vercel.json` should have:

```json
{
  "buildCommand": "npm install && npm install --prefix client && npm run build --prefix client",
  "outputDirectory": "client/dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api"
    },
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

---

## STEP 5: Deploy to Vercel

### Option A: Automatic Deploy (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **savory** project
3. Go to **Deployments** tab
4. Click **...** on latest deployment
5. Select **Redeploy** → **Redeploy?** → **Confirm**

Wait 3-5 minutes for build to complete.

### Option B: Manual Trigger
```bash
vercel deploy --prod
```

---

## STEP 6: Monitor Build Progress

1. Stay on Vercel Dashboard → **Deployments**
2. Click the active deployment (should show "Building...")
3. Watch logs for:
   - ✅ `npm install` completes
   - ✅ `npm install --prefix client` completes
   - ✅ `vite build` completes
   - ✅ Build ready (should show green checkmark)

**If build fails:**
- Look at the error message
- Common issues:
  - Missing environment variables (check Step 3)
  - Missing dependencies (check package.json files)
  - Invalid Node version (Vercel uses Node 18+ by default)

---

## STEP 7: Test Your Deployment

Once deployment shows ✅ Ready:

1. Go to your production URL (find in Vercel Dashboard under Production Domain)
2. Should see the SavoryShelf homepage
3. Test signup: Create a new account
   - Fill form
   - Click Signup
   - Should redirect to /home
4. Test login: Use credentials you just created
   - Should login successfully
5. Check browser console (F12) for any errors

**Expected URLs to work:**
- `https://your-domain.vercel.app/` - Home page
- `https://your-domain.vercel.app/signup` - Signup page
- `https://your-domain.vercel.app/login` - Login page
- `https://your-domain.vercel.app/home` - Home (protected)

---

## STEP 8: Verify API Connectivity

In your browser console, test the API:

```javascript
// Test auth endpoint
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
}).then(r => r.json()).then(d => console.log(d));
```

Should show either:
- ✅ Success response with token
- ⚠️ 401 Invalid credentials (if user doesn't exist)
- ❌ Error (if API connection fails)

---

## STEP 9: Monitor Production

Go to [Vercel Dashboard](https://vercel.com/dashboard) → your project:

- **Deployments**: See build history
- **Logs**: Real-time production logs
- **Analytics**: Monitor traffic and performance
- **Settings**: Manage environment variables

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails with "command not found" | Check vercel.json buildCommand syntax |
| React hydration error | Client environment config mismatch |
| 404 on API calls | Check MONGO_URI in Vercel env vars |
| Login page shows blank | Check client/.env.production exists |
| Signup fails | Check JWT_SECRET in Vercel env vars |
| Can't connect to MongoDB | Verify MONGO_URI and network access |

---

## Summary

✅ All code is committed and pushed
✅ vercel.json is configured correctly
✅ Just need to:
1. Add environment variables to Vercel
2. Redeploy from Vercel Dashboard
3. Test the production URL
