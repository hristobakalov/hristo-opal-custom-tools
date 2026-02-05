# Quick Start Guide

Get your Opal Custom Tools running locally with ngrok in 4 steps!

## Prerequisites

- Node.js 18+ installed
- Yarn 4.3.1 (included in project)
- ngrok installed (automatically installed at `~/bin/ngrok`)
- **ngrok account** (free) - [Sign up here](https://dashboard.ngrok.com/signup)

## Setup Steps

### 1. Configure ngrok Authentication

ngrok requires a free account. Set it up once:

```bash
# 1. Sign up at https://dashboard.ngrok.com/signup
# 2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
# 3. Configure ngrok with your authtoken:
~/bin/ngrok config add-authtoken YOUR_AUTH_TOKEN
```

**Detailed instructions:** See [NGROK_AUTH_SETUP.md](NGROK_AUTH_SETUP.md)

### 2. Install Dependencies

```bash
yarn install
```

### 3. Configure Environment Variables

Copy the example file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase anon key:
```
SUPABASE_ANON_KEY=your-actual-key-here
```

**Where to get the Supabase anon key:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "anon" or "public" key under "Project API keys"

### 4. Start with ngrok

```bash
yarn ngrok
```

This will:
- ✓ Build the project
- ✓ Start the server on port 3000
- ✓ Create a public ngrok tunnel
- ✓ Display your public URL (e.g., `https://abc123.ngrok.io`)

## Using Your Tools

### Discovery Endpoint
Once running, your tools are discoverable at:
```
https://[your-ngrok-url].ngrok.io/discovery
```

### Available Tools

1. **create_experiment** - Create new A/B experiments in Optimizely
2. **list_events** - List all events for an Optimizely project
3. **generate_experiment_report** - Generate PDF reports from experiment results

### Example: Generate Experiment Report

```json
{
  "recipientEmail": "analyst@example.com",
  "experimentName": "Homepage CTA Test",
  "optimizelyResultsJson": "{...your Optimizely Stats API JSON...}",
  "hypothesis": "New CTA will increase conversions",
  "recommendationStatus": "Winner",
  "recommendationTitle": "Deploy Variation #1",
  "actions": "Deploy to production, Monitor for 2 weeks"
}
```

## Monitoring Requests

Visit the ngrok web interface to see all requests:
```
http://localhost:4040
```

## Stopping the Server

Press `Ctrl+C` in the terminal where you ran `yarn ngrok`.

## Alternative: Development Mode

For local development without ngrok:

```bash
# Build and start
yarn build
yarn start

# Or use hot reload
yarn dev
```

## Troubleshooting

### "SUPABASE_ANON_KEY is not set" warning
- Make sure you've created a `.env` file with the correct key
- The generate_experiment_report tool requires this

### Port 3000 already in use
```bash
PORT=3001 yarn ngrok
```

### ngrok tunnel not starting
- Check http://localhost:4040 for ngrok status
- Ensure port 3000 is not blocked by firewall
- Try restarting: Press Ctrl+C and run `yarn ngrok` again

### Build errors
```bash
rm -rf build/
yarn build
```

## Next Steps

- **Deploy to Production**: See [docs/netlify-deployment.md](docs/netlify-deployment.md)
- **ngrok Details**: See [NGROK_SETUP.md](NGROK_SETUP.md)
- **Environment Setup**: See [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md)
- **Tool Examples**: See [examples/](examples/)

## Need Help?

Check the detailed guides:
- [README.md](README.md) - Full project documentation
- [NGROK_SETUP.md](NGROK_SETUP.md) - Detailed ngrok configuration
- [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md) - Production deployment guide
- [examples/generate-experiment-report-example.md](examples/generate-experiment-report-example.md) - Report tool examples
