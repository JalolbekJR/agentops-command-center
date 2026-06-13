import type { Project, ReleaseGate } from "@/types/domain";
import { mockTeam } from "./mock-users";

export const mockProjects: Project[] = [
  {
    id: "project_agentops",
    teamId: mockTeam.id,
    name: "AgentOps Command Center",
    slug: "agentops-command-center",
    environment: "Local Demo",
    status: "active",
    description: "Deterministic local demo workspace for AI agent workflow governance.",
    updatedAt: "2026-06-02T10:15:00Z"
  }
];

export const activeProject = mockProjects[0];

export const mockReleaseGates: ReleaseGate[] = [
  {
    id: "gate_demo_release",
    projectId: activeProject.id,
    name: "Demo Release Readiness",
    status: "warning",
    environment: "Local Demo",
    requiredEvaluationScore: 0.85,
    blockOnHighRisk: true,
    blockOnFailedBrowserQa: true,
    lastCheckedAt: "2026-06-02T10:50:00Z"
  }
];
