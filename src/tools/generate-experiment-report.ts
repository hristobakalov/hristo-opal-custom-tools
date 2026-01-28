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
  optimizelyResultsJson: string; // Raw Optimizely results JSON
  hypothesis?: string;
  recommendationStatus?: string;
  recommendationTitle?: string;
  recommendationDescription?: string;
  actions?: string;
}

/**
 * Transforms Optimizely experiment results JSON into the format expected by the report API
 */
function transformOptimizelyResults(resultsJson: any): Partial<ExperimentData> {
  // Calculate date range and duration
  const startDate = new Date(resultsJson.start_time);
  const endDate = new Date(resultsJson.end_time);
  const durationDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const dateRange = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  const duration = `${durationDays} days`;

  // Extract metrics and transform them
  const metrics: Metric[] = resultsJson.metrics.map((metric: any) => {
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
    resultsJson.reach.variations
  ).map((variation: any) => ({
    name: variation.name,
    sampleSize: variation.count,
    description: variation.is_baseline
      ? "Original experience (Control)"
      : "Treatment variation",
  }));

  return {
    experimentId: String(resultsJson.experiment_id),
    dateRange,
    duration,
    sampleSize: resultsJson.reach.total_count,
    confidenceLevel: resultsJson.stats_config.confidence_level * 100,
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
  } = parameters;

  // Validate required fields
  if (!recipientEmail || !experimentName || !optimizelyResultsJson) {
    throw new Error(
      "recipientEmail, experimentName, and optimizelyResultsJson are required fields"
    );
  }

  // Parse Optimizely results JSON
  let resultsData: any;
  try {
    resultsData = JSON.parse(optimizelyResultsJson);
  } catch (error) {
    throw new Error(
      `Invalid Optimizely results JSON: ${error instanceof Error ? error.message : String(error)}`
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
        'Complete Optimizely experiment results JSON (from Stats API). Must include: experiment_id, start_time, end_time, metrics (with results), reach (with variations), and stats_config. The tool will automatically extract all necessary data including experiment ID, dates, sample sizes, metrics, and variations.',
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
  ],
})(generateExperimentReport);
