# QA Test Plan

## QA Goal

AgentOps Command Center should be tested like a real product, even while it starts as a deterministic portfolio demo. The test strategy should prove that the domain model, role behavior, workflow timelines, approval decisions, evaluation/risk logic, and UI states remain understandable and reliable as the app grows.

## Phase 1 Scope

Phase 1 has no runnable app, so verification is documentation-focused:

- Confirm all requested docs exist.
- Confirm docs are consistent about scope and phase.
- Confirm no package installation or app scaffold was added.
- Confirm security and RBAC decisions are documented before implementation.

## Future Testing Strategy

| Test Type | Purpose |
| --- | --- |
| Unit tests | Validate pure domain logic such as run status transitions, risk scoring, permission checks, and filters. |
| Component tests | Verify UI components render states correctly. |
| Integration tests | Verify route-level flows across mock data and local state. |
| Browser QA | Validate real user flows, responsiveness, and accessibility behavior in the browser. |
| Security review | Check RBAC, secret handling, unsafe actions, and audit behavior. |
| Performance checks | Keep dashboards responsive as mock data grows. |
| Manual QA | Validate product story, copy, visual polish, and role-specific workflows. |

## Unit Test Targets

Future unit tests should cover:

- Permission checks by role and feature.
- Approval authorization.
- Run state transitions.
- Step dependency validation.
- Workflow graph cycle detection.
- Risk severity mapping.
- Evaluation score calculation.
- Release gate status calculation.
- Cost aggregation.
- Filter and search utilities.
- Timeline event sorting by sequence.
- Redaction rules for sensitive tool details.

Example assertions:

- Viewer cannot approve any request.
- Security Reviewer can resolve high-risk security findings.
- Release gate is blocked when unresolved high risk exists.
- A rejected approval moves run status to `rejected`.
- A workflow graph with a cycle is invalid.

## Component Test Targets

Future component tests should cover:

- Metric cards with loading, empty, warning, and failed states.
- Role switcher behavior.
- Status badges and severity badges.
- Agent table filters.
- Workflow run timeline.
- Tool call drawer with redacted and full-detail modes.
- Approval request card for authorized and unauthorized roles.
- Evaluation score display.
- Risk finding row.
- Browser QA session step list.
- Audit log table.
- Empty states.
- Error callouts.
- Confirmation dialogs.

## Integration Test Targets

Future integration tests should cover:

- Dashboard loads seeded metrics.
- Switching roles changes visible actions.
- Agent registry links to agent detail.
- Workflow run detail shows timeline, tool calls, approvals, evaluations, and risks.
- Approval decision updates local approval status, run status, and audit log.
- Rejected approval marks the related run as rejected.
- Release gate status reflects evaluation, QA, risk, and approval inputs.
- Browser QA session detail displays steps and issue counts.
- Cost summary changes when filtering by agent or workflow.

## Browser QA Plan

When the app is runnable, use browser QA for:

- Desktop viewport: 1440x900.
- Tablet viewport: 1024x768.
- Mobile viewport: 390x844.
- Route smoke tests for every primary navigation item.
- Role switcher interaction.
- Approval approve/reject flow.
- Run detail timeline scanning.
- Risk dashboard filtering.
- Browser QA session detail view.
- Audit log visibility by role.

Checks:

- No blank pages.
- No overlapping text.
- Sidebar and navigation remain usable.
- Tables degrade gracefully on mobile.
- Focus states are visible.
- Important actions have accessible names.
- Screenshots show professional visual hierarchy.

## Accessibility Checks

Manual and automated checks should include:

- Semantic page headings.
- Keyboard navigation.
- Visible focus ring.
- Dialog focus management.
- Color contrast for text and status badges.
- Accessible names for icon buttons.
- Form labels.
- Reduced-motion support.
- Error messages associated with controls.
- No color-only status communication.

## Security Review Checklist

- [ ] No secrets in repo.
- [ ] No `.env` created without request.
- [ ] Demo role switcher clearly not treated as production auth.
- [ ] Server-side RBAC planned for future backend.
- [ ] Approval decisions audited.
- [ ] High-risk actions require explicit approval.
- [ ] Sensitive tool details redacted by role.
- [ ] Secret references contain metadata only.
- [ ] Prompt injection and tool injection risks represented.
- [ ] Browser automation targets restricted by future environment boundary.

## Performance Checks

Future checks:

- Dashboard renders smoothly with expanded seed data.
- Timeline handles at least hundreds of events without layout jank.
- Tables paginate or virtualize when data grows.
- Filtering does not block input.
- Charts render without unnecessary reflow.
- Images/screenshots are optimized or placeholder-only in early phases.
- Bundle size is reviewed once dependencies exist.

## Release Gate Checklist

A future release should be blocked when:

- Build fails.
- Typecheck fails.
- Lint fails.
- Unit tests fail.
- Browser QA route smoke tests fail.
- Critical accessibility issues exist.
- Unresolved high/critical risk findings exist.
- Required approvals are pending.
- Release gate override lacks audit reason.

## Manual QA Checklist

- [ ] Product purpose is clear from README and dashboard.
- [ ] Role switcher changes available actions.
- [ ] Dashboard metrics line up with seeded data.
- [ ] Agent registry has realistic records.
- [ ] Workflow run timeline tells a clear story.
- [ ] Approval queue shows context and risk.
- [ ] Evaluation and risk dashboards are connected to runs.
- [ ] Browser QA sessions include steps and findings.
- [ ] Audit log includes high-risk decisions.
- [ ] Empty/loading/error states are domain-specific.
- [ ] Mobile layout is usable.
- [ ] Copy avoids fake production claims.

## Future CI Plan

Once an app exists:

1. Install dependencies only after approval.
2. Add `lint`, `typecheck`, `test`, and `build` scripts.
3. Add route smoke tests after the UI shell exists.
4. Add browser QA screenshot checks for critical views.
5. Add accessibility checks.
6. Add security-focused tests for RBAC and redaction.
7. Require all checks before deployment or portfolio screenshots.

## Phase Acceptance Criteria

- Phase 1: docs complete, consistent, and honest.
- Phase 2: scaffold builds and route structure exists.
- Phase 3: app shell and dashboard pass visual smoke tests.
- Phase 4: interactions update local state predictably.
- Phase 5: simulation and replay are deterministic.
- Phase 6: automated checks cover core flows.
