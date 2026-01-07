import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";

interface ListEventsParameters {
  project_id?: string;
  include_classic?: boolean;
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

async function listEvents(
  parameters: ListEventsParameters,
  authData?: AuthData
) {
  const { project_id: paramProjectId, include_classic = false } = parameters;

  // Extract access token from authData
  const accessToken = authData?.credentials?.access_token;
  if (!accessToken) {
    throw new Error(
      "Authentication required. Please ensure OptiID authentication is configured."
    );
  }

  // Try to get project_id from context first, then fall back to parameter
  const projectIdStr =
    authData?.context?.project_id ||
    authData?.project_id ||
    (authData as any)?.projectId ||
    paramProjectId;

  if (!projectIdStr) {
    throw new Error(
      "project_id is required. Either provide it as a parameter or ensure it's available in the context when running from Optimizely."
    );
  }

  // Convert project_id to integer
  const project_id = parseInt(String(projectIdStr), 10);
  if (isNaN(project_id)) {
    throw new Error(
      `Invalid project_id: "${projectIdStr}". Must be a valid integer.`
    );
  }

  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      project_id: String(project_id),
    });

    if (include_classic) {
      queryParams.append("include_classic", "true");
    }

    const url = `https://api.optimizely.com/v2/events?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
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
        `Failed to list events: ${response.status} ${response.statusText}. ${
          typeof responseBody === "string"
            ? responseBody
            : JSON.stringify(responseBody)
        }`
      );
    }

    return {
      success: true,
      status: response.status,
      events: responseBody,
      count: Array.isArray(responseBody) ? responseBody.length : 0,
      message: `Successfully retrieved ${
        Array.isArray(responseBody) ? responseBody.length : 0
      } events for project ${project_id}`,
    };
  } catch (error) {
    throw new Error(
      `Failed to list Optimizely events: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

tool({
  name: "list_events",
  description:
    "Gets all Events for an Optimizely project. This includes all types of Events including Pageview Events which are stored as Pages. Requires OptiID authentication.",
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
        "The Optimizely project ID to list events for. Optional if running from Optimizely context (automatically detected from URL).",
      required: false,
    },
    {
      name: "include_classic",
      type: ParameterType.Boolean,
      description:
        "Set to true to include Goal objects from Optimizely Classic. Defaults to false.",
      required: false,
    },
  ],
})(listEvents);
