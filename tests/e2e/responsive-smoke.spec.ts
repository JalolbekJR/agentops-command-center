import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";

const screenshotRoot = join("test-results", "phase-3b4-elite-ux");

const responsiveRoutes = [
  "/dashboard",
  "/agents",
  "/agent-builder",
  "/built-in-agents",
  "/connectors",
  "/setup",
  "/plans",
  "/settings",
  "/runs",
  "/approvals",
  "/evaluations",
  "/risks",
  "/audit"
] as const;

const viewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "390x844", width: 390, height: 844 }
] as const;

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

function installBrowserErrorGuards(page: Page) {
  const issues: string[] = [];

  page.on("pageerror", (error) => {
    issues.push(`pageerror: ${error.name}: ${error.message}`);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      issues.push(`console error: ${message.text()}`);
    }
  });

  page.on("requestfailed", (request) => {
    const failure = request.failure();

    if (isLocalAppUrl(request.url()) && !isAbortedFrameworkPrefetch(request.url(), failure?.errorText)) {
      issues.push(`request failed: ${request.method()} ${request.url()} ${failure?.errorText ?? "unknown error"}`);
    }
  });

  page.on("response", (response) => {
    if (isLocalAppUrl(response.url()) && response.status() >= 400) {
      issues.push(`http ${response.status()}: ${response.url()}`);
    }
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

async function expectMainContentVisible(page: Page) {
  const main = page.locator("#app-main-scroll");

  await expect(main).toBeVisible();
  await expect.poll(async () => (await main.innerText()).trim().length).toBeGreaterThan(20);
}

async function expectNoPageOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const htmlOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const bodyOverflow = document.body.scrollWidth - window.innerWidth;
    const main = document.querySelector("main");
    const mainOverflow = main ? main.scrollWidth - main.clientWidth : 0;

    return {
      bodyOverflow,
      htmlOverflow,
      mainOverflow,
      maxOverflow: Math.max(htmlOverflow, bodyOverflow, mainOverflow)
    };
  });

  expect(overflow.maxOverflow, JSON.stringify(overflow)).toBeLessThanOrEqual(2);
}

async function expectNoDetectableClippedActions(page: Page) {
  const clippedActions = await page.evaluate(() => {
    function hasHorizontalScrollAncestor(element: HTMLElement) {
      let parent = element.parentElement;

      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);

        if (parent.scrollWidth > parent.clientWidth + 2 && ["auto", "scroll"].includes(style.overflowX)) {
          return true;
        }

        parent = parent.parentElement;
      }

      return false;
    }

    return Array.from(document.querySelectorAll<HTMLElement>("main a, main button"))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const isVisible = style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
        const isInsideViewport = rect.bottom >= 0 && rect.top <= window.innerHeight;
        const spillsHorizontally = rect.left < -2 || rect.right > window.innerWidth + 2;

        return isVisible && isInsideViewport && spillsHorizontally && !hasHorizontalScrollAncestor(element);
      })
      .map((element) => element.innerText.trim().replace(/\s+/g, " ").slice(0, 80));
  });

  expect(clippedActions).toEqual([]);
}

async function expectMobileDrawerWorks(page: Page) {
  const openNavButton = page.getByRole("button", { name: "Open navigation menu" });

  await expect(openNavButton).toBeVisible();
  await openNavButton.click();
  await expect(page.getByRole("dialog", { name: "Navigation menu" })).toBeVisible();
  await page.getByRole("button", { name: "Close navigation menu" }).last().click();
  await expect(page.getByRole("dialog", { name: "Navigation menu" })).toBeHidden();
}

function screenshotPath(route: string, viewportName: string) {
  const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");

  return join(screenshotRoot, `${viewportName}-${slug}.png`);
}

test.describe("responsive Phase 3B.4 smoke matrix", () => {
  for (const viewport of viewports) {
    for (const route of responsiveRoutes) {
      test(`${route} at ${viewport.name}`, async ({ page }) => {
        mkdirSync(screenshotRoot, { recursive: true });
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        const browserErrors = installBrowserErrorGuards(page);
        const response = await page.goto(route, { waitUntil: "domcontentloaded" });

        expect(response?.ok(), `${route} should return a successful document response`).toBe(true);
        await waitForRoleReady(page);
        await expect(roleTrigger(page)).toBeVisible();
        await expectMainContentVisible(page);
        await expectNoPageOverflow(page);
        await expectNoDetectableClippedActions(page);

        if (viewport.width < 1024) {
          await expectMobileDrawerWorks(page);
        }

        await page.screenshot({ path: screenshotPath(route, viewport.name) });
        await browserErrors.expectClean();
      });
    }
  }
});

test.describe("theme and mode screenshots", () => {
  const screenshots = [
    { name: "light-mode-dashboard", route: "/dashboard", theme: "light", mode: "professional", width: 1440, height: 900 },
    { name: "light-mode-agent-builder", route: "/agent-builder", theme: "light", mode: "professional", width: 1440, height: 900 },
    { name: "light-mode-connectors", route: "/connectors", theme: "light", mode: "professional", width: 1440, height: 900 },
    { name: "simple-mode-dashboard", route: "/dashboard", theme: "dark", mode: "simple", width: 1440, height: 900 },
    { name: "professional-mode-dashboard", route: "/dashboard", theme: "dark", mode: "professional", width: 1440, height: 900 },
    { name: "simple-mode-agent-builder", route: "/agent-builder", theme: "dark", mode: "simple", width: 1440, height: 900 },
    { name: "simple-mode-connectors", route: "/connectors", theme: "dark", mode: "simple", width: 1440, height: 900 },
    { name: "simple-mode-runs", route: "/runs", theme: "dark", mode: "simple", width: 1440, height: 900 }
  ] as const;

  for (const item of screenshots) {
    test(`${item.name}`, async ({ page }) => {
      mkdirSync(screenshotRoot, { recursive: true });
      await page.setViewportSize({ width: item.width, height: item.height });
      await page.addInitScript(
        ({ theme, mode }) => {
          window.localStorage.setItem("agentops-command-center:theme", theme);
          window.localStorage.setItem("agentops-command-center:ui-mode", mode);
        },
        { theme: item.theme, mode: item.mode }
      );

      const browserErrors = installBrowserErrorGuards(page);
      const response = await page.goto(item.route, { waitUntil: "domcontentloaded" });

      expect(response?.ok(), `${item.route} should return a successful document response`).toBe(true);
      await waitForRoleReady(page);
      await expectMainContentVisible(page);
      await expectNoPageOverflow(page);
      await page.screenshot({ path: join(screenshotRoot, `${item.name}.png`) });
      await browserErrors.expectClean();
    });
  }
});

test.describe("sidebar state screenshots", () => {
  const screenshots = [
    { name: "collapsed-sidebar-dashboard", collapsed: "true" },
    { name: "expanded-sidebar-dashboard", collapsed: "false" }
  ] as const;

  for (const item of screenshots) {
    test(`${item.name}`, async ({ page }) => {
      mkdirSync(screenshotRoot, { recursive: true });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.addInitScript(({ collapsed }) => {
        window.localStorage.setItem("agentops-command-center:sidebar-collapsed", collapsed);
      }, { collapsed: item.collapsed });

      const browserErrors = installBrowserErrorGuards(page);
      const response = await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

      expect(response?.ok(), "/dashboard should return a successful document response").toBe(true);
      await waitForRoleReady(page);
      await expectMainContentVisible(page);
      await expectNoPageOverflow(page);
      await page.screenshot({ path: join(screenshotRoot, `${item.name}.png`) });
      await browserErrors.expectClean();
    });
  }
});
