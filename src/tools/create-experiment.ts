import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";

interface CreateExperimentParameters {
  project_id?: string;
  description: string;
  experiment_name: string;
  status?: string;
  type?: string;
  variations?: string;
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

async function createExperiment(
  parameters: CreateExperimentParameters,
  authData?: AuthData
) {
  const {
    project_id: paramProjectId,
    description,
    experiment_name,
    status = "not_started",
    type = "ab",
    variations,
  } = parameters;

  // Extract access token from authData
  const accessToken = authData?.credentials?.access_token;
  if (!accessToken) {
    throw new Error(
      "Authentication required. Please ensure OptiID authentication is configured."
    );
  }

  // Try to get project_id from context first, then fall back to parameter
  const project_id = authData?.context?.project_id || paramProjectId;
  if (!project_id) {
    throw new Error(
      "project_id is required. Either provide it as a parameter or ensure it's available in the context when running from Optimizely."
    );
  }

  // Parse variations if provided, otherwise create default variations
  let parsedVariations: any[];
  if (variations) {
    try {
      parsedVariations = JSON.parse(variations);
    } catch (error) {
      throw new Error(
        `Invalid variations JSON: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } else {
    // Default variations with control and variation
    parsedVariations = [
      {
        name: "Original",
        actions: [],
      },
      {
        name: "Variation 1",
        actions: [],
      },
    ];
  }

  // Construct the request body
  const requestBody = {
    project_id,
    status,
    description,
    type,
    edit_url: experiment_name, // Using experiment_name as edit_url
    variations: parsedVariations,
  };

  try {
    const response = await fetch("https://api.optimizely.com/v2/experiments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

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
        `Failed to create experiment: ${response.status} ${response.statusText}. ${
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
      message: `Experiment created successfully with ID: ${responseBody.id || "unknown"}`,
    };
  } catch (error) {
    throw new Error(
      `Failed to create Optimizely experiment: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

tool({
  name: "create_experiment",
  description:
    "Creates a new A/B experiment in Optimizely Web Experimentation using the REST API. Requires OptiID authentication.",
  authRequirements: {
    provider: "OptiID",
    scopeBundle: "experiments",
    required: true,
  },
  parameters: [
    {
      name: "project_id",
      type: ParameterType.String,
      description:
        "The Optimizely project ID where the experiment will be created. Optional if running from Optimizely context (automatically detected from URL).",
      required: false,
    },
    {
      name: "description",
      type: ParameterType.String,
      description: "Description of the experiment",
      required: true,
    },
    {
      name: "experiment_name",
      type: ParameterType.String,
      description: "Name/identifier for the experiment",
      required: true,
    },
    {
      name: "status",
      type: ParameterType.String,
      description:
        "Experiment status (not_started, running, paused, archived). Defaults to 'not_started'",
      required: false,
    },
    {
      name: "type",
      type: ParameterType.String,
      description: "Experiment type (ab, multivariate, multipage). Defaults to 'ab'",
      required: false,
    },
    {
      name: "variations",
      type: ParameterType.String,
      description:
        'Optional JSON string array of variations. Example: [{"name":"Original","actions":[]},{"name":"Variation 1","actions":[]}]',
      required: false,
    },
  ],
})(createExperiment);
