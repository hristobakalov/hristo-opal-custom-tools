# Experiment Results Display System

A professional HTML report generator for Optimizely experiment results, built as an Optimizely Opal agent.

## Overview

This system provides two approaches for generating experiment result reports:

1. **Agent-Based (NEW)** - [experimentresults.json](experimentresults.json)
   - Generates HTML locally using AI agent
   - Displays in Optimizely canvas
   - Saves HTML files for archiving
   - No external dependencies

2. **Tool-Based (EXISTING)** - [src/tools/generate-experiment-report.ts](src/tools/generate-experiment-report.ts)
   - Sends data to external Supabase API
   - Generates PDF automatically
   - Sends email notifications
   - Requires API key

## Files Structure

```
hristo-opal-custom-tools/
├── experimentresults.json              # NEW: Agent definition
├── agentexample.json                   # Reference: Agent pattern
├── examples/
│   ├── experiment-results-template.html # HTML template structure
│   ├── experiment-results-usage.md      # Usage guide
│   └── sample-optimizely-results.json   # Test data
└── src/tools/
    └── generate-experiment-report.ts    # Existing tool (for comparison)
```

## Quick Start

### Using the Agent (experimentresults.json)

1. **Load the agent** in your Optimizely Opal environment

2. **Prepare your data**:
   ```json
   {
     "optimizely_results_json": "<Optimizely Stats API JSON>",
     "experiment_name": "Your Experiment Name"
   }
   ```

3. **Run the agent** - It will:
   - Parse the Optimizely JSON
   - Transform data to display format
   - Generate professional HTML report
   - Display in canvas
   - Save to file

4. **View results**:
   - See the report in canvas immediately
   - Find saved HTML file: `experiment_results_{id}_{timestamp}.html`
   - Open in browser or convert to PDF

### Using the Existing Tool (generate-experiment-report.ts)

1. **Set up environment**:
   ```bash
   export SUPABASE_ANON_KEY="your-key-here"
   ```

2. **Call the tool**:
   ```typescript
   generate_experiment_report({
     recipientEmail: "user@example.com",
     experimentName: "Homepage CTA Test",
     optimizelyResultsJson: {...},
     // ... optional parameters
   })
   ```

3. **Receive results**:
   - PDF emailed to recipient
   - Report URL provided
   - View in browser at report page

## Feature Comparison

| Feature | Agent (experimentresults.json) | Tool (generate-experiment-report.ts) |
|---------|--------------------------------|--------------------------------------|
| **Speed** | Instant (local generation) | ~5-10s (API call) |
| **Canvas Display** | ✅ Yes | ❌ No |
| **File Output** | ✅ HTML (local) | ✅ PDF (via URL) |
| **Email** | ❌ No | ✅ Yes |
| **Customization** | ✅ Full HTML control | ⚠️ Limited |
| **Dependencies** | None | Requires Supabase key |
| **Offline Support** | ✅ Yes | ❌ No |
| **Cost** | Free | Depends on Supabase usage |

## Agent Architecture

### Data Flow

```
Optimizely Stats API JSON
         ↓
   Agent Parsing & Validation
         ↓
   Data Transformation
   (dates, metrics, lifts, significance)
         ↓
   HTML Template Population
         ↓
   Output: Canvas Display + HTML File
```

### Transformation Logic

The agent follows the same transformation logic as the existing tool:

**From** [src/tools/generate-experiment-report.ts:99-182](src/tools/generate-experiment-report.ts:99-182):
- `transformOptimizelyResults()` function
- Date calculations
- Metric lift calculations
- Variation extraction
- Statistical formatting

**Implemented in**: [experimentresults.json](experimentresults.json) prompt template

### HTML Template

Based on [agentexample.json](agentexample.json) pattern:
- **Framework**: DaisyUI + TailwindCSS
- **Theme**: Corporate (professional, clean)
- **Layout**: Responsive 2-column grid
- **Styling**: Gradient header, hover effects, glass-morphism

## Usage Scenarios

### Scenario 1: Quick Internal Review
**Use**: Agent (experimentresults.json)
- Generate HTML in canvas
- Review metrics with team
- Make immediate decisions
- No email needed

### Scenario 2: Stakeholder Reporting
**Use**: Tool (generate-experiment-report.ts)
- Generate PDF report
- Email to stakeholders
- Professional delivery
- Archived in Supabase

### Scenario 3: Documentation
**Use**: Both
- Agent: Generate HTML for wiki
- Tool: Generate PDF for records
- Keep both for reference

### Scenario 4: Offline Analysis
**Use**: Agent (experimentresults.json)
- No internet required
- Local HTML generation
- Full control over output
- Print to PDF via browser

## Data Structure

### Input: Optimizely Stats API Response

Required fields:
```json
{
  "experiment_id": number,
  "start_time": "ISO 8601 string",
  "end_time": "ISO 8601 string",
  "metrics": [
    {
      "name": string,
      "results": {
        "variation_id": {
          "name": string,
          "rate": number (0-1),
          "is_baseline": boolean,
          "lift": {
            "value": number,
            "significance": number (0-1)
          }
        }
      }
    }
  ],
  "reach": {
    "total_count": number,
    "variations": {
      "variation_id": {
        "name": string,
        "count": number
      }
    }
  },
  "stats_config": {
    "confidence_level": number (0-1)
  }
}
```

### Output: HTML Report

Sections:
1. **Header** - Experiment name, ID, hypothesis, status
2. **Stats Cards** - Duration, date range, sample size, confidence
3. **Variations** - Traffic split with visual bars
4. **Metrics** - Lift, significance, conversion rates
5. **Recommendation** - Status, title, description
6. **Actions** - Next steps list
7. **Statistical Details** - Methodology, confidence level

