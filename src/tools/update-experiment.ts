import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";

interface UpdateExperimentParameters {
  experiment_id: string;
  metrics?: string;
  [key: string]: any;
}

interface AuthData {
  provider?: string;
  credentials?: {
    access_token?: string;
    [key: string]: any;
  };
  context?: {
    project_id?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

async function updateExperiment(
  parameters: UpdateExperimentParameters,
  authData?: AuthData
) {
  const { experiment_id, metrics, ...otherFields } = parameters;

  // Extract access token from authData
  const accessToken = authData?.credentials?.access_token;
  if (!accessToken) {
    throw new Error(
      "Authentication required. Please ensure OptiID authentication is configured."
    );
  }

  // Convert experiment_id to integer
  const experimentId = parseInt(String(experiment_id), 10);
  if (isNaN(experimentId)) {
    throw new Error(
      `Invalid experiment_id: "${experiment_id}". Must be a valid integer.`
    );
  }

  // Build the request body with account_id
  const requestBody: any = {
    account_id: 22816830226,
    ...otherFields,
  };

  // Parse metrics if provided
  if (metrics) {
    try {
      const parsedMetrics = JSON.parse(metrics);

      // Apply defaults if not provided
      if (Array.isArray(parsedMetrics)) {
        requestBody.metrics = parsedMetrics.map((metric: any) => ({
          ...metric,
          aggregator: metric.aggregator || "unique",
          account_id: 22816830226,
          event_type: metric.event_type || "custom",
          scope: metric.scope || "visitor",
          winning_direction: metric.winning_direction || "increasing",
        }));
      } else {
        requestBody.metrics = parsedMetrics;
      }
    } catch (error) {
      throw new Error(
        `Invalid metrics JSON: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  try {
    const response = await fetch(
      `https://api.optimizely.com/v2/experiments/${experimentId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
        `Failed to update experiment: ${response.status} ${response.statusText}. ${
          typeof responseBody === "string"
            ? responseBody
            : JSON.stringify(responseBody)
        }`
      );
    }

    return {
      success: true,
      status: response.status,
      experiment: responseBody,
      message: `Successfully updated experiment ${experimentId}`,
    };
  } catch (error) {
    throw new Error(
      `Failed to update Optimizely experiment: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

tool({
  name: "update_experiment",
  description:
    "Updates an existing Optimizely experiment by its ID. Can be used to add or update metrics and other experiment properties. Requires OptiID authentication.",
  authRequirements: {
    provider: "OptiID",
    scopeBundle: "experiments",
    required: true,
  },
  parameters: [
    {
      name: "experiment_id",
      type: ParameterType.String,
      description: "The ID of the experiment to update",
      required: true,
    },
    {
      name: "metrics",
      type: ParameterType.String,
      description:
        'JSON string array of metrics to add/update. Example: [{"event_id":12345,"aggregator":"unique"}]. Each metric can have: event_id (required), event_type (optional: custom/click/pageview, defaults to "custom"), aggregator (optional: unique/count/sum/bounce/exit/ratio), scope (optional: session/visitor/event, defaults to "visitor"), winning_direction (optional: increasing/decreasing, defaults to "increasing"). Note: account_id is automatically set to 22816830226.',
      required: false,
    },
  ],
})(updateExperiment);
