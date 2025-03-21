# GitHub OAuth Setup Guide for GitHub Pages

## Complete Setup Guide

1. Go to GitHub Developer Settings (https://github.com/settings/developers) and create a new OAuth App.
2. Set the **Homepage URL** to `https://vyompandya.github.io/CodeSafe`
3. Set the **Authorization callback URL** to: `https://ilyikydpydjkfrbwencb.supabase.co/auth/v1/callback`
4. Get the Client ID and Client Secret from GitHub.

5. Go to your Supabase Dashboard > Authentication > Providers.
6. Enable GitHub provider and enter your Client ID and Client Secret.

7. In Supabase Dashboard, go to Authentication > URL Configuration
8. Set your Site URL to `https://vyompandya.github.io/CodeSafe`
9. Under Redirect URLs, add BOTH of these URLs:
   - `https://vyompandya.github.io/CodeSafe`
   - `https://vyompandya.github.io`
10. Make sure to save these changes

## Advanced Troubleshooting

If you're still experiencing 404 errors after GitHub authentication:

1. Check your browser console for any errors during the redirect process
2. Verify in Supabase logs that the authentication is successful but the redirect is failing
3. Try these alternative approaches:

**Option 1: Update GitHub OAuth App Settings**
- Add multiple callback URLs in your GitHub OAuth app settings
- Include both `https://ilyikydpydjkfrbwencb.supabase.co/auth/v1/callback` and `https://vyompandya.github.io/CodeSafe`

**Option 2: Use HashRouter for GitHub Pages**
If you're using React Router, consider switching to HashRouter which works better with GitHub Pages:
```jsx
import { HashRouter } from 'react-router-dom';

// In your main.jsx/tsx
<HashRouter>
  <App />
</HashRouter>
```

**Option 3: Set Up a Custom Domain**
GitHub Pages with custom domains tend to work better with OAuth redirects:
1. Set up a custom domain for your GitHub Pages site
2. Update all OAuth and Supabase configurations to use this domain

## Testing Locally

When testing locally:
1. Add `http://localhost:3000` (or your development port) to Supabase redirect URLs
2. The updated code will automatically detect local vs production environments 