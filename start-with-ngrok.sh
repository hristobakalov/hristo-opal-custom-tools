#!/bin/bash

# Start Opal Custom Tools with ngrok
# This script starts the local server and exposes it via ngrok

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Port configuration
PORT=${PORT:-3000}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Opal Custom Tools - ngrok Launcher${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if ngrok is installed
if ! command -v ~/bin/ngrok &> /dev/null && ! command -v ngrok &> /dev/null; then
    echo -e "${YELLOW}Error: ngrok is not installed.${NC}"
    echo "Please install ngrok first: brew install ngrok/ngrok/ngrok"
    exit 1
fi

# Use ngrok from ~/bin if available, otherwise use system ngrok
NGROK_CMD="ngrok"
if [ -f ~/bin/ngrok ]; then
    NGROK_CMD=~/bin/ngrok
fi

# Check if .env file exists and load SUPABASE_ANON_KEY
if [ -f .env ]; then
    echo -e "${GREEN}Loading environment variables from .env file...${NC}"
    export $(grep -v '^#' .env | xargs)
fi

# Verify SUPABASE_ANON_KEY is set
if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo -e "${YELLOW}Warning: SUPABASE_ANON_KEY is not set.${NC}"
    echo "The generate_experiment_report tool will require the API key as a parameter."
    echo ""
fi

# Build the project
echo -e "${GREEN}Building the project...${NC}"
yarn build
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Starting the server on port ${PORT}...${NC}"

# Start the server in the background
PORT=$PORT yarn start &
SERVER_PID=$!

# Wait for server to be ready
echo -e "${GREEN}Waiting for server to start...${NC}"
sleep 3

# Check if server is running
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${YELLOW}Server failed to start. Check the logs above.${NC}"
    exit 1
fi

echo -e "${GREEN}Server started successfully (PID: ${SERVER_PID})${NC}"
echo ""

# Start ngrok
echo -e "${GREEN}Starting ngrok tunnel...${NC}"
echo ""

# Start ngrok and capture output
$NGROK_CMD http $PORT --log=stdout > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok to be ready
sleep 2

# Get the public URL from ngrok API
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'https://[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo -e "${YELLOW}Failed to get ngrok URL. Checking ngrok status...${NC}"
    echo "Visit http://localhost:4040 to see ngrok dashboard"
else
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}✓ Your public URL:${NC}"
    echo -e "${BLUE}  $NGROK_URL${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo -e "${GREEN}Discovery endpoint:${NC}"
    echo -e "  ${NGROK_URL}/discovery"
    echo ""
    echo -e "${GREEN}ngrok Web Interface:${NC}"
    echo -e "  http://localhost:4040"
    echo ""
fi

echo -e "${YELLOW}Press Ctrl+C to stop both the server and ngrok${NC}"
echo ""

# Trap Ctrl+C and cleanup
trap cleanup INT

cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $NGROK_PID 2>/dev/null
    kill $SERVER_PID 2>/dev/null
    echo -e "${GREEN}Done!${NC}"
    exit 0
}

# Wait for both processes
wait $NGROK_PID $SERVER_PID
