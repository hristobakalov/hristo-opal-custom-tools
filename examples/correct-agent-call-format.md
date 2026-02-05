# Correct Agent Call Format for Experiment Results

This document shows the exact format to use when calling the `experimentresults.json` agent.

## Example 1: Using Sample Data (Minimal)

```json
{
  "optimizely_results_json": "{\"confidence_threshold\":0.9,\"end_time\":\"2025-10-16T16:05:42.885000Z\",\"experiment_id\":4760416228737024,\"is_stale\":false,\"last_calculated_time\":\"2026-01-28T10:23:40.353000Z\",\"metrics\":[{\"name\":\"Click on homepage CTA\",\"event_id\":27940630014,\"aggregator\":\"unique\",\"scope\":\"visitor\",\"winning_direction\":\"increasing\",\"results\":{\"4565994467753984\":{\"level\":\"variation\",\"name\":\"Original\",\"samples\":277,\"variation_id\":\"4565994467753984\",\"is_baseline\":true,\"value\":82,\"rate\":0.296028880866426,\"variance\":0.20839578255939736},\"4713473611923456\":{\"level\":\"variation\",\"name\":\"Variation #2\",\"samples\":272,\"variation_id\":\"4713473611923456\",\"is_baseline\":false,\"value\":132,\"rate\":0.4852941176470588,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.7571863592749448,\"value\":0.6393472022955524,\"visitors_remaining\":47,\"confidence_interval\":[-0.16208112896537086,1.4407755335564758]},\"variance\":0.24978373702422144},\"6590003577356288\":{\"level\":\"variation\",\"name\":\"Variation #1\",\"samples\":274,\"variation_id\":\"6590003577356288\",\"is_baseline\":false,\"value\":135,\"rate\":0.4927007299270073,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.7760248837156417,\"value\":0.6643670998753783,\"visitors_remaining\":41,\"confidence_interval\":[-0.14772970583459677,1.4764639055853535]},\"variance\":0.2499467206564015}}},{\"name\":\"submit order\",\"event_id\":27938590013,\"aggregator\":\"unique\",\"scope\":\"visitor\",\"winning_direction\":\"increasing\",\"results\":{\"4565994467753984\":{\"level\":\"variation\",\"name\":\"Original\",\"samples\":277,\"variation_id\":\"4565994467753984\",\"is_baseline\":true,\"value\":93,\"rate\":0.33574007220216606,\"variance\":0.22301867611985038},\"4713473611923456\":{\"level\":\"variation\",\"name\":\"Variation #2\",\"samples\":272,\"variation_id\":\"4713473611923456\",\"is_baseline\":false,\"value\":154,\"rate\":0.5661764705882353,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.7930237695256774,\"value\":0.6863535736875395,\"visitors_remaining\":28,\"confidence_interval\":[-0.09608440275134467,1.4687915501264235]},\"variance\":0.24562067474048443},\"6590003577356288\":{\"level\":\"variation\",\"name\":\"Variation #1\",\"samples\":274,\"variation_id\":\"6590003577356288\",\"is_baseline\":false,\"value\":142,\"rate\":0.5182481751824818,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.6115582966056365,\"value\":0.5435994035005103,\"visitors_remaining\":62,\"confidence_interval\":[-0.17519809777791873,1.2623969047789392]},\"variance\":0.24966700410250944}}}],\"reach\":{\"baseline_count\":277,\"baseline_reach\":0.33657351154313486,\"treatment_reach\":0.6634264884568651,\"total_count\":823,\"treatment_count\":546,\"variations\":{\"4565994467753984\":{\"count\":277,\"name\":\"Original\",\"variation_id\":\"4565994467753984\",\"variation_reach\":0.33657351154313486},\"4713473611923456\":{\"count\":272,\"name\":\"Variation #2\",\"variation_id\":\"4713473611923456\",\"variation_reach\":0.330498177399757},\"6590003577356288\":{\"count\":274,\"name\":\"Variation #1\",\"variation_id\":\"6590003577356288\",\"variation_reach\":0.33292831105710813}}},\"start_time\":\"2025-10-15T10:30:29.247000Z\",\"stats_config\":{\"confidence_level\":0.9,\"difference_type\":\"relative\",\"epoch_enabled\":false}}",
  "experiment_name": "Homepage CTA Multi-Variation Test"
}
```

