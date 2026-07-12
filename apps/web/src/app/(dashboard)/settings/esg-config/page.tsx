"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";

interface OrgSettings {
  name: string;
  logo?: string;
  esgWeightE: number;
  esgWeightS: number;
  esgWeightG: number;
  autoCalcEmission: boolean;
  autoAwardBadge: boolean;
  evidenceRequired: boolean;
}

export default function ESGConfigPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["org-settings"],
    queryFn: () => dashboardApi.getOrgSettings(),
  });

  const [form, setForm] = useState<OrgSettings>({
    name: "",
    esgWeightE: 40,
    esgWeightS: 30,
    esgWeightG: 30,
    autoCalcEmission: true,
    autoAwardBadge: true,
    evidenceRequired: true,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name ?? "",
        logo: settings.logo ?? "",
        esgWeightE: settings.esgWeightE ?? 40,
        esgWeightS: settings.esgWeightS ?? 30,
        esgWeightG: settings.esgWeightG ?? 30,
        autoCalcEmission: settings.autoCalcEmission ?? true,
        autoAwardBadge: settings.autoAwardBadge ?? true,
        evidenceRequired: settings.evidenceRequired ?? true,
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (data: Partial<OrgSettings>) => dashboardApi.updateOrgSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-settings"] });
      toast({ title: "Settings saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save settings", variant: "destructive" });
    },
  });

  const totalWeight = form.esgWeightE + form.esgWeightS + form.esgWeightG;

  const handleSave = () => {
    if (Math.abs(totalWeight - 100) > 0.1) {
      toast({ title: "ESG weights must sum to 100%", variant: "destructive" });
      return;
    }
    mutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="ESG Configuration" description="Configure organization-wide ESG settings and weights" />
        <Card className="animate-pulse"><CardContent className="h-64" /></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="ESG Configuration"
        description="Configure organization-wide ESG settings and weights"
        action={
          <Button onClick={handleSave} disabled={mutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {mutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>ESG Weight Distribution</CardTitle>
          <CardDescription>
            Adjust the weights for Environmental, Social, and Governance pillars. Total must equal 100%.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-green-600 font-medium">Environmental (E)</Label>
                <span className="text-sm font-mono">{form.esgWeightE}%</span>
              </div>
              <Slider
                value={[form.esgWeightE]}
                onValueChange={([v]) => setForm({ ...form, esgWeightE: v })}
                min={0}
                max={100}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-blue-600 font-medium">Social (S)</Label>
                <span className="text-sm font-mono">{form.esgWeightS}%</span>
              </div>
              <Slider
                value={[form.esgWeightS]}
                onValueChange={([v]) => setForm({ ...form, esgWeightS: v })}
                min={0}
                max={100}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-purple-600 font-medium">Governance (G)</Label>
                <span className="text-sm font-mono">{form.esgWeightG}%</span>
              </div>
              <Slider
                value={[form.esgWeightG]}
                onValueChange={([v]) => setForm({ ...form, esgWeightG: v })}
                min={0}
                max={100}
                step={5}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium">Total Weight</span>
            <span className={`text-sm font-mono font-bold ${Math.abs(totalWeight - 100) > 0.1 ? "text-red-500" : "text-green-500"}`}>
              {totalWeight}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation Settings</CardTitle>
          <CardDescription>Configure automatic behaviors for the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Auto-calculate Emissions</Label>
              <p className="text-xs text-muted-foreground">
                Automatically compute CO₂ amounts when creating carbon transactions
              </p>
            </div>
            <Switch
              checked={form.autoCalcEmission}
              onCheckedChange={(v) => setForm({ ...form, autoCalcEmission: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Auto-award Badges</Label>
              <p className="text-xs text-muted-foreground">
                Automatically award badges when employees reach XP or challenge thresholds
              </p>
            </div>
            <Switch
              checked={form.autoAwardBadge}
              onCheckedChange={(v) => setForm({ ...form, autoAwardBadge: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Evidence Required</Label>
              <p className="text-xs text-muted-foreground">
                Require proof/evidence submissions for challenges and CSR activities
              </p>
            </div>
            <Switch
              checked={form.evidenceRequired}
              onCheckedChange={(v) => setForm({ ...form, evidenceRequired: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Organization Name</Label>
            <p className="text-lg font-semibold">{form.name || "EcoSphere Corp"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
