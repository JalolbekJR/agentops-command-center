const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const request = globalThis.fetch;

const routes = [
  "/api/session",
  "/api/workspaces",
  "/api/projects",
  "/api/projects/project_agentops",
  "/api/projects/project_agentops/agents",
  "/api/projects/project_agentops/runs",
  "/api/projects/project_agentops/approvals",
  "/api/projects/project_agentops/risks",
  "/api/projects/project_agentops/evaluations",
  "/api/projects/project_agentops/audit",
  "/api/projects/project_agentops/usage",
  "/api/workspaces/team_ai_factory/entitlements",
  "/api/workspaces/team_ai_factory/plan-limits"
];

const forbiddenTerms = [
  "user_admin",
  "team_ai_factory",
  "project_agentops",
  "ownerUserId",
  "triggeredByUserId",
  "actorUserId",
  "assignedUserId",
  "assignedRoleId",
  "decidedByUserId",
  "traceId",
  "correlationId",
  "targetId",
  "toolCallId",
  "workflowId",
  "entitlementId",
  "workspaceId",
  "projectId",
  "email",
  "deterministic_seed"
];

function urlFor(path) {
  return new URL(path, baseUrl).toString();
}

async function readJson(route) {
  const response = await request(urlFor(route), {
    method: "GET",
    headers: {
      accept: "application/json"
    }
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(`${route} returned non-JSON content.`);
  }

  const body = await response.json();

  if (!response.ok) {
    throw new Error(`${route} returned HTTP ${response.status}.`);
  }

  return body;
}

function inspectBody(route, body) {
  const serialized = JSON.stringify(body);

  return forbiddenTerms
    .filter((term) => serialized.includes(term))
    .map((term) => ({
      route,
      reason: `response contains forbidden public term: ${term}`
    }));
}

async function main() {
  const failures = [];

  for (const route of routes) {
    try {
      const body = await readJson(route);
      failures.push(...inspectBody(route, body));
    } catch (error) {
      failures.push({
        route,
        reason: error instanceof Error ? error.message : "request failed"
      });
    }
  }

  if (failures.length > 0) {
    console.error("API exposure verification failed.");

    for (const failure of failures) {
      console.error(`- ${failure.route}: ${failure.reason}`);
    }

    process.exitCode = 1;
    return;
  }

  console.log(`API exposure verification passed for ${routes.length} read-only routes.`);
}

main().catch((error) => {
  console.error("API exposure verification failed.");
  console.error(error instanceof Error ? error.message : "unexpected error");
  process.exitCode = 1;
});
