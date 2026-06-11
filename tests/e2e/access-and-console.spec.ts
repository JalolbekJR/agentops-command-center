import { expect, test, type Page } from "@playwright/test";

type RoleName = "Founder/Admin" | "AI Engineer" | "QA Reviewer" | "Security Reviewer" | "Product Manager" | "Viewer";

const appRoutes = [
  "/",
  "/dashboard",
  "/agents",
  "/workflows",
  "/runs",
  "/approvals",
  "/evaluations",
  "/risks",
  "/browser-qa",
  "/audit",
  "/setup",
  "/connectors",
  "/built-in-agents",
  "/agent-builder",
  "/plans",
  "/settings",
  "/owner-control"
] as const;

const failurePatterns = [
  /ChunkLoadError/i,
  /Hydration failed|hydration mismatch|Text content does not match server-rendered HTML/i,
  /favicon\.ico.*(?:404|not found)/i,
  /Content Security Policy|unsafe[\s-]?eval|violates the following Content Security Policy/i
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isLocalAppUrl(value: string) {
  try {
    const url = new URL(value);
    return ["127.0.0.1", "localhost"].includes(url.hostname) && url.port === "3000";
  } catch {
    return false;
  }
}

function isAbortedFrameworkPrefetch(value: string, errorText: string | undefined) {
  if (errorText !== "net::ERR_ABORTED") {
    return false;
  }

  try {
    const url = new URL(value);
    return url.searchParams.has("_rsc") || url.pathname.startsWith("/_next/static/chunks/");
  } catch {
    return false;
  }
}

function installBrowserErrorGuards(page: Page, { watchFailedRequests = true }: { watchFailedRequests?: boolean } = {}) {
  const issues: string[] = [];

  page.on("pageerror", (error) => {
    issues.push(`pageerror: ${error.name}: ${error.message}`);
  });

  page.on("console", (message) => {
    const text = message.text();

    if (message.type() === "error") {
      issues.push(`console error: ${text}`);
      return;
    }

    if (failurePatterns.some((pattern) => pattern.test(text))) {
      issues.push(`console signal: ${text}`);
    }
  });

  page.on("requestfailed", (request) => {
    const failure = request.failure();

    if (!watchFailedRequests || !isLocalAppUrl(request.url()) || isAbortedFrameworkPrefetch(request.url(), failure?.errorText)) {
      return;
    }

    issues.push(`request failed: ${request.method()} ${request.url()} ${failure?.errorText ?? "unknown error"}`);
  });

  page.on("response", (response) => {
    if (!isLocalAppUrl(response.url()) || response.status() < 400) {
      return;
    }

    issues.push(`http ${response.status()}: ${response.url()}`);
  });

  return {
    async expectClean() {
      expect(issues).toEqual([]);
    }
  };
}

function roleTrigger(page: Page) {
  return page.locator("#demo-role-switcher");
}

async function waitForRoleReady(page: Page) {
  await expect(roleTrigger(page)).toBeVisible();
  await expect(roleTrigger(page)).toBeEnabled();
  await expect(roleTrigger(page)).not.toContainText("Loading role");
}

async function expectMainContent(page: Page) {
  const main = page.locator("#app-main-scroll");
  await expect(main).toBeVisible();
  await expect.poll(async () => (await main.innerText()).trim().length).toBeGreaterThan(20);
}

async function selectRole(page: Page, role: RoleName) {
  await waitForRoleReady(page);
  await roleTrigger(page).click();
  await page.getByRole("option", { name: role, exact: true }).click();
  await expectCurrentRole(page, role);
}

async function expectCurrentRole(page: Page, role: RoleName) {
  await expect(roleTrigger(page)).toContainText(role);
}

async function expectNavItem(page: Page, label: string, expected: "visible" | "hidden") {
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  const item = nav.locator("a, [aria-disabled='true']").filter({ hasText: new RegExp(escapeRegExp(label)) });

  await expect(nav).toBeVisible();
  await expect(item).toHaveCount(expected === "visible" ? 1 : 0);
}

async function expectNoRestrictedHeadings(page: Page, labels: string[]) {
  const main = page.locator("main");

  for (const label of labels) {
    await expect(main.getByRole("heading", { name: new RegExp(escapeRegExp(label), "i") })).toHaveCount(0);
  }
}

test.describe("route, console, and page error audit", () => {
  for (const route of appRoutes) {
    test(`${route} loads without browser errors`, async ({ page }) => {
      const browserErrors = installBrowserErrorGuards(page);
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      expect(response?.ok(), `${route} should return a successful document response`).toBe(true);
      await waitForRoleReady(page);
      await expectMainContent(page);
      await browserErrors.expectClean();
    });
  }

  test("/favicon.ico returns 200", async ({ request }) => {
    const response = await request.get("/favicon.ico");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/x-icon");
  });
});

test.describe("role and access regressions through the UI", () => {
  test("Founder/Admin can access Owner Control and Agent Builder", async ({ page }) => {
    const browserErrors = installBrowserErrorGuards(page, { watchFailedRequests: false });

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await selectRole(page, "Founder/Admin");

    await page.goto("/owner-control", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/owner-control$/);
    await expect(page.getByRole("heading", { name: "Platform control plane for global product rules." })).toBeVisible();

    await page.goto("/agent-builder", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/agent-builder$/);
    await expect(page.getByRole("heading", { name: "Agent Builder Studio." })).toBeVisible();

    await expectNavItem(page, "Owner Control", "visible");
    await browserErrors.expectClean();
  });

  test("AI Engineer can use Agent Builder but not Owner Control", async ({ page }) => {
    const browserErrors = installBrowserErrorGuards(page, { watchFailedRequests: false });

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await selectRole(page, "AI Engineer");

    await page.goto("/agent-builder", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/agent-builder$/);
    await expect(page.getByRole("heading", { name: "Agent Builder Studio." })).toBeVisible();

    await page.goto("/owner-control", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/agent-builder$/);
    await expectCurrentRole(page, "AI Engineer");
    await expectNavItem(page, "Owner Control", "hidden");
    await expectNoRestrictedHeadings(page, ["Owner Control"]);
    await browserErrors.expectClean();
  });

  test("Viewer cannot access Owner Control or Agent Builder", async ({ page }) => {
    const browserErrors = installBrowserErrorGuards(page, { watchFailedRequests: false });

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await selectRole(page, "Viewer");

    await page.goto("/owner-control", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/dashboard$/);
    await expectCurrentRole(page, "Viewer");
    await expectNavItem(page, "Owner Control", "hidden");
    await expectNoRestrictedHeadings(page, ["Owner Control", "Agent Builder"]);

    await page.goto("/agent-builder", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/dashboard$/);
    await expectCurrentRole(page, "Viewer");
    await expectNavItem(page, "Agent Builder", "hidden");
    await expectNoRestrictedHeadings(page, ["Owner Control", "Agent Builder"]);
    await browserErrors.expectClean();
  });

  test("Product Manager can access packaging routes but not Owner Control", async ({ page }) => {
    const browserErrors = installBrowserErrorGuards(page, { watchFailedRequests: false });

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await selectRole(page, "Product Manager");

    await page.goto("/plans", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/plans$/);
    await expect(page.getByRole("heading", { name: "Commercial packaging without live billing." })).toBeVisible();

    await page.goto("/built-in-agents", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/built-in-agents$/);
    await expect(page.getByRole("heading", { name: "Governed agent modules marketplace." })).toBeVisible();

    await page.goto("/owner-control", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/plans$/);
    await expectCurrentRole(page, "Product Manager");
    await expectNavItem(page, "Owner Control", "hidden");
    await expectNoRestrictedHeadings(page, ["Owner Control"]);
    await browserErrors.expectClean();
  });

  test("role selection persists across reloads without resetting to Founder/Admin", async ({ page }) => {
    const browserErrors = installBrowserErrorGuards(page, { watchFailedRequests: false });

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await selectRole(page, "Viewer");
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRoleReady(page);
    await expectCurrentRole(page, "Viewer");

    await selectRole(page, "AI Engineer");
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRoleReady(page);
    await expectCurrentRole(page, "AI Engineer");
    await expect(roleTrigger(page)).not.toContainText("Founder/Admin");
    await browserErrors.expectClean();
  });
});
