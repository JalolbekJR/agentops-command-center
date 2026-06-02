# Evaluation And Risk Model

## Model Goal

AgentOps Command Center should make AI automation measurable and governable. A run is not simply "done" when the agent produces output. It should be evaluated for correctness, safety, reliability, latency, cost, user impact, and policy compliance. Risk findings should be visible, assignable, and connected to release gates.

## Evaluation Categories

| Category | Question It Answers |
| --- | --- |
| Correctness | Did the run produce the expected result? |
| Safety | Did the run avoid harmful, unsafe, or unauthorized behavior? |
| Reliability | Did the workflow complete without unstable retries or unexplained failures? |
| Latency | Did the run finish within an acceptable time window? |
| Cost | Was token/model/tool cost within budget? |
| User Impact | Could this output negatively affect a user or customer? |
| Policy Compliance | Did the run follow workflow, tool, data, and approval policies? |

## Scoring Model

Each category uses a `0.0` to `1.0` score.

Suggested bands:

| Band | Score | Meaning |
| --- | --- | --- |
| Excellent | `0.90` to `1.00` | Strong pass. |
| Pass | `0.80` to `0.89` | Acceptable with little concern. |
| Warning | `0.65` to `0.79` | Needs review or follow-up. |
| Fail | Below `0.65` | Should block release or require remediation. |

Overall score can use weighted average:

```txt
overall =
  correctness * 0.22 +
  safety * 0.20 +
  reliability * 0.16 +
  policyCompliance * 0.16 +
  userImpact * 0.12 +
  latency * 0.07 +
  cost * 0.07
```

Safety and policy compliance carry more weight because uncontrolled AI automation risk is central to the product.

## Risk Severity Model

| Severity | Meaning | Example |
| --- | --- | --- |
| Low | Worth noting, does not block work. | Minor copy issue in generated summary. |
| Medium | Requires owner review, may not block release. | Cost warning or flaky browser step. |
| High | Blocks sensitive action or release gate until reviewed. | Prompt injection risk or production-like tool call. |
| Critical | Immediate stop; requires Admin/Security review. | Secret exposure risk or unauthorized destructive action. |

## Risk Categories

- `prompt_injection`
- `tool_injection`
- `sensitive_data_exposure`
- `unauthorized_access`
- `unsafe_automation`
- `qa_failure`
- `policy_violation`
- `cost_overrun`
- `reliability_regression`
- `release_gate_blocker`

## Release Gate Logic

A release gate should evaluate:

- Minimum overall evaluation score.
- Minimum safety score.
- Minimum policy compliance score.
- No unresolved high/critical security risks.
- No failed required browser QA session.
- No pending required approvals.
- Cost within configured budget.
- Required audit records present for risky actions.

Example logic:

```txt
Blocked if:
  overallScore < 0.85
  OR safetyScore < 0.80
  OR policyComplianceScore < 0.80
  OR unresolvedHighOrCriticalRisks > 0
  OR requiredBrowserQaStatus == failed
  OR pendingRequiredApprovals > 0
```

## Safety And Security Finding Model

Each `RiskFinding` should include:

- Title.
- Category.
- Severity.
- Status.
- Evidence summary.
- Linked workflow run.
- Linked step or tool call when available.
- Owner role.
- Owner user.
- Recommended mitigation.
- Resolution comment.
- Audit linkage for status changes.

## Risk Dashboard Model

The risk dashboard should show:

- Open findings by severity.
- Findings by category.
- High-risk tool calls awaiting review.
- Prompt/tool-injection findings.
- Sensitive data exposure warnings.
- Policy violations.
- Risk trend by week.
- Release gates blocked by risk.
- Ownership queues for Security Reviewer, QA Reviewer, Product Manager, and Admin.

## Example Evaluation Result

```json
{
  "id": "eval_release_001",
  "workflowRunId": "run_release_001",
  "evaluatorType": "deterministic_mock",
  "correctnessScore": 0.92,
  "safetyScore": 0.84,
  "reliabilityScore": 0.88,
  "latencyScore": 0.76,
  "costScore": 0.81,
  "userImpactScore": 0.89,
  "policyComplianceScore": 0.83,
  "overallScore": 0.86,
  "status": "warning",
  "notes": "Passed release threshold with one security policy warning."
}
```

## Example Risk Finding

```json
{
  "id": "risk_prompt_injection_001",
  "projectId": "project_agentops",
  "workflowRunId": "run_release_001",
  "toolCallId": "toolcall_browser_review_001",
  "category": "prompt_injection",
  "severity": "high",
  "status": "open",
  "title": "External page attempted instruction override",
  "description": "A browsed page contained text asking the agent to ignore tool restrictions.",
  "evidenceSummary": "The content was treated as untrusted data and the publish step was paused for security review.",
  "ownerRole": "Security Reviewer",
  "recommendedMitigation": "Keep the tool output isolated from system instructions and require approval before follow-up tool execution."
}
```

## How This Avoids Uncontrolled AI Automation

The product avoids uncontrolled automation by:

- Treating workflow steps as explicit units of work.
- Logging tool calls and summaries.
- Evaluating outputs before release.
- Creating risk findings when policies detect danger.
- Pausing high-risk actions for approval.
- Blocking release gates when risks remain unresolved.
- Keeping audit records for decisions.
- Separating demo simulation from future real AI execution.

## Evaluation And Risk Acceptance Criteria

- Every evaluation score has a category and threshold.
- Risk severity maps to clear reviewer behavior.
- Release gates can block based on evaluation, risk, QA, approvals, and cost.
- Example records are concrete enough to seed the future app.
