import type { RiskFinding } from "@/types/domain";
import { activeProject } from "@/data/mock-projects";

export const mockRisks: RiskFinding[] = [
  {
    id: "risk_prompt_injection_001",
    projectId: activeProject.id,
    workflowRunId: "run_release_001",
    toolCallId: "toolcall_publish_check_001",
    category: "prompt_injection",
    severity: "high",
    status: "open",
    title: "Approval-gated external publish instruction",
    description: "The run detected a production-like publish path and paused before execution.",
    evidenceSummary: "The tool output was summarized and held for Security Reviewer approval.",
    ownerRole: "Security Reviewer",
    ownerUserId: "user_security",
    recommendedMitigation: "Approve only for local demo scope or keep blocked until backend controls exist.",
    createdAt: "2026-06-02T10:34:12Z"
  },
  {
    id: "risk_tool_injection_014",
    projectId: activeProject.id,
    workflowRunId: "run_debug_014",
    toolCallId: "toolcall_debug_summary_014",
    category: "tool_injection",
    severity: "high",
    status: "triaged",
    title: "Tool output contained conflicting follow-up instructions",
    description: "The failed debug run surfaced a tool output that attempted to steer follow-up execution.",
    evidenceSummary: "The output was treated as data and blocked by policy validation.",
    ownerRole: "Security Reviewer",
    ownerUserId: "user_security",
    recommendedMitigation: "Keep tool outputs isolated from system instructions and require schema validation.",
    createdAt: "2026-06-02T09:22:41Z"
  },
  {
    id: "risk_browser_empty_state_003",
    projectId: activeProject.id,
    workflowRunId: "run_release_001",
    category: "qa_failure",
    severity: "medium",
    status: "open",
    title: "Approval empty state needs clearer reviewer context",
    description: "Browser QA noted that a future empty state should explain which role can act.",
    evidenceSummary: "The route loaded, but the reviewer guidance should be more specific.",
    ownerRole: "QA Reviewer",
    ownerUserId: "user_qa",
    recommendedMitigation: "Add role-aware empty-state copy in the approval queue.",
    createdAt: "2026-06-02T10:32:10Z"
  }
];
