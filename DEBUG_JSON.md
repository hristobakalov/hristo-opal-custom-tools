# Debugging JSON Issues with generate_experiment_report

If you're getting JSON parsing errors, here are some common causes and solutions:

## Common Issues

### 1. JSON Already Parsed
**Error:** `Invalid optimizelyResultsJson type`

**Cause:** You might be passing an already-parsed JavaScript object instead of a JSON string.

**Solution:** The tool now accepts both! You can pass:
- A JSON string: `'{"experiment_id": 123}'`
- An already-parsed object: `{experiment_id: 123}`

### 2. Invalid JSON Syntax
**Error:** `Expected ',' or ']' after array element`

**Cause:** The JSON string has syntax errors - missing commas, brackets, or quotes.

**Common causes:**
- Trailing commas in arrays or objects
- Unescaped special characters in strings
- Missing closing brackets/braces
- Single quotes instead of double quotes

**Solution:** Validate your JSON first:

```javascript
// In browser console or Node.js
try {
  JSON.parse(yourJsonString);
  console.log("JSON is valid!");
} catch (e) {
  console.error("JSON error:", e.message);
}
```

### 3. Special Characters Not Escaped
**Error:** `Unexpected token` at specific position

**Cause:** Special characters in string values aren't properly escaped.

**Characters that need escaping:**
- `"` → `\"`
- `\` → `\\`
- Newlines → `\n`
- Tabs → `\t`

**Solution:** Ensure strings are properly escaped:

```javascript
// Wrong
{"description": "This has "quotes" in it"}

// Right
{"description": "This has \"quotes\" in it"}
```

### 4. Large JSON String
**Error:** Position number is very large (> 10,000)

**Cause:** Large Optimizely results JSON with syntax error deep in the structure.

**Solution:** Use a JSON validator to find the exact issue:
1. Copy your JSON string
2. Paste it into https://jsonlint.com
3. Fix the errors it identifies
4. Use the validated JSON

## Testing Your JSON

### Method 1: Browser Console
```javascript
const myJson = '{"experiment_id": 123, "metrics": [...]}';
try {
  const parsed = JSON.parse(myJson);
  console.log("✓ Valid JSON:", parsed);
} catch (e) {
  console.error("✗ Invalid JSON:", e.message);
}
```

### Method 2: Online Validator
Use https://jsonlint.com or https://jsonformatter.org

### Method 3: Command Line
```bash
echo '{"experiment_id": 123}' | python3 -m json.tool
```

## How to Pass JSON to the Tool

### Option A: As a String (Escaped)
```json
{
  "recipientEmail": "test@example.com",
  "experimentName": "My Test",
  "optimizelyResultsJson": "{\"experiment_id\":123,\"metrics\":[...]}"
}
```

### Option B: As an Object (When calling from code)
```javascript
{
  recipientEmail: "test@example.com",
  experimentName: "My Test",
  optimizelyResultsJson: {
    experiment_id: 123,
    metrics: [...]
  }
}
```

### Option C: Using a File
```javascript
const fs = require('fs');
const jsonData = fs.readFileSync('experiment-results.json', 'utf8');

// Pass the string directly
{
  optimizelyResultsJson: jsonData  // Already a string
}
```

## Debug Example

If you get an error at position 11419:

```javascript
const json = '{"experiment_id": ...}';  // Your long JSON string
const position = 11419;

// See the problematic area
console.log("Error near:");
console.log(json.substring(position - 100, position + 100));
```

## Updated Tool Behavior

The tool now:
1. ✓ Accepts both JSON strings and parsed objects
2. ✓ Shows context around JSON errors
3. ✓ Provides the exact error position
4. ✓ Gives clearer error messages

## Still Having Issues?

1. **Check the sample file:**
   - Look at `examples/sample-optimizely-results.json` for correct format
   - Compare your JSON structure with the sample

2. **Validate step-by-step:**
   ```javascript
   // Check if it's valid JSON
   const data = JSON.parse(yourString);

   // Check required fields
   console.log("Has experiment_id?", data.experiment_id);
   console.log("Has start_time?", data.start_time);
   console.log("Has end_time?", data.end_time);
   console.log("Has metrics?", data.metrics);
   console.log("Has reach?", data.reach);
   console.log("Has stats_config?", data.stats_config);
   ```

3. **Test with minimal JSON:**
   ```javascript
   // Start with this minimal valid structure
   {
     "experiment_id": 123,
     "start_time": "2025-01-01T00:00:00Z",
     "end_time": "2025-01-15T00:00:00Z",
     "metrics": [],
     "reach": {
       "total_count": 100,
       "variations": {}
     },
     "stats_config": {
       "confidence_level": 0.9
     }
   }
   ```

## Get Help

If you're still stuck:
1. Check the error message for the exact position
2. Look at the characters around that position
3. Use a JSON validator
4. Compare with the sample file
5. Try passing the object directly instead of a string
