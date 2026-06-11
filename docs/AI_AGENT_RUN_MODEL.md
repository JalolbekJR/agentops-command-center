# AI Agent Run Model

## Model Goal

An AI agent run must be traceable, interruptible, evaluable, and replayable. The system should not treat the agent as a black box. Every run should have state, events, tool calls, approvals, evaluations, risk findings, and cost records that tell a coherent story.

## Core Concepts

- **Agent**: configured actor with capabilities, owner, risk level, and allowed tools.
- **Workflow**: graph of steps that coordinates agents, tools, approvals, evaluations, and release gates.
- **WorkflowRun**: one execution of a workflow.
- **RunEvent**: immutable timeline event emitted during the run.
- **ToolCall**: record of an agent/tool interaction.
- **ApprovalRequest**: human decision point that pauses or stops execution.
- **EvaluationResult**: scored quality and safety assessment.
- **RiskFinding**: issue that may require review, mitigation, or release blocking.

## Agent Run States

| State | Meaning |
| --- | --- |
| `queued` | Run is accepted but not started. |
| `running` | At least one step is actively executing. |
| `waiting_for_approval` | A policy or risk rule paused execution. |
| `evaluating` | Run output is being scored. |
| `passed` | Run completed and passed required checks. |
| `failed` | Run ended because a required step failed. |
| `rejected` | Human reviewer rejected an approval request. |
| `cancelled` | Authorized user cancelled the run. |

## Workflow Step States

| State | Meaning |
| --- | --- |
| `pending` | Step is waiting for dependencies. |
| `running` | Step is executing. |
| `waiting_for_approval` | Step produced or requires approval. |
| `passed` | Step completed successfully. |
| `failed` | Step failed and no retry remains. |
| `skipped` | Step was skipped by condition or prior failure. |
| `cancelled` | Step was cancelled with the run. |

## Tool Call States

| State | Meaning |
| --- | --- |
| `pending` | Tool call is planned but not started. |
| `running` | Tool call is executing. |
| `waiting_for_approval` | Tool call is paused before execution or before applying output. |
| `succeeded` | Tool call completed successfully. |
| `failed` | Tool call failed. |
| `blocked` | Policy blocked the tool call. |
| `redacted` | Details are hidden due to sensitivity or role. |

## Approval States

| State | Meaning |
| --- | --- |
| `pending` | Waiting for human decision. |
| `approved` | Reviewer allowed the run to continue. |
| `rejected` | Reviewer stopped the run or step. |
| `expired` | Request was not decided within the policy window. |
| `cancelled` | Request was cancelled because the run was cancelled or invalidated. |

## Failure States

Failure categories:

- `tool_error`: tool failed or returned invalid data.
- `policy_block`: policy rejected action before execution.
- `approval_rejected`: human reviewer rejected action.
- `evaluation_failed`: score below required threshold.
- `qa_failed`: browser QA or test gate failed.
- `timeout`: step exceeded allowed time.
- `dependency_failed`: upstream step failed.
- `cost_limit_exceeded`: budget or token limit exceeded.
- `security_risk`: high or critical risk blocked continuation.

Failure records should include:

- Failed step.
- Triggering event.
- Error code.
- Human-readable summary.
- Retry eligibility.
- Evidence links.
- Related risk or approval IDs.

## Retry Model

Retry rules should be explicit per step:

- Maximum attempts.
- Backoff strategy.
- Retryable failure categories.
- Non-retryable categories.
- Whether approval is required before retry.
- Whether retry creates a new tool call record.

Recommended demo retry policy:

```json
{
  "maxAttempts": 2,
  "backoff": "fixed",
  "delayMs": 1000,
  "retryableFailures": ["tool_error", "timeout"],
  "nonRetryableFailures": ["approval_rejected", "policy_block", "security_risk"]
}
```

## Deterministic Mock Run Model For Phase 1 And Early App Phases

The demo should use deterministic run records rather than random synthetic data.

Rules:

- Seed run IDs are stable.
- Event sequences are stable.
- Costs and token numbers are plausible and repeatable.
- Each run has a clear story: passed, failed, waiting, rejected, or blocked.
- Approval and audit records line up with run events.
- Evaluations and risk findings are derived from run outcomes.
- Browser QA sessions are linked to release gate decisions.

Example run story:

1. Release readiness workflow starts.
2. Browser QA agent checks dashboard route.
3. QA step passes with one accessibility note.
4. Risk scanner flags a high-risk external publish step.
5. Security approval request is created.
6. Security Reviewer approves for demo environment only.
7. Evaluation score passes threshold with warning.
8. Release gate remains warning, not blocked.
9. Audit log records approval and policy warning.

## Future Real AI Integration Boundaries

Future AI integration must use explicit boundaries:

- The model receives scoped context, not raw secrets.
- Tool calls require schema validation.
- Tool execution happens through a permission gate.
- Tool outputs are treated as data, not instructions.
- High-risk actions pause for approval.
- Cost and token usage are recorded.
- Run events capture decisions without exposing sensitive raw prompts.
- Evaluation runs after output generation.

## Why Runs Must Be Traceable And Replayable

Traceability matters because:

- Engineers need to debug failures.
- Security reviewers need evidence for risky decisions.
- Product managers need confidence in business-impacting outcomes.
- QA reviewers need repeatable release checks.
- Founders need to understand cost and reliability trends.
- Portfolio reviewers need to see real system design, not a superficial dashboard.

Replayability matters because:

- Failed runs can be explained step by step.
- Deterministic demo data supports screenshots and testing.
- Future backend can compare runs across versions.
- Evaluation regressions can be investigated.

## Run Model Acceptance Criteria

- Every run has a status, trace ID, start time, and timeline.
- Every tool call is linked to a run and step.
- Every approval decision is linked to a run and audit record.
- Every failure has a category and evidence.
- Every evaluation and risk finding can be traced back to a run.
