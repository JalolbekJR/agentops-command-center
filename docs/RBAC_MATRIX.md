# RBAC Matrix

## Roles

| Role | Purpose |
| --- | --- |
| Founder/Admin | Owns the workspace, team settings, policies, approvals, risks, and audit visibility. |
| AI Engineer | Builds agents and workflows, inspects runs, debugs tool calls, and proposes fixes. |
| QA Reviewer | Reviews browser QA sessions, evaluations, failed runs, and release gates. |
| Security Reviewer | Reviews high-risk tool calls, prompt/tool injection risks, sensitive actions, and audit logs. |
| Product Manager | Reviews business outcomes, comments on evaluations, and approves product-level decisions. |
| Viewer | Reads selected dashboards, runs, and reports without write access. |

## Permission Legend

- `A`: Admin-level control.
- `W`: Write or decision access.
- `R`: Read access.
- `L`: Limited or redacted read access.
- `-`: No access.

## Role-By-Feature Matrix

| Feature | Founder/Admin | AI Engineer | QA Reviewer | Security Reviewer | Product Manager | Viewer |
| --- | --- | --- | --- | --- | --- | --- |
| Dashboard overview | A | R | R | R | R | R |
| Project settings | A | - | - | L | L | - |
| Team members | A | L | L | L | L | - |
| Role management | A | - | - | - | - | - |
| Agent registry read | A | R | R | R | R | L |
| Agent create/edit | A | W | - | L | - | - |
| Agent risk configuration | A | W | - | W | - | - |
| Workflow read | A | R | R | R | R | L |
| Workflow draft/edit | A | W | - | L | - | - |
| Workflow publish | A | W | - | W for security policy blocks | W for business policy blocks | - |
| Workflow run start | A | W | W for QA workflows | L | W for review workflows | - |
| Workflow run cancel | A | W own/assigned | W QA runs | W risky/security runs | L | - |
| Run timeline | A | R | R | R | R | L |
| Tool call summaries | A | R | R | R | R | L |
| Sensitive tool detail | A | W for owned debug context | L | R | L | - |
| Approval queue read | A | R | R | R | R | - |
| Technical approval decision | A | W when assigned | - | W when security-related | - | - |
| QA approval decision | A | - | W | - | L | - |
| Security approval decision | A | - | - | W | L | - |
| Product approval decision | A | - | L | L | W | - |
| Evaluation dashboard | A | R | W | R | R | L |
| Risk dashboard | A | L | R for QA risks | W | R | L |
| Browser QA sessions | A | R | W | R | R | L |
| Cost analytics | A | R | L | L | R | L |
| Audit log | A | L | L | R | L | - |
| Policy rules | A | L | L | W security policies | L | - |
| Release gates | A | R | W QA gates | W security gates | W product gates | L |
| Comments | A | W | W | W | W | - |

## High-Risk Action Approval Requirements

| Action | Required Approval | Audit Required | Notes |
| --- | --- | --- | --- |
| Publish workflow with high-risk tool | Admin or Security Reviewer | Yes | AI Engineer can propose, but policy decides approver. |
| Run production-like workflow | Admin plus policy-assigned reviewer | Yes | Future only; demo uses environment boundary labels. |
| Execute destructive tool action | Admin | Yes | Should be blocked in demo and require explicit future support. |
| Access sensitive tool output | Security Reviewer or Admin | Yes | Viewer never sees raw sensitive payloads. |
| Override release gate | Admin | Yes | Requires written reason. |
| Resolve critical risk | Security Reviewer and Admin | Yes | Dual approval can be modeled in future enterprise phase. |
| Change role permissions | Founder/Admin | Yes | Must prevent removal of last Admin. |
| Add or change secret reference | Admin | Yes | Secret values never stored in repo or client. |
| Mark failed browser QA as accepted | QA Reviewer or Admin | Yes | Product Manager can comment but not bypass technical blockers alone. |

## What Must Be Audited

- Role changes.
- Permission policy changes.
- Agent capability changes.
- Workflow publish, archive, or high-risk edits.
- Workflow run cancellation.
- Approval decisions.
- Release gate overrides.
- Risk status changes for high or critical findings.
- Secret reference changes.
- Environment boundary changes.
- Sensitive tool detail access in future backend phases.

## Least Privilege Principles

- Roles receive the minimum access needed for their review workflow.
- Demo role switching is only for portfolio exploration.
- Future backend must enforce every permission server-side.
- Sensitive details should be redacted unless needed by the role.
- Approval authority is based on action type, risk level, and environment.
- Viewer is never a fallback role for hidden admin actions.

## Future Enterprise Permissions Model

Future enterprise features:

- Custom roles.
- Per-project role assignments.
- Per-environment permissions.
- Dual approval for critical actions.
- Temporary elevated access with expiry.
- Approval delegation.
- Policy-as-code for risk thresholds.
- SSO group mapping.
- Audit export for compliance review.

## RBAC Acceptance Criteria

- Each module has a clear read/write decision.
- High-risk approvals map to specific roles.
- Sensitive data access is limited and auditable.
- The role model works for both demo exploration and future backend enforcement.
