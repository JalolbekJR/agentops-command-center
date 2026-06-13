const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const request = globalThis.fetch;

const forbiddenResponseTerms = [
  "internalUserId",
  "internalWorkspaceId",
  "internalRoleId",
  "internalMembershipId",
  "deploymentGate",
  "permissions",
  "membership",
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
  "workspaceId",
  "projectId",
  "email",
  "deterministic_seed"
];

function urlFor(path) {
  return new URL(path, baseUrl).toString();
}

async function readJson(path) {
  const response = await request(urlFor(path), {
    method: "GET",
    headers: {
      accept: "application/json"
    }
  });
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(`${path} returned non-JSON content.`);
  }

  return {
    status: response.status,
    body: await response.json(),
    contentType
  };
}

function bodyText(body) {
  return JSON.stringify(body);
}

function hasMetaRequestId(body) {
  return (
    typeof body === "object" &&
    body !== null &&
    "meta" in body &&
    typeof body.meta === "object" &&
    body.meta !== null &&
    "requestId" in body.meta &&
    typeof body.meta.requestId === "string"
  );
}

function errorCode(body) {
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "object" &&
    body.error !== null &&
    "code" in body.error &&
    typeof body.error.code === "string"
  ) {
    return body.error.code;
  }

  return null;
}

function inspectExposure(name, body) {
  const serialized = bodyText(body);

  return forbiddenResponseTerms
    .filter((term) => serialized.includes(term))
    .map((term) => ({
      name,
      reason: `response contains forbidden auth-boundary term: ${term}`
    }));
}

async function expectStatus(name, path, expectedStatus, expectedCode) {
  const response = await readJson(path);
  const failures = [];

  if (response.status !== expectedStatus) {
    failures.push({
      name,
      reason: `expected HTTP ${expectedStatus}, received HTTP ${response.status}`
    });
  }

  if (!hasMetaRequestId(response.body)) {
    failures.push({
      name,
      reason: "response did not include a safe requestId envelope"
    });
  }

  if (expectedCode && errorCode(response.body) !== expectedCode) {
    failures.push({
      name,
      reason: `expected error code ${expectedCode}, received ${errorCode(response.body) ?? "none"}`
    });
  }

  failures.push(...inspectExposure(name, response.body));

  return failures;
}

async function main() {
  const failures = [];

  failures.push(...(await expectStatus("valid demo session read", "/api/session", 200)));
  failures.push(...(await expectStatus("valid project child read", "/api/projects/project_agentops/agents?limit=2", 200)));
  failures.push(...(await expectStatus("invalid project identifier", "/api/projects/invalid%20project", 400, "validation_invalid")));
  failures.push(...(await expectStatus("non-visible project", "/api/projects/project_missing", 404, "resource_not_found")));
  failures.push(...(await expectStatus("too-large limit", "/api/projects?limit=999", 400, "validation_invalid")));
  failures.push(...(await expectStatus("unknown query parameter", "/api/projects?unknown=1", 400, "validation_invalid")));
  failures.push(...(await expectStatus("duplicate query parameter", "/api/projects?limit=2&limit=3", 400, "validation_invalid")));

  if (failures.length > 0) {
    console.error("API auth boundary verification failed.");

    for (const failure of failures) {
      console.error(`- ${failure.name}: ${failure.reason}`);
    }

    process.exitCode = 1;
    return;
  }

  console.log("API auth boundary verification passed.");
}

main().catch((error) => {
  console.error("API auth boundary verification failed.");
  console.error(error instanceof Error ? error.message : "unexpected error");
  process.exitCode = 1;
});
