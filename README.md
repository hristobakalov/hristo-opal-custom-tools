# opal-custom-tools

A custom tools service for Optimizely Opal that exposes tools via HTTP endpoints using the `@optimizely-opal/opal-tools-sdk`.

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn 4.3.1

### Installation
```bash
yarn install
```

### Development
```bash
# Run in development mode with hot reload
yarn dev

# Build the project
yarn build

# Run the compiled application
yarn start
```

The server will start on port 3000 (or the PORT environment variable) and expose:
- Tools endpoints for each registered tool
- Discovery endpoint at `/discovery`

## Available Tools

### greeting
Greets a person in a random language (English, Spanish, French).

**Parameters:**
- `name` (required): Name of the person to greet
- `language` (optional): Language for greeting (defaults to random)

### todays-date
Returns today's date in the specified format.

**Parameters:**
- `format` (optional): Date format (defaults to ISO format)

### api_call
HTTP client wrapper supporting various HTTP methods with custom headers.

**Parameters:**
- `url` (required): The URL to make the request to
- `method` (optional): HTTP method (GET, POST, PUT, PATCH, DELETE). Defaults to GET
- `headers` (optional): Custom headers as JSON string
- `body` (optional): Request body (for POST, PUT, PATCH methods)

### create_experiment
Creates a new A/B experiment in Optimizely Web Experimentation using the REST API. Uses OptiID authentication for secure access.

**Authentication:**
- Requires OptiID authentication (automatically handled when used within Optimizely Opal)
- Uses the authenticated user's access token to create experiments

**Parameters:**
- `project_id` (optional): The Optimizely project ID where the experiment will be created. When used within Optimizely (e.g., from a project page), this is automatically detected from the URL context.
- `name` (required): Name of the experiment
- `description` (optional): Description/hypothesis of the experiment
- `edit_url` (optional): URL where the experiment will run (e.g., the page URL being tested). When provided, automatically sets up URL targeting conditions.
- `status` (optional): Experiment status (not_started, running, paused, archived). Defaults to 'not_started'
- `type` (optional): Experiment type (a/b, feature, multivariate, personalization, multiarmed_bandit). Defaults to 'a/b'
- `variations` (optional): JSON string array of variations with traffic allocation. If not provided, defaults to a 50/50 split between "Original" and "Variation #1"

**Usage Example:**
When using this tool from within Optimizely Opal on a project page (e.g., `https://app.optimizely.com/v2/projects/27482800909`), you only need to provide the experiment name:
```
create_experiment(
  name: "Homepage Hero Test",
  edit_url: "https://example.com/homepage"
)
```

If running outside of Optimizely context, you'll need to explicitly provide the project_id.

### list_events
Gets all Events for an Optimizely project, including all types of Events and Pageview Events. Uses OptiID authentication for secure access.

**Authentication:**
- Requires OptiID authentication (automatically handled when used within Optimizely Opal)

**Parameters:**
- `project_id` (optional): The Optimizely project ID to list events for. When used within Optimizely, this is automatically detected from the URL context.
- `include_classic` (optional): Set to true to include Goal objects from Optimizely Classic. Defaults to false.

**Usage Example:**
```
list_events()
```

### update_experiment
Updates an existing Optimizely experiment by its ID. Can be used to add or update metrics and other experiment properties. Uses OptiID authentication for secure access.

**Authentication:**
- Requires OptiID authentication (automatically handled when used within Optimizely Opal)

**Parameters:**
- `experiment_id` (required): The ID of the experiment to update
- `metrics` (optional): JSON string array of metrics to add/update. Each metric should include:
  - `event_id` (required): The ID of the event to track
  - `event_type` (required): The type of event (custom, click, pageview)
  - `aggregator` (optional): How to aggregate the metric (unique, count, sum, bounce, exit, ratio)
  - `scope` (optional): The scope of measurement (session, visitor, event). Defaults to "visitor" if not provided.
  - `winning_direction` (optional): Which direction is better (increasing, decreasing). Defaults to "increasing" if not provided.

**Usage Example:**
```
update_experiment(
  experiment_id: "12345",
  metrics: '[{"event_id":67890,"event_type":"custom","aggregator":"unique"}]'
)
```
Note: `scope` defaults to "visitor" and `winning_direction` defaults to "increasing" if not specified.

### rick-roll
Returns a Rick Roll GIF URL for fun interactions.

**Parameters:**
- No parameters required

### sqlite-query
Executes SQL queries against a SQLite database.

**Parameters:**
- `query` (required): SQL query to execute
- `params` (optional): Query parameters for prepared statements

## Architecture

This service uses Express.js with CORS enabled to serve tools. Each tool is implemented as a separate module in the `src/tools/` directory and registered using the `@tool` decorator pattern from the Opal tools SDK.

The application is designed to work in both traditional server environments and serverless platforms (Vercel, Netlify) with automatic environment detection.

### Project Structure
```
src/
  main.ts          # Main application entry point (exports app for serverless)
  tools/           # Individual tool implementations
    greeting.ts
    todays-date.ts
    api-call.ts
    create-experiment.ts
    list-events.ts
    update-experiment.ts
    rick-roll.ts
    sqlite-query.ts
vercel/
  index.ts         # Vercel serverless function entry point
netlify/
  functions/
    api.ts         # Netlify Functions entry point
build/             # Compiled JavaScript output
docs/              # Deployment documentation
```

### Adding New Tools

1. Create a new file in `src/tools/` directory
2. Define TypeScript interfaces for tool parameters
3. Implement async function with typed parameters
4. Register tool using `tool()` decorator with parameter definitions
5. Import the tool file in `src/main.ts`

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript (ES2022, NodeNext modules)
- **Framework**: Express.js
- **Package Manager**: Yarn 4.3.1
- **SDK**: @optimizely-opal/opal-tools-sdk
- **Development**: tsc-watch for hot reload
- **Serverless**: serverless-http wrapper for Netlify Functions
- **Database**: SQLite3 for local data storage

## Deployment

Ready to deploy your custom tools service? Choose your preferred platform:

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kunalshetye/opal-custom-tools)

### Deployment Guides

- [Deploy to Vercel](docs/vercel-deployment.md) - ⚠️ Currently not working due to Express middleware compatibility issues
- [Deploy to Netlify](docs/netlify-deployment.md) - ✅ Working - JAMstack deployment with edge functions

# GIPHY Reference
```sh
https://giphy.com/gifs/rick-astley-Ju7l5y9osyymQ
```