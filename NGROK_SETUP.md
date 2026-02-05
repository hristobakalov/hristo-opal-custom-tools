# ngrok Setup Guide

This guide explains how to expose your local Opal Custom Tools server to the internet using ngrok, allowing you to test tools from Optimizely Opal.

## Quick Start

1. **Install ngrok** (if not already installed):
   ```bash
   brew install ngrok/ngrok/ngrok
   ```

   Or ngrok is already installed in `~/bin/ngrok` from our setup.

2. **Set up your environment variables**:
   Create or edit `.env` file:
   ```bash
   SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

3. **Start the server with ngrok**:
   ```bash
   yarn ngrok
   ```

4. **Copy the public URL** displayed in the terminal (e.g., `https://abc123.ngrok.io`)

5. **Use the URL in Optimizely Opal** to register your tools

## What the Script Does

The `start-with-ngrok.sh` script automatically:

1. ✓ Loads environment variables from `.env` file
2. ✓ Builds the TypeScript project
3. ✓ Starts the Express server on port 3000
4. ✓ Creates an ngrok tunnel to expose the server publicly
5. ✓ Displays the public HTTPS URL
6. ✓ Shows the discovery endpoint URL
7. ✓ Provides link to ngrok web interface

## ngrok Features

### Web Interface
Visit `http://localhost:4040` to access the ngrok web interface where you can:
- See all HTTP requests in real-time
- Inspect request/response headers and bodies
- Replay requests for debugging
- View connection status and metrics

### Public URL Format
Your tools will be accessible at:
```
https://[random-id].ngrok.io/discovery    # Discovery endpoint
https://[random-id].ngrok.io/tools/...     # Individual tool endpoints
```

## Stopping the Server

Press `Ctrl+C` in the terminal to stop both the server and ngrok tunnel.

## Troubleshooting

### "ngrok not found"
If you get this error, ngrok might not be in your PATH. Try:
```bash
export PATH="$HOME/bin:$PATH"
yarn ngrok
```

### Cannot access public URL
1. Check that the server started successfully (look for "Server running on port 3000" message)
2. Verify ngrok is running (visit http://localhost:4040)
3. Check firewall settings

### 401 Unauthorized on generate_experiment_report
Make sure you've set the `SUPABASE_ANON_KEY` environment variable in your `.env` file.

### Port already in use
If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 ./start-with-ngrok.sh
```

## Environment Variables

The script automatically loads these from `.env` file:

| Variable | Required For | Description |
|----------|-------------|-------------|
| `SUPABASE_ANON_KEY` | generate_experiment_report | Supabase anon/public API key |
| `PORT` | Optional | Server port (default: 3000) |

## Using with Optimizely Opal

1. Start your local server with ngrok: `yarn ngrok`
2. Copy the public URL (e.g., `https://abc123.ngrok.io`)
3. In Optimizely Opal, register your tools using the discovery endpoint:
   ```
   https://abc123.ngrok.io/discovery
   ```
4. Your tools will now be available in Optimizely Opal

## ngrok Authentication (Optional)

For longer sessions and more features, you can authenticate ngrok:

1. Sign up for a free account at https://dashboard.ngrok.com/signup
2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
3. Configure ngrok:
   ```bash
   ~/bin/ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

**Benefits of authentication:**
- Longer session timeouts
- Custom subdomain (on paid plans)
- More simultaneous tunnels
- Request inspection and replay

## Manual ngrok Usage

If you prefer to run ngrok manually:

```bash
# Terminal 1: Start the server
yarn start

# Terminal 2: Start ngrok
~/bin/ngrok http 3000
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Temporary URLs**: ngrok URLs are temporary and change each time you restart ngrok (unless you have a paid plan with reserved domains)
2. **Public Access**: Anyone with your ngrok URL can access your tools while the tunnel is active
3. **API Keys**: Never commit `.env` files with API keys to git
4. **Basic Auth**: The server has basic authentication enabled (admin/password) for non-public routes
5. **Development Only**: ngrok is intended for development and testing, not production use

## Tips

1. **Keep ngrok running**: The tunnel stays active as long as the script is running
2. **Share URLs carefully**: Only share your ngrok URL with trusted parties
3. **Monitor requests**: Use the ngrok web interface (http://localhost:4040) to debug issues
4. **Environment consistency**: Keep your `.env` file updated with the same values you use in production
5. **Restart for changes**: If you modify code, restart the script to rebuild and redeploy

## Alternative: Deploy to Netlify

For a more permanent solution, consider deploying to Netlify:
- See [docs/netlify-deployment.md](docs/netlify-deployment.md)
- Set environment variables in Netlify dashboard
- Get a stable URL that doesn't change
