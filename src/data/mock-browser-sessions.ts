import type { BrowserSession } from "@/types/domain";
import { activeProject } from "@/data/mock-projects";

export const mockBrowserSessions: BrowserSession[] = [
  {
    id: "browser_session_001",
    projectId: activeProject.id,
    workflowRunId: "run_release_001",
    status: "passed",
    targetUrl: "http://localhost:3000/dashboard",
    browserName: "chromium",
    viewport: "1440x900",
    startedAt: "2026-06-02T10:31:15Z",
    completedAt: "2026-06-02T10:32:10Z",
    summary: "Dashboard and navigation smoke checks passed with one role-context note.",
    steps: [
      {
        id: "browser_step_001",
        browserSessionId: "browser_session_001",
        sequence: 1,
        action: "Open dashboard",
        selectorSummary: "main dashboard route",
        expectedResult: "Dashboard overview renders deterministic metrics.",
        observedResult: "Dashboard rendered and key metrics were visible.",
        status: "passed",
        screenshotRef: "mock://screenshots/dashboard-overview",
        consoleIssueCount: 0,
        networkIssueCount: 0,
        accessibilityNote: "Landmarks present in the planned shell."
      },
      {
        id: "browser_step_002",
        browserSessionId: "browser_session_001",
        sequence: 2,
        action: "Open approvals",
        selectorSummary: "approvals navigation item",
        expectedResult: "Approval queue explains pending high-risk review.",
        observedResult: "Pending approval appeared with role-specific reviewer context.",
        status: "warning",
        screenshotRef: "mock://screenshots/approval-queue",
        consoleIssueCount: 0,
        networkIssueCount: 0,
        accessibilityNote: "Future button states must expose disabled reason to screen readers."
      }
    ]
  },
  {
    id: "browser_session_000",
    projectId: activeProject.id,
    workflowRunId: "run_release_000",
    status: "passed",
    targetUrl: "http://localhost:3000/runs",
    browserName: "chromium",
    viewport: "390x844",
    startedAt: "2026-06-02T08:11:00Z",
    completedAt: "2026-06-02T08:12:05Z",
    summary: "Mobile run timeline smoke check passed for the previous release review.",
    steps: [
      {
        id: "browser_step_000",
        browserSessionId: "browser_session_000",
        sequence: 1,
        action: "Open run timeline on mobile",
        selectorSummary: "run timeline list",
        expectedResult: "Timeline stacks without horizontal overflow.",
        observedResult: "Timeline summary stayed readable in a single column.",
        status: "passed",
        screenshotRef: "mock://screenshots/mobile-run-timeline",
        consoleIssueCount: 0,
        networkIssueCount: 0,
        accessibilityNote: "Timeline events need concise accessible labels in Phase 3."
      }
    ]
  }
];
