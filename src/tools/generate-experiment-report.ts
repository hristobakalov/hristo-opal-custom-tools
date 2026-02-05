import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";

interface MetricVariation {
  name: string;
  value: number;
  significance: number;
}

interface Metric {
  name: string;
  lift: string;
  variations: MetricVariation[];
}

interface Variation {
  name: string;
  sampleSize: number;
  description: string;
}

interface Recommendation {
  status: string;
  title: string;
  description: string;
}

interface ExperimentData {
  experimentId: string;
  experimentName: string;
  hypothesis: string;
  duration: string;
  dateRange: string;
  sampleSize: number;
  confidenceLevel: number;
  metrics: Metric[];
  variations: Variation[];
  recommendation: Recommendation;
  actions: string[];
}

interface GenerateReportParameters {
  recipientEmail: string;
  experimentName: string;
  optimizelyResultsJson: string | any; // Raw Optimizely results JSON (can be string or already parsed object)
  hypothesis?: string;
  recommendationStatus?: string;
  recommendationTitle?: string;
  recommendationDescription?: string;
  actions?: string;
  supabaseApiKey?: string; // Optional Supabase anon key
}

/**
 * Attempts to fix common JSON formatting issues
 */
function fixCommonJsonIssues(jsonString: string): string {
  let fixed = jsonString;

  // Remove trailing commas before closing brackets/braces
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

  // Try to balance braces
  const openBraces = (fixed.match(/{/g) || []).length;
  const closeBraces = (fixed.match(/}/g) || []).length;

  if (openBraces < closeBraces) {
    // Too many closing braces - remove extras from the end
    const diff = closeBraces - openBraces;
    console.log(`Detected ${diff} extra closing brace(s), attempting to fix...`);
    for (let i = 0; i < diff; i++) {
      const lastCloseBrace = fixed.lastIndexOf('}');
      if (lastCloseBrace > -1) {
        fixed = fixed.substring(0, lastCloseBrace) + fixed.substring(lastCloseBrace + 1);
      }
    }
  }

  // Try to balance brackets
  const openBrackets = (fixed.match(/\[/g) || []).length;
  const closeBrackets = (fixed.match(/\]/g) || []).length;

  if (openBrackets < closeBrackets) {
    const diff = closeBrackets - openBrackets;
    console.log(`Detected ${diff} extra closing bracket(s), attempting to fix...`);
    for (let i = 0; i < diff; i++) {
      const lastCloseBracket = fixed.lastIndexOf(']');
      if (lastCloseBracket > -1) {
        fixed = fixed.substring(0, lastCloseBracket) + fixed.substring(lastCloseBracket + 1);
      }
    }
  }

  return fixed;
}

/**
 * Transforms Optimizely experiment results JSON into the format expected by the report API
 */
function transformOptimizelyResults(resultsJson: any): Partial<ExperimentData> {
  // Handle nested structure: if resultsJson has 'results' property, extract stats data from it
  let statsData = resultsJson;

  if (resultsJson.results && typeof resultsJson.results === 'object') {
    console.log("Detected nested structure with 'results' property, extracting stats data...");
    statsData = resultsJson.results;
  }

  // Validate required fields
  const requiredFields = ['experiment_id', 'start_time', 'end_time', 'metrics', 'reach', 'stats_config'];
  const missingFields = requiredFields.filter(field => !statsData[field]);

  if (missingFields.length > 0) {
    console.error("Missing required fields:", missingFields);
    console.error("Available fields in statsData:", Object.keys(statsData));
    throw new Error(
      `Missing required fields in Optimizely results: ${missingFields.join(', ')}. ` +
      `Available fields: ${Object.keys(statsData).join(', ')}. ` +
      `Please ensure you're sending the complete Optimizely Stats API response.`
    );
  }

  // Calculate date range and duration
  const startDate = new Date(statsData.start_time);
  const endDate = new Date(statsData.end_time);
  const durationDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const dateRange = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  const duration = `${durationDays} days`;

  // Extract metrics and transform them
  const metrics: Metric[] = (statsData.metrics || []).map((metric: any) => {
    const variations: MetricVariation[] = [];
    const results = metric.results;

    // Process each variation
    Object.keys(results).forEach((variationId) => {
      const result = results[variationId];
      variations.push({
        name: result.name,
        value: result.rate * 100, // Convert to percentage
        significance: result.lift ? result.lift.significance * 100 : 0,
      });
    });

    // Find the best lift value for the metric
    const liftValues = Object.values(results)
      .filter((r: any) => r.lift)
      .map((r: any) => r.lift.value);
    const bestLift =
      liftValues.length > 0 ? Math.max(...(liftValues as number[])) : 0;
    const liftStr = bestLift > 0 ? `+${(bestLift * 100).toFixed(1)}%` : "N/A";

    return {
      name: metric.name,
      lift: liftStr,
      variations: variations,
    };
  });

  // Extract variations from reach data
  const variations: Variation[] = Object.values(
    statsData.reach.variations
  ).map((variation: any) => ({
    name: variation.name,
    sampleSize: variation.count,
    description: variation.is_baseline
      ? "Original experience (Control)"
      : "Treatment variation",
  }));

  return {
    experimentId: String(statsData.experiment_id),
    dateRange,
    duration,
    sampleSize: statsData.reach.total_count,
    confidenceLevel: statsData.stats_config.confidence_level * 100,
    metrics,
    variations,
  };
}

