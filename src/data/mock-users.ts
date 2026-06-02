import type { Team, User } from "@/types/domain";

export const mockTeam: Team = {
  id: "team_ai_factory",
  name: "AI Factory Demo Team",
  plan: "portfolio_demo"
};

export const mockUsers: User[] = [
  {
    id: "user_admin",
    teamId: mockTeam.id,
    name: "Maya Chen",
    email: "maya.admin@example.com",
    role: "Founder/Admin",
    avatarInitials: "MC",
    status: "active",
    lastActiveAt: "2026-06-02T09:42:00Z"
  },
  {
    id: "user_engineer",
    teamId: mockTeam.id,
    name: "Owen Rivera",
    email: "owen.engineer@example.com",
    role: "AI Engineer",
    avatarInitials: "OR",
    status: "active",
    lastActiveAt: "2026-06-02T09:38:00Z"
  },
  {
    id: "user_qa",
    teamId: mockTeam.id,
    name: "Priya Shah",
    email: "priya.qa@example.com",
    role: "QA Reviewer",
    avatarInitials: "PS",
    status: "active",
    lastActiveAt: "2026-06-02T09:31:00Z"
  },
  {
    id: "user_security",
    teamId: mockTeam.id,
    name: "Jon Bell",
    email: "jon.security@example.com",
    role: "Security Reviewer",
    avatarInitials: "JB",
    status: "active",
    lastActiveAt: "2026-06-02T09:27:00Z"
  },
  {
    id: "user_pm",
    teamId: mockTeam.id,
    name: "Elena Park",
    email: "elena.pm@example.com",
    role: "Product Manager",
    avatarInitials: "EP",
    status: "active",
    lastActiveAt: "2026-06-02T09:18:00Z"
  },
  {
    id: "user_viewer",
    teamId: mockTeam.id,
    name: "Sam Torres",
    email: "sam.viewer@example.com",
    role: "Viewer",
    avatarInitials: "ST",
    status: "active",
    lastActiveAt: "2026-06-02T08:58:00Z"
  }
];
