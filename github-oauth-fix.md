# Fix GitHub Sign-In Error

## The Problem You're Experiencing

You're seeing this error when trying to sign in with GitHub:

```
Be careful!
The redirect_uri is not associated with this application.
The application might be misconfigured or could be trying to redirect you to a website you weren't expecting.
```

This happens because the GitHub OAuth app isn't properly configured to allow the callback URL that Supabase is using.

## Solution: Fix GitHub OAuth Settings

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Find your OAuth App (with client ID `Ov23liNLHGNVBS7gSlt6`) and click "Edit"
3. **Critical step:** Under "Authorization callback URL", enter EXACTLY:
   ```
   https://ilyikydpydjkfrbwencb.supabase.co/auth/v1/callback
   ```
4. Make sure there are no extra spaces, trailing slashes, or typos
5. Click "Update application"

## Solution: Fix Supabase URL Settings

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Authentication → URL Configuration
4. Set Site URL to match your deployment: `https://vyompandya.github.io/CodeSafe`
5. Add Redirect URLs:
   - `https://vyompandya.github.io/CodeSafe`
   - `https://vyompandya.github.io/CodeSafe/`
   - For local testing, also add: `http://localhost:5173` (or your dev port)
6. Save changes

## Code Changes Made

I've simplified the GitHub auth code to:
- Remove custom redirect URL handling
- Let Supabase use its default configuration

This ensures the redirect URL sent to GitHub exactly matches what's registered in your OAuth app settings.

## Verification

After updating the GitHub OAuth app and Supabase settings:
1. Deploy the updated code with `npm run deploy`
2. Try signing in with GitHub
3. The authentication should now work without the redirect error 