async function generateExperimentReport(
  parameters: GenerateReportParameters
) {
  const {
    recipientEmail,
    experimentName,
    optimizelyResultsJson,
    hypothesis,
    recommendationStatus,
    recommendationTitle,
    recommendationDescription,
    actions: actionsStr,
    supabaseApiKey,
  } = parameters;

  // Validate required fields
  if (!recipientEmail || !experimentName || !optimizelyResultsJson) {
    throw new Error(
      "recipientEmail, experimentName, and optimizelyResultsJson are required fields"
    );
  }

  // Parse Optimizely results JSON
  let resultsData: any;

  // Check if optimizelyResultsJson is already an object or a string
  if (typeof optimizelyResultsJson === 'object' && optimizelyResultsJson !== null) {
    // Already parsed
    resultsData = optimizelyResultsJson;
  } else if (typeof optimizelyResultsJson === 'string') {
    // Need to parse the string
    try {
      resultsData = JSON.parse(optimizelyResultsJson);
    } catch (error) {
      console.log("Initial JSON parse failed, attempting to fix common issues...");

      // Try to fix common JSON issues and parse again
      try {
        const fixedJson = fixCommonJsonIssues(optimizelyResultsJson);
        resultsData = JSON.parse(fixedJson);
        console.log("✓ Successfully parsed JSON after automatic fixes");
      } catch (secondError) {
        // Still failed, provide detailed error
        const errorMsg = error instanceof Error ? error.message : String(error);
        const match = errorMsg.match(/position (\d+)/);
        const position = match ? parseInt(match[1]) : 0;

        // Show context around the error
        let context = '';
        if (position > 0 && optimizelyResultsJson.length > 0) {
          const start = Math.max(0, position - 50);
          const end = Math.min(optimizelyResultsJson.length, position + 50);
          context = `\n\nError context: ...${optimizelyResultsJson.substring(start, end)}...`;
        }

        throw new Error(
          `Invalid Optimizely results JSON: ${errorMsg}${context}\n\nTried automatic fixes but still failed. Please ensure the JSON is properly formatted and escaped.`
        );
      }
    }
  } else {
    throw new Error(
      `Invalid optimizelyResultsJson type. Expected string or object, got ${typeof optimizelyResultsJson}`
    );
  }

  // Transform Optimizely results to experiment data format
  const transformedData = transformOptimizelyResults(resultsData);

  // Parse actions if provided
  let actions: string[];
  if (actionsStr) {
    try {
      // Try parsing as JSON first, fall back to comma-separated string
      if (actionsStr.startsWith("[")) {
        actions = JSON.parse(actionsStr);
      } else {
        actions = actionsStr.split(",").map((a) => a.trim());
      }
    } catch (error) {
      throw new Error(
        `Invalid actions format: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } else {
    // Default actions based on experiment results
    actions = [
      "Review detailed results in the dashboard",
      "Plan follow-up experiments",
      "Document learnings for future tests",
    ];
  }

  // Construct experiment data object
  const experimentData: ExperimentData = {
    experimentId: transformedData.experimentId!,
    experimentName,
    hypothesis: hypothesis || "No hypothesis provided",
    duration: transformedData.duration!,
    dateRange: transformedData.dateRange!,
    sampleSize: transformedData.sampleSize!,
    confidenceLevel: transformedData.confidenceLevel!,
    metrics: transformedData.metrics!,
    variations: transformedData.variations!,
    recommendation: {
      status: recommendationStatus || "Under Review",
      title: recommendationTitle || "Results require further analysis",
      description:
        recommendationDescription ||
        "Based on the experiment results, further analysis is recommended before making a final decision.",
    },
    actions,
  };

  // Get API key from parameter or environment variable
  const apiKey = supabaseApiKey || process.env.SUPABASE_ANON_KEY;

  if (!apiKey) {
    throw new Error(
      "Supabase API key is required. Either provide 'supabaseApiKey' parameter or set SUPABASE_ANON_KEY environment variable."
    );
  }

  // Construct request body
  const requestBody = {
    recipientEmail,
    experimentData,
  };

  try {
    const response = await fetch(
      "https://mjjlumqjnsqkgforfhdw.supabase.co/functions/v1/generate-report",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let responseBody: any;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        responseBody = await response.json();
      } catch {
        responseBody = await response.text();
      }
    } else {
      responseBody = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        `Failed to generate report: ${response.status} ${response.statusText}. ${
          typeof responseBody === "string"
            ? responseBody
            : JSON.stringify(responseBody)
        }`
      );
    }

    // Extract report information from response
    const { reportId, pdfUrl, message } = responseBody;

    // Construct report page URL
    const reportPageUrl = `https://id-preview--7eb40827-8f66-4c20-a834-b5cfbf929d7e.lovable.app/report/${reportId}`;

    return {
      success: true,
      reportId,
      pdfUrl,
      reportPageUrl,
      message,
      fullResponse: responseBody,
    };
  } catch (error) {
    throw new Error(
      `Failed to generate experiment report: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

tool({
  name: "generate_experiment_report",
  description:
    "Generates a PDF report from Optimizely experiment results and sends it to a specified email address. Automatically transforms Optimizely results JSON into a formatted report with metrics, variations, and recommendations.",
  parameters: [
    {
      name: "recipientEmail",
      type: ParameterType.String,
      description: "Email address where the report will be sent",
      required: true,
    },
    {
      name: "experimentName",
      type: ParameterType.String,
      description: "Name of the experiment for the report title",
      required: true,
    },
    {
      name: "optimizelyResultsJson",
      type: ParameterType.String,
      description:
        'Complete Optimizely experiment results (from Stats API). Can be either a JSON string OR a JavaScript object (preferred). Must include: experiment_id, start_time, end_time, metrics (with results), reach (with variations), and stats_config. The tool will automatically extract all necessary data. If sending as a string, ensure it is valid JSON without string concatenation.',
      required: true,
    },
    {
      name: "hypothesis",
      type: ParameterType.String,
      description:
        "Optional: The hypothesis being tested in the experiment. If not provided, defaults to 'No hypothesis provided'",
      required: false,
    },
    {
      name: "recommendationStatus",
      type: ParameterType.String,
      description:
        "Optional: Status of the recommendation (e.g., 'Winner', 'Inconclusive', 'Continue Testing'). Defaults to 'Under Review'",
      required: false,
    },
    {
      name: "recommendationTitle",
      type: ParameterType.String,
      description:
        "Optional: Title of the recommendation (e.g., 'Deploy Variation A to 100% traffic'). Defaults to generic message",
      required: false,
    },
    {
      name: "recommendationDescription",
      type: ParameterType.String,
      description:
        "Optional: Detailed description explaining the recommendation and reasoning. Defaults to generic message",
      required: false,
    },
    {
      name: "actions",
      type: ParameterType.String,
      description:
        'Optional: JSON array or comma-separated string of next actions. Example: ["Deploy winning variation","Monitor performance for 30 days"] or "Deploy winning variation, Monitor performance". Defaults to generic actions if not provided',
      required: false,
    },
    {
      name: "supabaseApiKey",
      type: ParameterType.String,
      description:
        "Optional: Supabase anon API key for authentication. If not provided, will use SUPABASE_ANON_KEY environment variable. Required for the report generation service to work.",
      required: false,
    },
  ],
})(generateExperimentReport);
