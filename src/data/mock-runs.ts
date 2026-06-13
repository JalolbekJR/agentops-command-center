import type { RunEvent, ToolCall, WorkflowRun } from "@/types/domain";
import { activeProject } from "./mock-projects";

export const mockRuns: WorkflowRun[] = [
  {
    id: "run_release_001",
    projectId: activeProject.id,
    workflowId: "workflow_release_review",
    workflowVersion: 1,
    triggeredByUserId: "user_engineer",
    status: "waiting_for_approval",
    environment: "Local Demo",
    traceId: "trace_release_001",
    startedAt: "2026-06-02T10:30:00Z",
    totalCostCents: 42,
    summary: "Release review paused on a high-risk publish check awaiting Security Reviewer approval."
  },
  {
    id: "run_release_000",
    projectId: activeProject.id,
    workflowId: "workflow_release_review",
    workflowVersion: 1,
    triggeredByUserId: "user_pm",
    status: "passed",
    environment: "Local Demo",
    traceId: "trace_release_000",
    startedAt: "2026-06-02T08:10:00Z",
    completedAt: "2026-06-02T08:15:00Z",
    durationMs: 304000,
    totalCostCents: 35,
    summary: "Release review passed with one non-blocking evaluation warning."
  },
  {
    id: "run_debug_014",
    projectId: activeProject.id,
    workflowId: "workflow_agent_debug",
    workflowVersion: 2,
    triggeredByUserId: "user_engineer",
    status: "failed",
    environment: "Local Demo",
    traceId: "trace_debug_014",
    startedAt: "2026-06-02T09:20:00Z",
    completedAt: "2026-06-02T09:23:00Z",
    durationMs: 186000,
    totalCostCents: 27,
    failureReason: "Tool output failed policy validation.",
    summary: "Debug workflow failed after a tool output contained conflicting instructions."
  },
  {
    id: "run_cost_009",
    projectId: activeProject.id,
    workflowId: "workflow_cost_watch",
    workflowVersion: 1,
    triggeredByUserId: "user_admin",
    status: "running",
    environment: "Local Demo",
    traceId: "trace_cost_009",
    startedAt: "2026-06-02T10:48:00Z",
    totalCostCents: 12,
    summary: "Token budget watch is collecting local deterministic cost metrics."
  }
];

export const mockRunEvents: RunEvent[] = [
  {
    id: "event_release_001_001",
    workflowRunId: "run_release_001",
    stepId: "step_release_trigger",
    eventType: "run_started",
    severity: "info",
    message: "Release readiness review started for local demo candidate.",
    createdAt: "2026-06-02T10:30:00Z",
    sequence: 1
  },
  {
    id: "event_release_001_002",
    workflowRunId: "run_release_001",
    stepId: "step_browser_qa",
    eventType: "browser_step_completed",
    severity: "success",
    message: "Dashboard route loaded and navigation landmarks were detected.",
    createdAt: "2026-06-02T10:32:10Z",
    sequence: 2
  },
  {
    id: "event_release_001_003",
    workflowRunId: "run_release_001",
    stepId: "step_risk_scan",
    eventType: "risk_detected",
    severity: "warning",
    message: "External publish action requires security approval in the demo policy.",
    createdAt: "2026-06-02T10:34:12Z",
    sequence: 3
  },
  {
    id: "event_release_001_004",
    workflowRunId: "run_release_001",
    stepId: "step_security_approval",
    eventType: "approval_requested",
    severity: "warning",
    message: "Security approval request created for high-risk tool call.",
    createdAt: "2026-06-02T10:34:24Z",
    sequence: 4
  },
  {
    id: "event_debug_014_001",
    workflowRunId: "run_debug_014",
    stepId: "step_debug_trace",
    eventType: "run_started",
    severity: "info",
    message: "Debug workflow started from failed run report.",
    createdAt: "2026-06-02T09:20:00Z",
    sequence: 1
  },
  {
    id: "event_debug_014_002",
    workflowRunId: "run_debug_014",
    stepId: "step_debug_tool_calls",
    eventType: "tool_call_failed",
    severity: "error",
    message: "Tool output failed policy validation and created a tool-injection risk.",
    createdAt: "2026-06-02T09:22:41Z",
    sequence: 2
  },
  {
    id: "event_debug_014_003",
    workflowRunId: "run_debug_014",
    stepId: "step_debug_tool_calls",
    eventType: "run_failed",
    severity: "error",
    message: "Run failed because a non-retryable policy validation failure was detected.",
    createdAt: "2026-06-02T09:23:06Z",
    sequence: 3
  }
];

export const mockToolCalls: ToolCall[] = [
  {
    id: "toolcall_browser_review_001",
    workflowRunId: "run_release_001",
    stepId: "step_browser_qa",
    agentId: "agent_browser_qa",
    toolName: "browser_session_runner",
    inputSummary: "Review local dashboard route, approvals route, and responsive navigation.",
    outputSummary: "Core routes loaded. One empty-state note was recorded for approval context.",
    status: "succeeded",
    riskLevel: "medium",
    startedAt: "2026-06-02T10:31:15Z",
    completedAt: "2026-06-02T10:32:10Z",
    durationMs: 55000
  },
  {
    id: "toolcall_publish_check_001",
    workflowRunId: "run_release_001",
    stepId: "step_risk_scan",
    agentId: "agent_security_sentinel",
    toolName: "deployment_preflight_check",
    inputSummary: "Check whether publish action is allowed for the local demo release candidate.",
    outputSummary: "Policy requires security approval before any production-like publish action.",
    status: "waiting_for_approval",
    riskLevel: "high",
    approvalRequestId: "approval_security_001",
    startedAt: "2026-06-02T10:33:48Z"
  },
  {
    id: "toolcall_debug_summary_014",
    workflowRunId: "run_debug_014",
    stepId: "step_debug_tool_calls",
    agentId: "agent_security_sentinel",
    toolName: "tool_call_summarizer",
    inputSummary: "Summarize failed tool response without exposing sensitive payload values.",
    outputSummary: "Output contained conflicting instructions and was blocked by policy validation.",
    status: "failed",
    riskLevel: "high",
    startedAt: "2026-06-02T09:21:12Z",
    completedAt: "2026-06-02T09:22:41Z",
    durationMs: 89000,
    errorCode: "policy.tool_output_conflict"
  }
];