**Expected Output:**
- Experiment ID: 4760416228737024
- Duration: 1 day
- Date Range: Oct 15, 2025 - Oct 16, 2025
- Sample Size: 823 visitors
- 3 variations with progress bars
- 2 metrics showing +66.4% and +68.6% lifts
- Auto-generated recommendation

---

## Example 2: Complete with All Parameters

```json
{
  "optimizely_results_json": "{\"confidence_threshold\":0.9,\"end_time\":\"2025-10-16T16:05:42.885000Z\",\"experiment_id\":4760416228737024,\"is_stale\":false,\"last_calculated_time\":\"2026-01-28T10:23:40.353000Z\",\"metrics\":[{\"name\":\"Click on homepage CTA\",\"event_id\":27940630014,\"aggregator\":\"unique\",\"scope\":\"visitor\",\"winning_direction\":\"increasing\",\"results\":{\"4565994467753984\":{\"level\":\"variation\",\"name\":\"Original\",\"samples\":277,\"variation_id\":\"4565994467753984\",\"is_baseline\":true,\"value\":82,\"rate\":0.296028880866426,\"variance\":0.20839578255939736},\"4713473611923456\":{\"level\":\"variation\",\"name\":\"Variation #2\",\"samples\":272,\"variation_id\":\"4713473611923456\",\"is_baseline\":false,\"value\":132,\"rate\":0.4852941176470588,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.7571863592749448,\"value\":0.6393472022955524,\"visitors_remaining\":47,\"confidence_interval\":[-0.16208112896537086,1.4407755335564758]},\"variance\":0.24978373702422144},\"6590003577356288\":{\"level\":\"variation\",\"name\":\"Variation #1\",\"samples\":274,\"variation_id\":\"6590003577356288\",\"is_baseline\":false,\"value\":135,\"rate\":0.4927007299270073,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.7760248837156417,\"value\":0.6643670998753783,\"visitors_remaining\":41,\"confidence_interval\":[-0.14772970583459677,1.4764639055853535]},\"variance\":0.2499467206564015}}},{\"name\":\"submit order\",\"event_id\":27938590013,\"aggregator\":\"unique\",\"scope\":\"visitor\",\"winning_direction\":\"increasing\",\"results\":{\"4565994467753984\":{\"level\":\"variation\",\"name\":\"Original\",\"samples\":277,\"variation_id\":\"4565994467753984\",\"is_baseline\":true,\"value\":93,\"rate\":0.33574007220216606,\"variance\":0.22301867611985038},\"4713473611923456\":{\"level\":\"variation\",\"name\":\"Variation #2\",\"samples\":272,\"variation_id\":\"4713473611923456\",\"is_baseline\":false,\"value\":154,\"rate\":0.5661764705882353,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.7930237695256774,\"value\":0.6863535736875395,\"visitors_remaining\":28,\"confidence_interval\":[-0.09608440275134467,1.4687915501264235]},\"variance\":0.24562067474048443},\"6590003577356288\":{\"level\":\"variation\",\"name\":\"Variation #1\",\"samples\":274,\"variation_id\":\"6590003577356288\",\"is_baseline\":false,\"value\":142,\"rate\":0.5182481751824818,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.6115582966056365,\"value\":0.5435994035005103,\"visitors_remaining\":62,\"confidence_interval\":[-0.17519809777791873,1.2623969047789392]},\"variance\":0.24966700410250944}}}],\"reach\":{\"baseline_count\":277,\"baseline_reach\":0.33657351154313486,\"treatment_reach\":0.6634264884568651,\"total_count\":823,\"treatment_count\":546,\"variations\":{\"4565994467753984\":{\"count\":277,\"name\":\"Original\",\"variation_id\":\"4565994467753984\",\"variation_reach\":0.33657351154313486},\"4713473611923456\":{\"count\":272,\"name\":\"Variation #2\",\"variation_id\":\"4713473611923456\",\"variation_reach\":0.330498177399757},\"6590003577356288\":{\"count\":274,\"name\":\"Variation #1\",\"variation_id\":\"6590003577356288\",\"variation_reach\":0.33292831105710813}}},\"start_time\":\"2025-10-15T10:30:29.247000Z\",\"stats_config\":{\"confidence_level\":0.9,\"difference_type\":\"relative\",\"epoch_enabled\":false}}",
  "experiment_name": "Homepage CTA Multi-Variation Test",
  "hypothesis": "Testing different CTA button variations to identify which color and text combination drives the highest click-through and conversion rates",
  "recommendation_status": "Inconclusive",
  "recommendation_title": "Extend Test Duration for Statistical Significance",
  "recommendation_description": "While both Variation #1 and Variation #2 show promising lifts (+66.4% and +68.6% respectively), neither has reached the 90% significance threshold (currently at 77.6% and 79.3%). Recommend continuing the test for an additional 7-14 days to achieve statistical significance before making a deployment decision.",
  "actions": "Continue test for 7-14 more days, Monitor daily for significance thresholds, Prepare deployment runbook for winning variation, Set up post-launch monitoring dashboard, Document test learnings in wiki"
}
```

