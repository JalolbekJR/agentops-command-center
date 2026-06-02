# UI/UX Direction

## Design Goal

AgentOps Command Center should feel like a calm, premium enterprise operations product. It should look serious enough for AI engineers and security reviewers, but clear enough for founders, product managers, and portfolio reviewers to understand quickly.

The product should not feel like a generic SaaS template. Its visual identity should come from the domain: controlled automation, traceable runs, approvals, risk signals, and operational clarity.

## Design Personality

- Calm.
- Precise.
- Technical without being hostile.
- High-trust.
- Dense but readable.
- Premium, not decorative.
- Governance-oriented.
- Fast to scan.

## Visual Inspiration Translated Into Original Rules

Reference levels, not copies:

- Linear-level polish: tight spacing, quiet surfaces, high signal-to-noise.
- Datadog-style observability: clear metrics, timelines, trends, and status colors.
- GitHub Actions-style run clarity: step timelines, logs, statuses, and retry context.
- Vercel-style deployment clarity: release gates, status summaries, and environment boundaries.
- Enterprise AI governance: approval queues, risk review, auditability, and policy context.

Original design rules:

- Use status and evidence hierarchy, not decorative hero layouts, inside the app.
- Keep dashboard cards compact and purposeful.
- Use tables and timelines for operational scanning.
- Use restrained color with strong semantic meaning.
- Avoid oversized marketing sections in the product app.
- Make risk, approval, and evaluation status visible without panic language.

## Layout System

Primary app layout:

- Left navigation rail/sidebar.
- Top workspace bar with project name, role switcher, environment label, and global search placeholder.
- Main content region with route-level headings and compact summaries.
- Optional right context panel for selected run, approval, risk, or comment threads.

Dashboard grid:

- Top row: operational summary metrics.
- Middle: run health, pending approvals, risk findings, evaluation average, browser QA pass rate.
- Lower: recent run timeline, high-risk queue, cost trend, and audit highlights.

Detail pages:

- Header with object name, status, owner, risk level, and primary action.
- Tabs for overview, timeline, tool calls, evaluations, risks, comments, and audit.
- Right-side metadata panel for IDs, trace, environment, timestamps, and policy links.

## Navigation Structure

Primary navigation:

- Overview
- Agents
- Workflows
- Runs
- Approvals
- Evaluations
- Risks
- Browser QA
- Cost
- Audit Log
- Settings

Secondary navigation examples:

- Workflow detail: Definition, Runs, Steps, Policies, Versions.
- Run detail: Timeline, Tool Calls, Approvals, Evaluations, Risks, Browser QA, Audit.
- Settings: Team, Roles, Policies, Environment Boundaries, Secret References.

## Component Inventory

Core components:

- App shell.
- Sidebar navigation.
- Workspace header.
- Role switcher.
- Environment badge.
- Metric card.
- Status badge.
- Risk severity badge.
- Data table.
- Filter bar.
- Search input.
- Timeline.
- Timeline event row.
- Tool call drawer.
- Approval request card.
- Evaluation score row.
- Risk finding row.
- Browser session step list.
- Cost trend chart.
- Audit log table.
- Empty state.
- Loading skeleton.
- Error callout.
- Comment composer.
- Confirmation dialog.
- Settings form.

## Data Visualization Approach

Use charts only where they help decisions:

- Cost trend over time.
- Evaluation score trend.
- Risk findings by severity.
- Run status distribution.
- Browser QA pass rate.
- Token usage by model or agent.

Avoid chart clutter:

- No decorative charts.
- No 3D charts.
- No unlabeled sparklines for critical data.
- Every chart should have a plain-language takeaway.

## Design Tokens

Suggested token direction:

| Token Type | Direction |
| --- | --- |
| Neutrals | Deep ink text, cool gray borders, balanced light/dark surfaces. |
| Primary | Professional blue or cyan used for selected navigation and primary actions. |
| Accent | Controlled green for passed/safe states. |
| Warning | Amber for review-needed states. |
| Danger | Red for high/critical blockers. |
| Info | Blue for neutral system notices. |
| Radius | 6px to 8px for cards and controls. |
| Spacing | 4px base with 8px rhythm. |
| Typography | Modern sans for UI, mono for IDs, traces, and code-like values. |
| Motion | 150ms to 220ms transitions for hover, drawer, tab, and status changes. |

## Empty States

Empty states should be specific and useful:

- No pending approvals: "No approvals are waiting for this role."
- No high risks: "No unresolved high-risk findings in this project."
- No browser sessions: "Browser QA sessions will appear after a workflow run links one."
- No audit logs: "Audited activity will appear after approvals, role changes, or workflow updates."

Avoid generic "Nothing here yet" messages.

## Loading States

Use:

- Skeleton rows for tables.
- Skeleton timeline events.
- Metric card shimmer or static placeholders.
- Disabled action buttons while pending.
- Clear status text for long-running simulated actions.

Respect reduced-motion preferences.

## Error States

Error states should:

- Name what failed.
- Explain user impact.
- Offer a safe next action.
- Avoid blame or vague failure messages.
- Include request ID in future backend phases.

Examples:

- "Run events could not be loaded. The run summary is still available."
- "This role cannot approve security findings. Switch to Security Reviewer or Admin in the demo."

## Accessibility Principles

- Use semantic headings.
- Ensure keyboard navigation through tables, tabs, drawers, dialogs, and action buttons.
- Use visible focus states.
- Keep color contrast at WCAG AA minimum.
- Do not rely on color alone for status.
- Include text labels for icons or accessible names.
- Support responsive layouts without horizontal overflow.
- Avoid tiny click targets.
- Use clear timestamps and labels.

## Responsive Behavior

Desktop:

- Full sidebar and multi-column dashboard.
- Details can use right context panel.
- Tables show key columns plus density controls later.

Tablet:

- Collapsible sidebar.
- Dashboard moves to two-column grid.
- Detail metadata moves below header or into drawer.

Mobile:

- Bottom or drawer navigation after implementation decision.
- One-column cards and tables converted to stacked rows.
- Sticky key actions for approvals and review decisions.
- Avoid dense charts unless simplified.

## Copywriting Tone

- Clear.
- Specific.
- Calm.
- Honest about demo scope.
- No fake production claims.
- No hype words without evidence.
- Use reviewer-friendly language for risks and failures.

Good examples:

- "Approval required because this step touches a production-like environment."
- "Evaluation passed with one policy warning."
- "This tool output was summarized because sensitive payloads are hidden from this role."

Avoid:

- "Revolutionary AI control."
- "Fully production-ready."
- "Autonomous magic."
- "Enterprise-grade" without supporting details.

## Anti-AI-Slop Checklist

- [ ] Every page has a clear user job.
- [ ] Status colors mean the same thing everywhere.
- [ ] Empty states are domain-specific.
- [ ] Tables have useful columns and actions.
- [ ] Metrics connect to real entities.
- [ ] Copy explains risk without fearmongering.
- [ ] Layout supports scanning and repeated use.
- [ ] No decorative cards inside cards.
- [ ] No fake screenshots or claims.
- [ ] No random gradients, neon effects, or generic hero copy inside the app.

## UI Acceptance Criteria

- A reviewer can identify the current project, role, and environment at all times.
- Pending approvals, failed runs, high risks, and release blockers are visible.
- The run detail page can explain a workflow outcome without external context.
- The UI feels like an operations product, not a marketing page.
