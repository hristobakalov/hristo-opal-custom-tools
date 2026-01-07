import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";

interface CreateExperimentParameters {
  project_id?: string;
  name: string;
  description: string;
  edit_url?: string;
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
    name,
    description,
    edit_url,
    status = "not_started",
    type = "a/b",
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
  const projectIdStr = authData?.context?.project_id || paramProjectId;
  if (!projectIdStr) {
    throw new Error(
      "project_id is required. Either provide it as a parameter or ensure it's available in the context when running from Optimizely."
    );
  }

  // Convert project_id to integer (API requires integer type)
  const project_id = parseInt(String(projectIdStr), 10);
  if (isNaN(project_id)) {
    throw new Error(
      `Invalid project_id: "${projectIdStr}". Must be a valid integer.`
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
    // Default variations with 50/50 traffic split
    parsedVariations = [
      {
        name: "Original",
        weight: 5000,
        totalTraffic: 50,
        percentage: 50,
        actions: [],
      },
      {
        name: "Variation #1",
        weight: 5000,
        totalTraffic: 50,
        percentage: 50,
        actions: [],
      },
    ];
  }

  // Construct the request body
  const requestBody: any = {
    project_id,
    name,
    description,
    status,
    type,
    variations: parsedVariations,
  };

  // Add url_targeting with edit_url if provided (optional field)
  if (edit_url) {
    requestBody.url_targeting = {
      edit_url: edit_url,
    };
  }

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
      name: "name",
      type: ParameterType.String,
      description: "Name of the experiment",
      required: true,
    },
    {
      name: "description",
      type: ParameterType.String,
      description: "Description/hypothesis of the experiment",
      required: true,
    },
    {
      name: "edit_url",
      type: ParameterType.String,
      description: "Optional URL where the experiment can be edited (e.g., the page URL being tested)",
      required: false,
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
      description: "Experiment type (a/b, multivariate, multipage). Defaults to 'a/b'",
      required: false,
    },
    {
      name: "variations",
      type: ParameterType.String,
      description:
        'Optional JSON string array of variations with traffic allocation. If not provided, defaults to 50/50 split between "Original" and "Variation #1". Example: [{"name":"Original","weight":5000,"totalTraffic":50,"percentage":50,"actions":[]},{"name":"Variation #1","weight":5000,"totalTraffic":50,"percentage":50,"actions":[]}]',
      required: false,
    },
  ],
})(createExperiment);
