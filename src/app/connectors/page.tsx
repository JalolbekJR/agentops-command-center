import { AccessGate } from "@/components/access-gate";
import { ConnectorCenter } from "@/features/connectors/connector-center";

export default function ConnectorsPage() {
  return (
    <AccessGate route="/connectors">
      <ConnectorCenter />
    </AccessGate>
  );
}
