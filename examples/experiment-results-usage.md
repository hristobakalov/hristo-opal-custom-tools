# Experiment Results Agent Usage Guide

This guide demonstrates how to use the `experimentresults.json` agent to generate professional HTML reports from Optimizely experiment results.

## Overview

The Experiment Results Display agent transforms raw Optimizely Stats API JSON into beautiful, professional HTML reports with:
- Visual metrics and lift calculations
- Variation performance comparisons
- Statistical significance indicators
- Actionable recommendations
- Professional DaisyUI + TailwindCSS design

## Agent Parameters

### Required Parameters

1. **optimizely_results_json** (string, required)
   - Raw Optimizely Stats API JSON response
   - Can be passed as a JSON string or object
   - Must include: experiment_id, start_time, end_time, metrics, reach, stats_config

2. **experiment_name** (string, required)
   - Display name/title for the experiment
   - Example: "Homepage CTA Button Test"

### Optional Parameters

3. **hypothesis** (string, optional)
   - The hypothesis being tested
   - Default: "No hypothesis provided"
   - Example: "Changing the CTA button color will increase click-through rate"

4. **recommendation_status** (string, optional)
   - Status of the recommendation
   - Default: "Under Review"
   - Examples: "Winner", "Inconclusive", "Continue Testing", "Deploy"

5. **recommendation_title** (string, optional)
   - Title for the recommendation section
   - If not provided, auto-generated based on results
   - Example: "Deploy Variation #1 to 100% traffic"

6. **recommendation_description** (string, optional)
   - Detailed recommendation text
   - If not provided, auto-generated based on results
   - Example: "Variation #1 shows a 66% lift with high significance. Recommend deploying to all users."

7. **actions** (string, optional)
   - Next action items
   - Can be comma-separated string or JSON array
   - Default: Generic action items if not provided
   - Examples:
     - Comma-separated: "Deploy winning variation, Monitor for 7 days, Document learnings"
     - JSON array: `["Deploy winning variation", "Monitor for 7 days", "Document learnings"]`

## Usage Examples

### Example 1: Minimal Usage (Required Parameters Only)

```json
{
  "optimizely_results_json": "{...full Optimizely Stats API JSON...}",
  "experiment_name": "Homepage CTA Test"
}
```

This will:
- Parse the Optimizely JSON and extract all metrics
- Use default hypothesis: "No hypothesis provided"
- Auto-generate recommendation based on results
- Use default action items
- Display status as "Under Review"

### Example 2: Complete Usage (All Parameters)

```json
{
  "optimizely_results_json": "{...full Optimizely Stats API JSON...}",
  "experiment_name": "Homepage CTA Button Color Test",
  "hypothesis": "Changing the CTA button from blue to green will increase click-through rate by 15%",
  "recommendation_status": "Winner",
  "recommendation_title": "Deploy Green Button (Variation #1) to Production",
  "recommendation_description": "Variation #1 (green button) shows a 66.4% lift in click-through rate with 77.6% statistical significance. Recommend deploying to 100% of traffic immediately.",
  "actions": "Deploy winning variation to production, Monitor click-through rates for 7 days, Update design system with new button color, Document learnings in experimentation wiki"
}
```

### Example 3: Using Sample Data

Using the provided [sample-optimizely-results.json](sample-optimizely-results.json):

```json
{
  "optimizely_results_json": "<paste contents of sample-optimizely-results.json>",
  "experiment_name": "Multi-Variation CTA Test",
  "hypothesis": "Testing different CTA variations to optimize conversion rates",
  "recommendation_status": "Inconclusive",
  "recommendation_title": "Extend Test Duration",
  "recommendation_description": "While Variation #1 shows a 66% lift, the test has not reached 90% significance (currently at 77.6%). Recommend continuing the test for another week to reach statistical significance.",
  "actions": "[\"Continue test for 7 more days\", \"Monitor daily for significance\", \"Prepare deployment plan for winning variation\"]"
}
```

## Expected Output

The agent will:

1. **Display in Canvas**: Creates a visual HTML report in the Optimizely canvas with:
   - Gradient header with experiment name and metadata
   - Stats cards showing duration, date range, sample size, confidence level
   - Variations section with visual progress bars
   - Metrics section with lift calculations and significance
   - Recommendation card with status and next steps
   - Actions list with specific tasks

2. **Save to File**: Writes the HTML to a file named:
   - Format: `experiment_results_{experimentId}_{timestamp}.html`
   - Example: `experiment_results_4760416228737024_2025-10-16T10-30-29.html`
   - Can be opened in any browser or converted to PDF

## Data Transformation

The agent automatically transforms Optimizely JSON:

