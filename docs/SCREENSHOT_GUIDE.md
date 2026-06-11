# Screenshot Guide

This guide explains where local screenshots are stored, which captures best represent the project, and how to regenerate artifacts for review.

## Screenshot storage

Playwright writes local screenshots to:

```text
test-results/phase-3b4-elite-ux/
```

These are local test artifacts. They are not required to be tracked in Git and should be regenerated when the UI changes.

## Regenerate screenshots

Run the Playwright suite:

```powershell
npm run e2e
```

The responsive suite captures desktop, laptop, mobile, theme, mode, and sidebar state screenshots.

## Recommended screenshots

Use these captures to explain the product:

- `1440x900-dashboard.png`: dark desktop dashboard and mission-control story
- `light-mode-dashboard.png`: light theme dashboard quality
- `390x844-dashboard.png`: mobile dashboard density and responsive shell
- `390x844-agent-builder.png`: mobile Agent Builder flow
- `collapsed-sidebar-dashboard.png`: collapsed desktop sidebar rail
- `expanded-sidebar-dashboard.png`: expanded desktop sidebar and navigation
- `1440x900-approvals.png`: approval queue and human decision model
- `1440x900-runs.png`: run timeline and evidence model
- `1440x900-risks.png`: risk dashboard and severity lanes
- `1440x900-evaluations.png`: evaluation scorecard
- `1440x900-connectors.png`: connector decision model
- `1440x900-agent-builder.png`: builder studio layout
- `1440x900-settings.png`: role, display, and local boundary controls

## What each screenshot demonstrates

| Screenshot | Demonstrates |
| --- | --- |
| Dark desktop dashboard | Primary command-center experience, approval/risk/evaluation/audit chain |
| Light desktop dashboard | Theme system and readable light surfaces |
| Mobile dashboard | Compact topbar, mobile stacking, no horizontal overflow |
| Mobile Agent Builder | Builder flow remains usable on narrow screens |
| Collapsed sidebar dashboard | Desktop rail state and active navigation |
| Expanded sidebar dashboard | Full navigation and product shell hierarchy |
| Approvals queue | Human-in-the-loop decision model |
| Runs timeline | Traceable workflow evidence |
| Risk dashboard | Severity, owner, and release-impact review |
| Evaluations | Quality, safety, cost, and policy scoring |
| Connectors | Built-in, protocol, webhook, SDK, MCP, private worker, and trace import paths |
| Agent Builder | Template selection, safety gates, and draft readiness |
| Settings/RBAC | Role view, display preferences, theme, and local boundary |

## Review checklist

When reviewing screenshots, check:

- Topbar controls do not clip
- Sidebar active state is visible but not loud
- Mobile has no horizontal overflow
- Cards and badges do not overlap
- Role and route restrictions look intentional
- Simple/Professional and Dark/Light controls are readable
- Agent Builder titles and badges do not wrap awkwardly
- Dashboard first screen explains the product quickly

## Artifact note

If a screenshot listed here does not exist locally, regenerate the suite with `npm run e2e`. Do not embed missing local images in public Markdown.
