import { Badge } from "@/components/ui/badge";
import { statusTone, titleCase } from "@/lib/format";

export function StatusBadge({ status }: { status: string | undefined | null }) {
  if (!status) return <Badge>—</Badge>;
  return <Badge tone={statusTone(status)}>{titleCase(status)}</Badge>;
}
