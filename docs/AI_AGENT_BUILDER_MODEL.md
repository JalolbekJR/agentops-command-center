# AI Agent Builder Model

## Goal

The AI Agent Builder should feel like a real creation studio while remaining a local deterministic foundation in Phase 3A. It guides users through choosing a template, connection method, capabilities, targets, approval gates, privacy mode, plan limits, workflow outline, and future safe test.

No real AI generation, external calls, code generation, or agent execution exists in this phase.

## Builder Steps

1. Choose agent template.
2. Select connection method.
3. Configure capabilities/tools.
4. Set allowed targets and environment.
5. Configure approval gates and risk controls.
6. Select usage limits/plan.
7. Review generated workflow outline.
8. Future: run safe test.

## Recommended First Path

Website QA Agent is the recommended first template:

- Visible in review.
- Safe on local/demo targets.
- Maps to BrowserSession, RunEvent, EvaluationResult, RiskFinding, CostMetric, and AuditLog.
- Valuable for a real demo later.

## Builder Rules

- Show plan locks clearly.
- Show required permissions.
- Show privacy/security mode.
- Show owner-only vs workspace-level boundaries.
- Keep future backend enforcement visible but not over-explained.
- Never imply a real agent was created or executed in Phase 3A.

## Phase 3B UX Rules

The Agent Builder is now modeled as a creation studio:

- Step navigation is visible.
- Templates are selectable.
- Website QA Agent is the recommended first build.
- Role locks and plan locks are visible before actions.
- Read-only roles can preview templates without creating drafts.
- Viewer receives a locked page.
- A live preview shows generated workflow outline, Native Protocol event categories, safe targets, approval gates, usage estimate, and final summary.

Execution is still not implemented. The UI creates no real agents, connectors, workers, browser sessions, or external calls.

## Output Model

The builder should produce a review summary with:

- Selected template.
- Connection method.
- Capabilities.
- Allowed targets.
- Approval gates.
- Privacy mode.
- Usage limits.
- Generated workflow outline.
- Future safe test summary.

## Future Backend Requirements

- Persist builder drafts.
- Validate connector/plan/server-side RBAC.
- Generate workflow drafts.
- Run safe tests through workers.
- Write audit logs for agent creation and connector changes.