### From Sample Data:
```json
{
  "experiment_id": 4760416228737024,
  "start_time": "2025-10-15T10:30:29.247000Z",
  "end_time": "2025-10-16T16:05:42.885000Z",
  "reach": {
    "total_count": 823,
    "variations": {...}
  },
  "stats_config": {
    "confidence_level": 0.9
  },
  "metrics": [
    {
      "name": "Click on homepage CTA",
      "results": {
        "4565994467753984": {
          "name": "Original",
          "rate": 0.296028880866426,
          "is_baseline": true,
          ...
        },
        "6590003577356288": {
          "name": "Variation #1",
          "rate": 0.4927007299270073,
          "lift": {
            "value": 0.6643670998753783,
            "significance": 0.7760248837156417
          },
          ...
        }
      }
    }
  ]
}
```

### To Display Data:
```
Experiment ID: 4760416228737024
Duration: 1 day
Date Range: Oct 15, 2025 - Oct 16, 2025
Sample Size: 823 visitors
Confidence Level: 90%

Variations:
- Original (Control): 277 visitors (33.7%)
- Variation #1: 274 visitors (33.3%)
- Variation #2: 272 visitors (33.0%)

Metrics:
1. Click on homepage CTA
   - Best Lift: +66.4%
   - Original: 29.6% conversion
   - Variation #1: 49.3% conversion (+66.4% lift, 77.6% significance)
   - Variation #2: 48.5% conversion (+63.9% lift, 75.7% significance)

2. submit order
   - Best Lift: +68.6%
   - Original: 33.6% conversion
   - Variation #2: 56.6% conversion (+68.6% lift, 79.3% significance)
   - Variation #1: 51.8% conversion (+54.4% lift, 61.2% significance)
```

## Visual Features

The generated HTML report includes:

1. **Gradient Header** - Purple/blue gradient with white text
2. **Stats Cards** - 4 cards with key metrics in glass-morphism style
3. **Variation Bars** - Visual progress bars showing traffic split
4. **Metric Cards** - Hover effects, color-coded lifts (green = positive, red = negative)
5. **Significance Badges** - "Significant" (green) or "Not Significant" (yellow)
6. **Responsive Design** - Works on mobile, tablet, and desktop
7. **Professional Typography** - Inter font family
8. **Print-Friendly** - Can be exported to PDF

## Validation

The agent validates:
- Required fields exist in Optimizely JSON
- Dates are valid and properly formatted
- Percentages are calculated correctly
- Lift values match Optimizely data
- Sample sizes sum correctly
- All placeholders are replaced

## Error Handling

If required fields are missing, the agent will output an error message explaining:
- Which field is missing
- What fields are available
- How to fix the issue

Example error:
```
Error: Missing required fields in Optimizely results: metrics, reach
Available fields: experiment_id, start_time, end_time, stats_config
Please ensure you're sending the complete Optimizely Stats API response.
```

## Integration with Existing Tool

This agent can be used alongside the existing [generate-experiment-report.ts](../src/tools/generate-experiment-report.ts) tool:

| Feature | Agent (experimentresults.json) | Tool (generate-experiment-report.ts) |
|---------|--------------------------------|--------------------------------------|
| **HTML Generation** | Local (immediate) | External Supabase API |
| **Canvas Display** | ✅ Yes | ❌ No |
| **File Save** | ✅ Yes (local) | ✅ Yes (via URL) |
| **PDF Generation** | Manual (browser print) | ✅ Automatic |
| **Email Sending** | ❌ No | ✅ Yes |
| **Dependencies** | None (self-contained) | Requires Supabase API key |
| **Customization** | Full HTML control | Limited (server-side) |

## Tips

1. **For Quick Reviews**: Use the agent to generate HTML in canvas for immediate viewing
2. **For Sharing**: Use the existing tool to generate PDF and email to stakeholders
3. **For Archiving**: Save the HTML file from the agent for version control
4. **For Presentations**: Open the HTML in browser and use browser's "Print to PDF" feature
5. **For Customization**: Edit the HTML template in experimentresults.json to match your brand

## Troubleshooting

### Issue: "Missing required fields"
**Solution**: Ensure you're passing the complete Optimizely Stats API response, not a partial object

### Issue: "Dates showing as Invalid Date"
**Solution**: Check that start_time and end_time are in ISO 8601 format (e.g., "2025-10-15T10:30:29.247000Z")

### Issue: "Lift calculations seem wrong"
**Solution**: Verify the Optimizely JSON has `lift.value` fields in the metric results. The agent multiplies by 100 to convert to percentage.

### Issue: "No canvas display"
**Solution**: Check that `create_canvas` tool is enabled in your Optimizely Opal environment

## Next Steps

After generating your report:

1. ✅ Review the metrics and statistical significance
2. ✅ Validate the recommendation aligns with business goals
3. ✅ Share the HTML file with stakeholders
4. ✅ Document learnings in your experimentation knowledge base
5. ✅ Plan deployment strategy for winning variation
6. ✅ Set up monitoring for post-deployment performance
