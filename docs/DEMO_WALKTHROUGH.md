# Demo Walkthrough

This walkthrough explains how to present AgentOps Command Center as a public product prototype. Use it to guide a technical reviewer through the product story, the current deterministic boundary, and the future backend path.

## 60-second walkthrough

AgentOps Command Center shows how an AI-agent workflow can be reviewed through run evidence, approval gates, risk findings, evaluation results, and audit history.

Start on the dashboard. Point out the mission-control summary: active agents, run health, evidence captured, evaluation score, approval state, risk findings, and audit readiness. Then switch to Agent Builder to show how a governed agent draft starts from a template and safety gates. Close with Runs, Approvals, Risks, Evaluations, and Audit to show the chain from execution evidence to human decision and traceable record.

## 3-minute walkthrough

Use this flow when the reviewer wants the product story and the main surfaces.

1. **Dashboard / mission control**: Explain the operating state. The dashboard connects agents, workflows, runs, risks, approvals, evaluations, and audit records into one first screen.
2. **Agents and built-in agents**: Show the difference between workspace agents and AgentOps-provided modules. Website QA Agent is the recommended first built-in agent because it creates visible review evidence.
3. **Agent Builder**: Show template selection, connector policy, safety gates, draft readiness, and local approval requirements.
4. **Runs timeline**: Open a run to show ordered evidence, status, trace context, and why a run paused.
5. **Approval queue**: Show how high-risk actions require a human decision before the workflow continues.
6. **Risk dashboard**: Review severity, ownership, category, and remediation state.
7. **Evaluation summary**: Explain quality, safety, cost, reliability, and policy scores.
8. **Audit log**: Show actor, action, reason, target, and correlation context.
9. **Connectors, Plans, Setup, and Settings/RBAC**: Explain future platform packaging, workspace boundaries, role behavior, and local demo settings.

## 7-minute technical walkthrough

Use this flow for a deeper technical review.

### 1. Dashboard / mission control

The dashboard establishes the product thesis. AI agent work needs operational visibility, not a disconnected set of task results.

Cover:

- Active agents
- Run health
- Evidence capture
- Evaluation score
- Pending approvals
- Open risks
- Audit events
- Recommended operator action

### 2. Agents and built-in agents

The agent surfaces explain who owns automation and what each agent can do.

Cover:

- Agent status
- Capability category
- Risk level
- Ownership
- Success and cost signals
- Built-in AgentOps modules
- Website QA Agent as the first recommended built-in agent

### 3. Agent Builder

Agent Builder demonstrates the creation flow without creating a live agent runtime.

Cover:

- Template selection
- Connector method
- Capabilities
- Allowed targets
- Approval gates
- Draft readiness
- Plan and role restrictions
- Local deterministic draft state

### 4. Workflows and runs

The workflow and run surfaces model AI automation as a traceable process.

Cover:

- Workflow graph concepts
- Run status
- Timeline events
- Tool summaries
- Evidence references
- Failure and retry context
- Approval pause points

### 5. Approval queue

Approvals make human review part of the product model.

Cover:

- Who can decide
- Why the approval exists
- Which run or tool call created it
- Risk context
- Decision comments
- Audit record direction

### 6. Risk dashboard

The risk dashboard shows how the product handles unsafe or policy-sensitive automation.

Cover:

- Severity
- Category
- Owner
- Status
- Evidence summary
- Release impact
- Security review flow

### 7. Evaluation summary

Evaluations connect quality signals to release readiness.

Cover:

- Correctness
- Safety
- Reliability
- Latency
- Cost
- User impact
- Policy compliance
- Release gate status

### 8. Browser QA

Browser QA represents visible product evidence for workflows that inspect pages or releases.

Cover:

- Session status
- Target and viewport
- Step evidence
- Console and network issue summaries
- Screenshot artifacts
- Accessibility notes

### 9. Audit log

Audit makes sensitive decisions reviewable after the fact.

Cover:

- Actor
- Action
- Target
- Reason
- Correlation ID
- Before/after summary direction
- Future append-only persistence

### 10. Connectors

Connectors explain how agents can be attached later without exposing secrets or external calls in the current prototype.

Cover:

- Built-in AgentOps agents
- Native Protocol
- Webhook
- SDK
- MCP connector
- Private worker
- Trace import
- Future token hashing and policy validation

### 11. Plans

Plans model future packaging without payment code.

Cover:

- Demo usage
- Starter, Pro, and Enterprise concepts
- Plan-limited connector access
- Worker and audit export packaging
- Current mocked billing boundary

### 12. Setup

Setup explains how a workspace becomes safe to operate.

Cover:

- Owner defaults
- Allowlisted targets
- Workspace-safe connection path
- Environment boundary
- Future health checks

### 13. Settings/RBAC

Settings keeps role, display, theme, and boundary controls in one place.

Cover:

- Role view
- Simple/Professional mode
- Dark/Light mode
- Local workspace boundary
- Owner-only concepts
- Future server-side RBAC requirement

### 14. Simple and Professional modes

Simple mode compresses the interface around current state and next action. Professional mode exposes traces, policy, scores, and audit context.

Use Simple mode for product walkthroughs. Use Professional mode for technical review.

### 15. Dark and Light modes

Dark mode is the primary command-center presentation. Light mode shows the same product structure with a lavender workspace theme.

### 16. Sidebar collapse and responsive layout

The desktop sidebar can collapse into an icon rail. Mobile uses a drawer pattern with compact topbar controls.

Show desktop and mobile screenshots if fresh local Playwright artifacts exist.