**Expected Output:**
- All data from Example 1 PLUS
- Custom hypothesis displayed
- "Inconclusive" status badge (yellow)
- Custom recommendation title and description
- Custom action items (5 specific tasks)

---

## Example 3: Using Actions as JSON Array

```json
{
  "optimizely_results_json": "{\"confidence_threshold\":0.9,\"end_time\":\"2025-10-16T16:05:42.885000Z\",\"experiment_id\":4760416228737024,\"is_stale\":false,\"last_calculated_time\":\"2026-01-28T10:23:40.353000Z\",\"metrics\":[{\"name\":\"Click on homepage CTA\",\"event_id\":27940630014,\"aggregator\":\"unique\",\"scope\":\"visitor\",\"winning_direction\":\"increasing\",\"results\":{\"4565994467753984\":{\"level\":\"variation\",\"name\":\"Original\",\"samples\":277,\"variation_id\":\"4565994467753984\",\"is_baseline\":true,\"value\":82,\"rate\":0.296028880866426,\"variance\":0.20839578255939736},\"4713473611923456\":{\"level\":\"variation\",\"name\":\"Variation #2\",\"samples\":272,\"variation_id\":\"4713473611923456\",\"is_baseline\":false,\"value\":132,\"rate\":0.4852941176470588,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.7571863592749448,\"value\":0.6393472022955524,\"visitors_remaining\":47,\"confidence_interval\":[-0.16208112896537086,1.4407755335564758]},\"variance\":0.24978373702422144},\"6590003577356288\":{\"level\":\"variation\",\"name\":\"Variation #1\",\"samples\":274,\"variation_id\":\"6590003577356288\",\"is_baseline\":false,\"value\":135,\"rate\":0.4927007299270073,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.7760248837156417,\"value\":0.6643670998753783,\"visitors_remaining\":41,\"confidence_interval\":[-0.14772970583459677,1.4764639055853535]},\"variance\":0.2499467206564015}}},{\"name\":\"submit order\",\"event_id\":27938590013,\"aggregator\":\"unique\",\"scope\":\"visitor\",\"winning_direction\":\"increasing\",\"results\":{\"4565994467753984\":{\"level\":\"variation\",\"name\":\"Original\",\"samples\":277,\"variation_id\":\"4565994467753984\",\"is_baseline\":true,\"value\":93,\"rate\":0.33574007220216606,\"variance\":0.22301867611985038},\"4713473611923456\":{\"level\":\"variation\",\"name\":\"Variation #2\",\"samples\":272,\"variation_id\":\"4713473611923456\",\"is_baseline\":false,\"value\":154,\"rate\":0.5661764705882353,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.7930237695256774,\"value\":0.6863535736875395,\"visitors_remaining\":28,\"confidence_interval\":[-0.09608440275134467,1.4687915501264235]},\"variance\":0.24562067474048443},\"6590003577356288\":{\"level\":\"variation\",\"name\":\"Variation #1\",\"samples\":274,\"variation_id\":\"6590003577356288\",\"is_baseline\":false,\"value\":142,\"rate\":0.5182481751824818,\"lift\":{\"end_of_epoch\":false,\"is_significant\":false,\"lift_status\":\"better\",\"significance\":0.6115582966056365,\"value\":0.5435994035005103,\"visitors_remaining\":62,\"confidence_interval\":[-0.17519809777791873,1.2623969047789392]},\"variance\":0.24966700410250944}}}],\"reach\":{\"baseline_count\":277,\"baseline_reach\":0.33657351154313486,\"treatment_reach\":0.6634264884568651,\"total_count\":823,\"treatment_count\":546,\"variations\":{\"4565994467753984\":{\"count\":277,\"name\":\"Original\",\"variation_id\":\"4565994467753984\",\"variation_reach\":0.33657351154313486},\"4713473611923456\":{\"count\":272,\"name\":\"Variation #2\",\"variation_id\":\"4713473611923456\",\"variation_reach\":0.330498177399757},\"6590003577356288\":{\"count\":274,\"name\":\"Variation #1\",\"variation_id\":\"6590003577356288\",\"variation_reach\":0.33292831105710813}}},\"start_time\":\"2025-10-15T10:30:29.247000Z\",\"stats_config\":{\"confidence_level\":0.9,\"difference_type\":\"relative\",\"epoch_enabled\":false}}",
  "experiment_name": "Homepage CTA Winner Test",
  "hypothesis": "Green CTA button will outperform blue and red variants",
  "recommendation_status": "Winner",
  "recommendation_title": "Deploy Variation #1 (Green Button)",
  "recommendation_description": "Variation #1 shows the strongest performance with a 66.4% lift in CTA clicks and 54.4% lift in order submissions. While not yet statistically significant, the consistent positive trend across both metrics suggests this is the winning variation.",
  "actions": "[\"Deploy Variation #1 to 50% of traffic immediately\", \"Monitor for 3 days to confirm lift holds\", \"If stable, deploy to 100% of traffic\", \"Update design system with new green button\", \"Plan follow-up test on button text\"]"
}
```