## Testing

### Test Data

Use [examples/sample-optimizely-results.json](examples/sample-optimizely-results.json):
- 3 variations (Original, Variation #1, Variation #2)
- 2 metrics ("Click on homepage CTA", "submit order")
- 823 total visitors
- 90% confidence level
- Lifts: +66.4% and +68.6%

### Expected Output

```
Experiment ID: 4760416228737024
Duration: 1 day
Date Range: Oct 15, 2025 - Oct 16, 2025
Sample Size: 823 visitors
Confidence: 90%

Variations:
- Original: 277 visitors (33.7%)
- Variation #1: 274 visitors (33.3%)
- Variation #2: 272 visitors (33.0%)

Metrics:
1. Click on homepage CTA: +66.4% lift (77.6% significance)
2. submit order: +68.6% lift (79.3% significance)
```

### Validation Checklist

- [ ] Dates formatted correctly (MMM DD, YYYY)
- [ ] Duration calculated accurately (days)
- [ ] Sample sizes sum to total_count
- [ ] Percentages add up to 100%
- [ ] Lift values match Optimizely data (* 100 for %)
- [ ] Significance converted from decimal to %
- [ ] Baseline variations marked
- [ ] Color coding correct (green = positive, red = negative)
- [ ] All placeholders replaced
- [ ] No "undefined" or "null" in output

## Customization

### Modify HTML Template

Edit the `prompt_template` section in [experimentresults.json](experimentresults.json):

**Change colors**:
```css
.gradient-header {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

**Change theme**:
```javascript
tailwind.config = {
  daisyui: {
    themes: ["light"], // or "dark", "cupcake", etc.
  },
}
```

**Add sections**:
Add new cards to the HTML template within the grid layout

**Modify calculations**:
Edit the LOGIC section to change transformation formulas

### Extend with New Features

Ideas for enhancement:
- [ ] Add charts (Chart.js integration)
- [ ] Export to CSV
- [ ] Compare multiple experiments
- [ ] Time-series analysis
- [ ] Funnel visualization
- [ ] Segment breakdown
- [ ] Cost/ROI calculations

## Integration

### With Optimizely Opal

1. Upload [experimentresults.json](experimentresults.json) to your Opal environment
2. Configure tools: `create_canvas`, `write_content_to_file`
3. Test with sample data
4. Integrate into workflows

### With Existing Tools

The agent can work alongside:
- [src/tools/generate-experiment-report.ts](src/tools/generate-experiment-report.ts) - PDF + Email
- [src/tools/create-experiment.ts](src/tools/create-experiment.ts) - Experiment creation
- [src/tools/update-experiment.ts](src/tools/update-experiment.ts) - Metric updates

### With External Systems

Export HTML and integrate with:
- **Wikis**: Embed HTML in Confluence, Notion
- **Dashboards**: Display in internal portals
- **Slack/Teams**: Attach HTML or PDF
- **Version Control**: Commit HTML to Git for history

## Troubleshooting

### Common Issues

**Problem**: Agent doesn't generate output
**Solution**: Check that `create_canvas` and `write_content_to_file` tools are enabled

**Problem**: Data missing from report
**Solution**: Validate Optimizely JSON has all required fields (use validation checklist)

**Problem**: Incorrect calculations
**Solution**: Compare with [generate-experiment-report.ts](src/tools/generate-experiment-report.ts) output

**Problem**: HTML not rendering correctly
**Solution**: Ensure DaisyUI and Tailwind CDN links are accessible

### Debug Mode

To debug transformations, add console.log equivalents in the prompt:

```
After parsing: Output experimentId, sampleSize, etc.
After metrics transformation: Output lift calculations
After HTML generation: Output snippet of HTML
```

## Best Practices

1. **Always validate data** - Use the Optimizely Stats API response directly
2. **Use semantic naming** - experiment_name should be descriptive
3. **Provide context** - Include hypothesis for better insights
4. **Set clear recommendations** - Don't leave status as "Under Review" for final reports
5. **Archive results** - Save HTML files for historical reference
6. **Document learnings** - Use actions list for team alignment

## Migration Guide

### From Existing Tool to Agent

**Before** (using tool):
```typescript
await generateExperimentReport({
  recipientEmail: "user@example.com",
  experimentName: "Test",
  optimizelyResultsJson: json,
  supabaseApiKey: key
});
```

**After** (using agent):
```json
{
  "optimizely_results_json": json,
  "experiment_name": "Test"
}
```

**Benefits**:
- No API key management
- Instant results
- Full customization
- Offline support

**Trade-offs**:
- No email (manual sharing)
- No auto-PDF (browser print)

## Roadmap

### v1.0 (Current)
- [x] Basic HTML generation
- [x] Optimizely JSON parsing
- [x] Metrics and variations display
- [x] Canvas output
- [x] File save

### v1.1 (Planned)
- [ ] Chart visualizations
- [ ] Multiple experiment comparison
- [ ] Custom branding options
- [ ] Dark mode support

### v2.0 (Future)
- [ ] Real-time updates
- [ ] Integration with BI tools
- [ ] A/B test calculator
- [ ] ROI analysis

## Support

For issues or questions:
1. Check [examples/experiment-results-usage.md](examples/experiment-results-usage.md)
2. Review [agentexample.json](agentexample.json) for pattern reference
3. Compare with [src/tools/generate-experiment-report.ts](src/tools/generate-experiment-report.ts)
4. Test with [examples/sample-optimizely-results.json](examples/sample-optimizely-results.json)

## License

Part of the Optimizely Opal custom tools project.
