# Generate Experiment Report Tool - Usage Example

## Overview
The `generate_experiment_report` tool generates a PDF report from Optimizely experiment results and emails it to a specified recipient. It automatically transforms the complex Optimizely Stats API JSON into a formatted, professional report.

## Authentication
The tool requires a Supabase API key (anon key) for authentication. You can provide it in two ways:
1. **Parameter**: Pass `supabaseApiKey` in the tool call
2. **Environment Variable**: Set `SUPABASE_ANON_KEY` environment variable

For production/Netlify deployments, it's recommended to use the environment variable approach.

## Required Parameters

1. **recipientEmail** (required): Email address where the PDF report will be sent
2. **experimentName** (required): Name of the experiment for the report title
3. **optimizelyResultsJson** (required): Complete Optimizely experiment results JSON from the Stats API

## Optional Parameters

4. **supabaseApiKey** (optional): Supabase anon key. If not provided, uses `SUPABASE_ANON_KEY` environment variable
5. **hypothesis** (optional): The hypothesis being tested
6. **recommendationStatus** (optional): e.g., "Winner", "Inconclusive", "Continue Testing"
7. **recommendationTitle** (optional): e.g., "Deploy Variation #1 to 100% traffic"
8. **recommendationDescription** (optional): Detailed explanation of the recommendation
9. **actions** (optional): JSON array or comma-separated string of next steps

## Example Usage

### Minimal Example (Using Environment Variable for API Key)

```json
{
  "recipientEmail": "analyst@example.com",
  "experimentName": "Optimizely.com Increase sign-ups",
  "optimizelyResultsJson": "{\"confidence_threshold\":0.9,\"end_time\":\"2025-10-16T16:05:42.885000Z\",\"experiment_id\":4760416228737024,\"is_stale\":false,\"last_calculated_time\":\"2026-01-28T10:23:40.353000Z\",\"metrics\":[{\"name\":\"Click on homepage CTA\",\"event_id\":27940630014,\"aggregator\":\"unique\",\"scope\":\"visitor\",\"winning_direction\":\"increasing\",\"results\":{\"4565994467753984\":{\"level\":\"variation\",\"name\":\"Original\",\"samples\":277,\"variation_id\":\"4565994467753984\",\"is_baseline\":true,\"value\":82,\"rate\":0.296028880866426,\"variance\":0.20839578255939736},\"4713473611923456\":{\"level\":\"variation\",\"name\":\"Variation #2\",\"samples\":272,\"variation_id\":\"4713473611923456\",\"is_baseline\":false,\"value\":132,\"rate\":0.4852941176470588,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.7571863592749448,\"value\":0.6393472022955524,\"visitors_remaining\":47,\"confidence_interval\":[-0.16208112896537086,1.4407755335564758]},\"variance\":0.24978373702422144}}}],\"reach\":{\"baseline_count\":277,\"baseline_reach\":0.33657351154313486,\"treatment_reach\":0.6634264884568651,\"total_count\":823,\"treatment_count\":546,\"variations\":{\"4565994467753984\":{\"count\":277,\"name\":\"Original\",\"variation_id\":\"4565994467753984\",\"variation_reach\":0.33657351154313486}}},\"start_time\":\"2025-10-15T10:30:29.247000Z\",\"stats_config\":{\"confidence_level\":0.9,\"difference_type\":\"relative\",\"epoch_enabled\":false}}"
}
```

### With API Key Parameter

```json
{
  "recipientEmail": "analyst@example.com",
  "experimentName": "Optimizely.com Increase sign-ups",
  "supabaseApiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "optimizelyResultsJson": "{...}"
}
```

### Complete Example (All Fields)

```json
{
  "recipientEmail": "analyst@example.com",
  "experimentName": "Optimizely.com Increase sign-ups",
  "supabaseApiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "optimizelyResultsJson": "{...full Optimizely JSON...}",
  "hypothesis": "Changing the CTA button color and text will increase click-through rates and conversions",
  "recommendationStatus": "Promising Results",
  "recommendationTitle": "Deploy Variation #2 to Production",
  "recommendationDescription": "Variation #2 shows a 63.9% lift in CTA clicks and 68.6% lift in conversions. While statistical significance hasn't been reached yet (75.7% and 79.3% respectively), the consistent positive trend across both metrics suggests this variation is performing well. Recommend deploying to production while continuing to monitor.",
  "actions": "Deploy Variation #2 to 100% traffic, Monitor performance for 2 weeks, Set up alerts for conversion rate drops, Plan follow-up experiments for additional optimizations"
}
```

### Using Comma-Separated Actions

```json
{
  "recipientEmail": "analyst@example.com",
  "experimentName": "Homepage CTA Test",
  "optimizelyResultsJson": "{...}",
  "actions": "Deploy winning variation, Monitor for 30 days, Document learnings, Plan next iteration"
}
```

### Using JSON Array Actions

```json
{
  "recipientEmail": "analyst@example.com",
  "experimentName": "Homepage CTA Test",
  "optimizelyResultsJson": "{...}",
  "actions": "[\"Deploy winning variation\",\"Monitor for 30 days\",\"Document learnings\",\"Plan next iteration\"]"
}
```

## What the Tool Extracts Automatically

From the Optimizely results JSON, the tool automatically extracts:

- **Experiment ID**: From `experiment_id`
- **Date Range**: Calculated from `start_time` and `end_time`
- **Duration**: Days between start and end dates
- **Sample Size**: Total count from `reach.total_count`
- **Confidence Level**: From `stats_config.confidence_level` (converted to percentage)
- **Metrics**: Transformed from `metrics` array with lift calculations
- **Variations**: Extracted from `reach.variations` with sample sizes

## Response

The tool returns:

```json
{
  "success": true,
  "reportId": "uuid-of-report",
  "pdfUrl": "https://...storage.../report.pdf",
  "reportPageUrl": "https://...lovable.app/report/{reportId}",
  "message": "Report generated and sent to analyst@example.com",
  "fullResponse": {...}
}
```

## Environment Variable Setup

### Local Development
Create a `.env` file or export the variable:
```bash
export SUPABASE_ANON_KEY="your-supabase-anon-key-here"
```

### Netlify Deployment
1. Go to your Netlify site settings
2. Navigate to "Site configuration" → "Environment variables"
3. Add a new variable:
   - Key: `SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key
4. Redeploy your site

### Getting Your Supabase Anon Key
1. Go to your Supabase project dashboard
2. Navigate to "Settings" → "API"
3. Copy the "anon" / "public" key under "Project API keys"

## Tips

1. **Get Optimizely Results**: Use the Optimizely Stats API to fetch experiment results
2. **Stringify JSON**: Make sure to stringify the Optimizely JSON before passing it
3. **Default Values**: If you don't provide optional fields, sensible defaults are used
4. **Actions Format**: Either format works - comma-separated string or JSON array
5. **Email Delivery**: The PDF is automatically sent to the recipient email and also accessible via the returned URLs
6. **API Key Security**: For production, always use environment variables instead of hardcoding the API key
