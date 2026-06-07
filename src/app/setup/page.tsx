import { AccessGate } from "@/components/access-gate";
import { SetupWizard } from "@/features/setup/setup-wizard";

export default function SetupPage() {
  return (
    <AccessGate route="/setup">
      <SetupWizard />
    </AccessGate>
  );
}
