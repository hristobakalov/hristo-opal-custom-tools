# Correct Way to Call generate_experiment_report

## ✅ RECOMMENDED: Pass as Object (Not String)

```javascript
{
  recipientEmail: "hristobak@gmail.com",
  experimentName: "Optimizely.com Increase sign-ups",
  optimizelyResultsJson: {  // ← Pass the object directly, NOT as a string!
    experiment: {...},
    results: {
      confidence_threshold: 0.9,
      end_time: "2025-10-16T16:05:42.885000Z",
      experiment_id: 4760416228737024,
      // ... rest of your data
    }
  },
  hypothesis: "Redesigning the hero section will lead to more user sign-ups.",
  recommendationStatus: "Inconclusive",
  recommendationTitle: "Experiment Inconclusive - Consider Relaunching with Changes",
  recommendationDescription: "Neither variation reached statistical significance...",
  actions: ["Do not ship either variation", "Brainstorm a new hypothesis", "Relaunch the test"]
}
```

## ❌ AVOID: String Concatenation

```javascript
// DON'T DO THIS - It creates malformed JSON:
optimizelyResultsJson: `{"experiment":{...}}` + ',"results":{...}'  // ← Breaks!

// This creates: {"experiment":{...}},"results":{...}
// Which is INVALID JSON (missing outer braces)
```

## ✅ ALTERNATIVE: If You Must Use a String

If you absolutely must send it as a JSON string, ensure it's valid JSON:

```javascript
{
  recipientEmail: "test@example.com",
  experimentName: "My Test",
  optimizelyResultsJson: JSON.stringify({  // ← Use JSON.stringify()
    experiment: {...},
    results: {...}
  }),
  // ... other params
}
```

## How Optimizely Opal Should Call It

When configuring the tool in Optimizely Opal, use this format:

```javascript
// In your Optimizely Opal tool configuration:
const experimentData = {
  experiment: experimentInfo,
  results: statsResults
};

// Call the tool
generateExperimentReport({
  recipientEmail: "analyst@example.com",
  experimentName: experimentInfo.name,
  optimizelyResultsJson: experimentData,  // ← Pass object directly
  hypothesis: "Your hypothesis here",
  recommendationStatus: "Winner",
  recommendationTitle: "Deploy Variation #1",
  recommendationDescription: "Variation #1 showed...",
  actions: ["Deploy to production", "Monitor for 2 weeks"]
});
```

## Common Issues

### Issue 1: String Concatenation
```javascript
// ❌ WRONG - Creates invalid JSON
const json = `{"part1": "value"}` + `,{"part2": "value"}`;

// ✅ CORRECT - Build object, then stringify if needed
const obj = { part1: "value", part2: "value" };
const json = JSON.stringify(obj);
```

### Issue 2: Template Literal Mistakes
```javascript
// ❌ WRONG - Broken across lines
const json = `{"data": "value"}` +
             `,{"more": "data"}`;

// ✅ CORRECT - Single valid JSON object
const json = `{"data": "value", "more": "data"}`;
```

### Issue 3: Missing Outer Braces
```javascript
// ❌ WRONG - Missing outer {}
"experiment":{...},"results":{...}

// ✅ CORRECT - Wrapped in {}
{"experiment":{...},"results":{...}}
```

## Testing Your Data

Before calling the tool, test if your JSON is valid:

```javascript
// Test 1: Check if it's valid JSON
try {
  const parsed = JSON.parse(yourJsonString);
  console.log("✓ Valid JSON");
} catch (e) {
  console.error("✗ Invalid JSON:", e.message);
}

// Test 2: Check required fields
const data = JSON.parse(yourJsonString);
const hasResults = data.results && data.results.experiment_id;
console.log("Has results data?", hasResults);
```

## Best Practice

**Always prefer passing objects over JSON strings when possible.** The tool automatically handles both, but objects are:
- Easier to work with
- Less error-prone
- No string escaping issues
- Automatically validated by TypeScript/JavaScript
