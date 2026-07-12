import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: boolean | string;
  trueLabel?: string;
  falseLabel?: string;
}

export function StatusBadge({ status, trueLabel = "Active", falseLabel = "Inactive" }: StatusBadgeProps) {
  const isActive = typeof status === "boolean" ? status : status === "ACTIVE" || status === "COMPLIANT" || status === "ACHIEVED";

  return (
    <Badge variant={isActive ? "success" : "secondary"}>
      {typeof status === "boolean" ? (isActive ? trueLabel : falseLabel) : status}
    </Badge>
  );
}
