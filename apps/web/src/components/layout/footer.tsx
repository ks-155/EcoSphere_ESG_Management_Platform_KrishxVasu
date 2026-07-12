import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-4 text-center text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2">
        <Leaf className="h-4 w-4 text-primary" />
        <span>
          <strong>EcoSphere</strong> ESG Management Platform &copy; {new Date().getFullYear()}
        </span>
      </div>
      <p className="mt-1">Environmental, Social &amp; Governance Management</p>
    </footer>
  );
}