**Note**: Actions are provided as a JSON array string (notice the square brackets and quotes)

---

## How to Use Your Own Data

1. **Get Optimizely Stats API JSON**:
   - Call Optimizely Stats API for your experiment
   - Copy the complete JSON response

2. **Format the JSON**:
   - Minify the JSON (remove whitespace) or escape quotes if needed
   - Wrap in quotes for the parameter: `"optimizely_results_json": "{...}"`

3. **Call the Agent**:
   ```json
   {
     "optimizely_results_json": "YOUR_MINIFIED_JSON_HERE",
     "experiment_name": "Your Experiment Name",
     "hypothesis": "Optional: Your hypothesis",
     "recommendation_status": "Optional: Winner/Inconclusive/etc",
     "recommendation_title": "Optional: Your title",
     "recommendation_description": "Optional: Your description",
     "actions": "Optional: Action 1, Action 2, Action 3"
   }
   ```

4. **View Results**:
   - HTML report displayed in canvas
   - File saved: `experiment_results_{id}_{timestamp}.html`

---

## Common Mistakes to Avoid

❌ **Wrong**: Sending only experiment_id
```json
{
  "optimizely_results_json": "{\"experiment_id\": 123}",
  "experiment_name": "Test"
}
```

✅ **Right**: Sending complete Optimizely Stats API response
```json
{
  "optimizely_results_json": "{\"experiment_id\":123,\"metrics\":[...],\"reach\":{...},\"stats_config\":{...}}",
  "experiment_name": "Test"
}
```

---

❌ **Wrong**: Passing JSON object directly
```json
{
  "optimizely_results_json": {"experiment_id": 123},
  "experiment_name": "Test"
}
```

✅ **Right**: Passing JSON as string
```json
{
  "optimizely_results_json": "{\"experiment_id\":123,...}",
  "experiment_name": "Test"
}
```

---

❌ **Wrong**: Missing required fields
```json
{
  "optimizely_results_json": "{...}"
}
```

✅ **Right**: Including experiment_name
```json
{
  "optimizely_results_json": "{...}",
  "experiment_name": "My Experiment"
}
```

---

## Testing Checklist

Before using the agent with your data:

- [ ] Optimizely JSON includes `experiment_id`
- [ ] Optimizely JSON includes `start_time` and `end_time`
- [ ] Optimizely JSON includes `metrics` array with `results`
- [ ] Optimizely JSON includes `reach` object with `variations`
- [ ] Optimizely JSON includes `stats_config` object
- [ ] JSON is properly formatted (no syntax errors)
- [ ] `experiment_name` parameter is provided
- [ ] Optional parameters are formatted correctly (if used)
- [ ] Agent tools (`create_canvas`, `write_content_to_file`) are enabled

---

## Output Verification

After running the agent, verify:

- [ ] Canvas displays the HTML report
- [ ] Header shows correct experiment name and ID
- [ ] Date range and duration calculated correctly
- [ ] All variations listed with correct sample sizes
- [ ] Metrics show lift percentages matching Optimizely data
- [ ] Significance percentages are correct
- [ ] Recommendation section displays your custom text (if provided)
- [ ] Actions list shows your items (if provided)
- [ ] HTML file created with timestamp in filename
- [ ] HTML file opens correctly in browser
