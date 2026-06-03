# Built-In Agents Catalog

## Goal

AgentOps includes its own built-in agents as monetizable products. These agents should be safer and easier to prove than arbitrary custom agents because they are designed around the AgentOps data model, approval gates, risk review, artifacts, evaluations, usage meters, and audit logs.

Phase 3A defines the catalog and UI foundation only. No real built-in agent execution exists yet.

## Recommended First Agent

Website QA Agent is the first recommended built-in agent because it can later prove value with visible, reviewable evidence: route checks, responsive states, accessibility notes, console/network summaries, screenshots as artifact references, and release readiness status.

## Catalog

| Agent | Purpose | Tier | Status |
| --- | --- | --- | --- |
| Website QA Agent | Browser QA evidence and release readiness. | Free Demo | Recommended foundation |
| Code Review Agent | Diff review and engineering risk summaries. | Starter | Planned |
| Security Review Agent | Policy, dependency, and unsafe automation risks. | Pro | Planned |
| Release Readiness Agent | Aggregates QA, risk, approval, cost, and evaluation. | Starter | Planned |
| Documentation/RAG Agent | Answers project/doc questions with references. | Pro | Future |
| Prompt Injection Review Agent | Detects instruction override attempts. | Pro | Planned |
| Workflow Monitor Agent | Watches run health, retry drift, approval age. | Starter | Future |
| Data/Analytics Agent | Summarizes usage, cost, and evaluation trends. | Pro | Future |
| Research/Competitor Agent | Produces traceable research summaries. | Pro | Future |

## Required Catalog Fields

Each built-in agent should define:

- Name.
- Short description.
- Purpose.
- Best-for use cases.
- Input requirements.
- Connection requirements.
- Required permissions.
- Required capabilities.
- Privacy level.
- Risk level.
- Approval requirements.
- Usage meter.
- Monetization tier.
- Implementation status.
- Security notes.
- Deployment mode compatibility.

## Security Rules

- Built-in agents cannot bypass global security policies.
- Public demo agents target only local/demo allowlists.
- Sensitive agents require workspace private or enterprise private modes.
- High-risk outputs create approval or risk records.
- AgentOps controls source/catalog publishing; customers configure workspace use only.
