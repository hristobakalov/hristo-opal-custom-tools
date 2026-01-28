# Deployment Setup Guide

## Environment Variables Required

### For generate_experiment_report Tool

The `generate_experiment_report` tool requires a Supabase API key to authenticate with the report generation service.

**Variable Name:** `SUPABASE_ANON_KEY`
**Description:** Supabase anon/public API key for the report generation service

#### How to Get the Supabase Anon Key

1. Go to your Supabase project dashboard at https://supabase.com
2. Navigate to **Settings** → **API**
3. Under "Project API keys" section, find the **anon** (or **public**) key
4. Copy this key

#### Setting Up in Netlify

1. Log into your Netlify dashboard
2. Select your deployed site
3. Go to **Site configuration** → **Environment variables**
4. Click **Add a variable** or **Add variable**
5. Add the following:
   - **Key:** `SUPABASE_ANON_KEY`
   - **Value:** [Paste your Supabase anon key here]
   - **Scopes:** All (or select specific deploy contexts if needed)
6. Click **Create variable** or **Save**
7. Redeploy your site for the changes to take effect

#### Setting Up Locally

For local development, you can either:

**Option 1: Export as environment variable**
```bash
export SUPABASE_ANON_KEY="your-supabase-anon-key-here"
```

**Option 2: Create a .env file** (don't commit this to git!)
```bash
echo "SUPABASE_ANON_KEY=your-supabase-anon-key-here" > .env
```

Then load it before running:
```bash
source .env
yarn start
```

## Verifying the Setup

After deploying with the environment variable:

1. Check the Netlify deploy logs to ensure the variable is available
2. Test the `generate_experiment_report` tool without passing `supabaseApiKey` parameter
3. If you get a "401 Unauthorized" error, the environment variable is not set correctly
4. If you get an error about missing API key, the tool couldn't find the environment variable

## Security Best Practices

1. **Never commit API keys to git** - Always use environment variables
2. **Use different keys for different environments** - Have separate keys for dev/staging/production
3. **Rotate keys periodically** - Generate new API keys and update environment variables regularly
4. **Use Netlify's scoped variables** - Restrict keys to specific deploy contexts if needed

## Troubleshooting

### Error: "Supabase API key is required"
- The environment variable is not set in Netlify
- Solution: Add `SUPABASE_ANON_KEY` to Netlify environment variables and redeploy

### Error: "401 Unauthorized"
- The API key is incorrect or expired
- Solution: Verify the key in Supabase dashboard and update in Netlify

### Tool works locally but not on Netlify
- Environment variable not set in Netlify deployment
- Solution: Add the variable to Netlify's environment variables settings

### How to test without deploying
Pass the API key directly as a parameter:
```json
{
  "recipientEmail": "test@example.com",
  "experimentName": "Test Experiment",
  "supabaseApiKey": "your-key-here",
  "optimizelyResultsJson": "{...}"
}
```
