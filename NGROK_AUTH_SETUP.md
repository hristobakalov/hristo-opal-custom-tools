# ngrok Authentication Setup

ngrok requires a free account and authtoken to create tunnels. Follow these steps to set it up:

## Step 1: Create a Free ngrok Account

1. Go to https://dashboard.ngrok.com/signup
2. Sign up with your email or use GitHub/Google sign-in
3. Verify your email address

## Step 2: Get Your Authtoken

1. After logging in, go to https://dashboard.ngrok.com/get-started/your-authtoken
2. Copy your authtoken (it looks like: `2abc123def456ghi789jkl0mno1pqr2st_3uvwxyz4ABCDEFGH5`)

## Step 3: Configure ngrok with Your Authtoken

Run this command in your terminal (replace `YOUR_AUTH_TOKEN` with your actual token):

```bash
~/bin/ngrok config add-authtoken YOUR_AUTH_TOKEN
```

**Example:**
```bash
~/bin/ngrok config add-authtoken 2abc123def456ghi789jkl0mno1pqr2st_3uvwxyz4ABCDEFGH5
```

This will create a config file at `~/Library/Application Support/ngrok/ngrok.yml` with your authtoken.

## Step 4: Verify the Setup

Test that ngrok is working:

```bash
~/bin/ngrok http 3000
```

You should see output showing your public URL. Press `Ctrl+C` to stop it.

## Step 5: Start Your Server with ngrok

Now you can use the automated script:

```bash
yarn ngrok
```

## Troubleshooting

### "authtoken not found"
- Make sure you ran the `ngrok config add-authtoken` command
- Check that the config file exists: `cat ~/Library/Application\ Support/ngrok/ngrok.yml`

### "authentication failed"
- Your authtoken might be incorrect
- Copy the authtoken again from the dashboard and run the config command

### "account suspended"
- Free ngrok accounts have usage limits
- Check your account status at https://dashboard.ngrok.com

## What You Get with a Free Account

✓ Public HTTPS URLs
✓ HTTP/TCP tunnels
✓ Web interface for inspecting traffic (http://localhost:4040)
✓ Up to 1 active tunnel at a time
✓ Limited sessions per minute

## Need More Features?

For production use or advanced features, consider:
- **ngrok Pro**: Custom domains, reserved URLs, more tunnels
- **Netlify Deployment**: See [docs/netlify-deployment.md](docs/netlify-deployment.md) for a permanent solution

## Quick Reference

```bash
# Configure authtoken (one-time setup)
~/bin/ngrok config add-authtoken YOUR_TOKEN

# Start a tunnel manually
~/bin/ngrok http 3000

# Start with our automated script
yarn ngrok

# View ngrok config
cat ~/Library/Application\ Support/ngrok/ngrok.yml
```

## Security Note

⚠️ **Keep your authtoken private!** It's like a password for your ngrok account.
- Don't commit it to git
- Don't share it publicly
- If exposed, regenerate it at https://dashboard.ngrok.com/get-started/your-authtoken
