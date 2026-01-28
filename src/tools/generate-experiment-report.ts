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
  experimentId: string;
  experimentName: string;
  hypothesis: string;
  duration: string;
  dateRange: string;
  sampleSize: number;
  confidenceLevel: number;
  metrics: string; // JSON string of metrics array
  variations: string; // JSON string of variations array
  recommendationStatus: string;
  recommendationTitle: string;
  recommendationDescription: string;
  actions: string; // JSON string or comma-separated string of actions
}

async function generateExperimentReport(
  parameters: GenerateReportParameters
) {
  const {
    recipientEmail,
    experimentId,
    experimentName,
    hypothesis,
    duration,
    dateRange,
    sampleSize,
    confidenceLevel,
    metrics: metricsStr,
    variations: variationsStr,
    recommendationStatus,
    recommendationTitle,
    recommendationDescription,
    actions: actionsStr,
  } = parameters;

  // Validate required fields
  if (!recipientEmail || !experimentId || !experimentName) {
    throw new Error(
      "recipientEmail, experimentId, and experimentName are required fields"
    );
  }

  // Parse JSON strings
  let metrics: Metric[];
  let variations: Variation[];
  let actions: string[];

  try {
    metrics = JSON.parse(metricsStr);
  } catch (error) {
    throw new Error(
      `Invalid metrics JSON: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  try {
    variations = JSON.parse(variationsStr);
  } catch (error) {
    throw new Error(
      `Invalid variations JSON: ${error instanceof Error ? error.message : String(error)}`
    );
  }

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

  // Construct experiment data object
  const experimentData: ExperimentData = {
    experimentId,
    experimentName,
    hypothesis,
    duration,
    dateRange,
    sampleSize,
    confidenceLevel,
    metrics,
    variations,
    recommendation: {
      status: recommendationStatus,
      title: recommendationTitle,
      description: recommendationDescription,
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
    "Generates a PDF report summarizing experiment data and sends it to a specified email address. The report includes experiment metrics, variations, recommendations, and actionable insights.",
  parameters: [
    {
      name: "recipientEmail",
      type: ParameterType.String,
      description: "Email address where the report will be sent",
      required: true,
    },
    {
      name: "experimentId",
      type: ParameterType.String,
      description: "Unique identifier for the experiment",
      required: true,
    },
    {
      name: "experimentName",
      type: ParameterType.String,
      description: "Name of the experiment",
      required: true,
    },
    {
      name: "hypothesis",
      type: ParameterType.String,
      description: "The hypothesis being tested in the experiment",
      required: true,
    },
    {
      name: "duration",
      type: ParameterType.String,
      description: "Duration of the experiment (e.g., '14 days', '2 weeks')",
      required: true,
    },
    {
      name: "dateRange",
      type: ParameterType.String,
      description:
        "Date range when the experiment ran (e.g., 'Jan 1 - Jan 14, 2024')",
      required: true,
    },
    {
      name: "sampleSize",
      type: ParameterType.Number,
      description: "Total sample size (number of users/sessions in the test)",
      required: true,
    },
    {
      name: "confidenceLevel",
      type: ParameterType.Number,
      description:
        "Statistical confidence level as percentage (e.g., 95 for 95%)",
      required: true,
    },
    {
      name: "metrics",
      type: ParameterType.String,
      description:
        'JSON string array of metrics. Example: [{"name":"Conversion Rate","lift":"+5.2%","variations":[{"name":"Control","value":3.4,"significance":0},{"name":"Variation A","value":3.6,"significance":95}]}]',
      required: true,
    },
    {
      name: "variations",
      type: ParameterType.String,
      description:
        'JSON string array of variations. Example: [{"name":"Control","sampleSize":5000,"description":"Original experience"},{"name":"Variation A","sampleSize":5000,"description":"New button color"}]',
      required: true,
    },
    {
      name: "recommendationStatus",
      type: ParameterType.String,
      description:
        "Status of the recommendation (e.g., 'Winner', 'Inconclusive', 'Continue Testing')",
      required: true,
    },
    {
      name: "recommendationTitle",
      type: ParameterType.String,
      description:
        "Title of the recommendation (e.g., 'Deploy Variation A to 100% traffic')",
      required: true,
    },
    {
      name: "recommendationDescription",
      type: ParameterType.String,
      description:
        "Detailed description explaining the recommendation and reasoning",
      required: true,
    },
    {
      name: "actions",
      type: ParameterType.String,
      description:
        'JSON array or comma-separated string of next actions. Example: ["Deploy winning variation","Monitor performance for 30 days","Plan follow-up test"] or "Deploy winning variation, Monitor performance, Plan follow-up"',
      required: true,
    },
  ],
})(generateExperimentReport);
