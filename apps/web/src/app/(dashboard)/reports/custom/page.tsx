"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { useDepartments } from "@/lib/hooks/use-master-data";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileBarChart, Filter, Loader2, FileSpreadsheet, FileText } from "lucide-react";

const MODULES = [
  { value: "ALL", label: "All Modules" },
  { value: "CARBON", label: "Carbon Emissions" },
  { value: "CSR", label: "CSR Participation" },
  { value: "CHALLENGES", label: "Challenge Completions" },
  { value: "AUDITS", label: "Audits" },
  { value: "COMPLIANCE", label: "Compliance Issues" },
  { value: "GAMIFICATION", label: "Gamification" },
];

function toCSV(data: any[]): string {
  if (!data.length) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h];
      if (typeof val === "object" && val !== null) return JSON.stringify(val);
      return String(val ?? "");
    })
  );
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function SectionSummary({ section }: { section: any }) {
  if (!section.summary) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(section.summary).map(([key, value]) => (
        <div key={key} className="rounded-lg border px-3 py-2">
          <p className="text-xs text-muted-foreground">{key.replace(/([A-Z])/g, " $1").trim()}</p>
          <p className="text-lg font-bold">{String(value)}</p>
        </div>
      ))}
    </div>
  );
}

function flattenRecords(report: any): any[] {
  const all: any[] = [];
  for (const section of report.sections || []) {
    if (section.records?.length) {
      for (const rec of section.records) {
        const flat: Record<string, any> = { _section: section.name };
        for (const [k, v] of Object.entries(rec)) {
          if (typeof v === "object" && v !== null) {
            flat[k] = (v as any).name || (v as any).title || JSON.stringify(v);
          } else {
            flat[k] = v;
          }
        }
        all.push(flat);
      }
    }
  }
  return all;
}

export default function ReportsBuilderPage() {
  const [filters, setFilters] = useState({
    module: "ALL",
    departmentId: "",
    employeeId: "",
    startDate: "",
    endDate: "",
  });

  const { data: departments } = useDepartments();
  const { data: report, isLoading, refetch } = useQuery({
    queryKey: ["report", filters],
    queryFn: () =>
      dashboardApi.generateReport({
        module: filters.module === "ALL" ? undefined : filters.module,
        departmentId: filters.departmentId || undefined,
        employeeId: filters.employeeId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      }),
    enabled: false,
  });

  const handleGenerate = () => refetch();

  const handleResetFilters = () => {
    setFilters({ module: "ALL", departmentId: "", employeeId: "", startDate: "", endDate: "" });
  };

  const handleExportCSV = () => {
    if (!report?.sections) return;
    let csv = "";
    for (const section of report.sections) {
      if (section.records?.length) {
        csv += `\n--- ${section.name} ---\n`;
        csv += toCSV(section.records);
        csv += "\n";
      }
    }
    downloadFile(csv, `ecosphere-report-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
  };

  const handleExportExcel = async () => {
    if (!report?.sections) return;
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();

    for (const section of report.sections) {
      if (section.records?.length) {
        const cleanRecords = section.records.map((r: any) => {
          const clean: Record<string, any> = {};
          for (const [k, v] of Object.entries(r)) {
            clean[k] = typeof v === "object" && v !== null ? (v as any).name || JSON.stringify(v) : v;
          }
          return clean;
        });
        const ws = XLSX.utils.json_to_sheet(cleanRecords);
        const sheetName = section.name.slice(0, 31);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }
    }

    if (wb.SheetNames.length) {
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      downloadBlob(blob, `ecosphere-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
  };

  const handleExportPDF = async () => {
    if (!report?.sections) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text("EcoSphere ESG Report", 14, y);
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date(report.generatedAt).toLocaleString()}`, 14, y);
    y += 12;

    for (const section of report.sections) {
      if (y > 260) { doc.addPage(); y = 15; }
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(section.name, 14, y);
      y += 7;

      if (section.summary) {
        doc.setFontSize(9);
        doc.setTextColor(80);
        for (const [k, v] of Object.entries(section.summary)) {
          doc.text(`${k.replace(/([A-Z])/g, " $1").trim()}: ${String(v)}`, 14, y);
          y += 5;
        }
        y += 3;
      }

      if (section.records?.length) {
        const headers = Object.keys(section.records[0]).slice(0, 5);
        doc.setFontSize(8);
        doc.setTextColor(0);
        let x = 14;
        for (const h of headers) {
          doc.text(h, x, y);
          x += 38;
        }
        y += 5;
        doc.setDrawColor(200);
        doc.line(14, y, 196, y);
        y += 3;

        doc.setTextColor(60);
        for (const rec of section.records.slice(0, 20)) {
          if (y > 280) { doc.addPage(); y = 15; }
          x = 14;
          for (const h of headers) {
            const val = rec[h];
            const display = typeof val === "object" && val !== null ? val.name || JSON.stringify(val) : String(val ?? "");
            doc.text(String(display).slice(0, 35), x, y);
            x += 38;
          }
          y += 4;
        }
      }
      y += 8;
    }

    doc.save(`ecosphere-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Custom Reports Builder" description="Generate filtered ESG reports and export to CSV, Excel, or PDF" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Report Filters
          </CardTitle>
          <CardDescription>Select filters and click Generate to build your report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label>Module</Label>
              <Select value={filters.module} onValueChange={(v) => setFilters({ ...filters, module: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODULES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={filters.departmentId || "_all"} onValueChange={(v) => setFilters({ ...filters, departmentId: v === "_all" ? "" : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">All Departments</SelectItem>
                  {departments?.data?.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Employee</Label>
              <input
                type="text"
                placeholder="Employee ID..."
                value={filters.employeeId}
                onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileBarChart className="mr-2 h-4 w-4" />}
              Generate Report
            </Button>
            <Button variant="ghost" onClick={handleResetFilters}>Reset Filters</Button>
            {report && (
              <>
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" /> CSV
                </Button>
                <Button variant="outline" onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
                </Button>
                <Button variant="outline" onClick={handleExportPDF}>
                  <FileText className="mr-2 h-4 w-4" /> PDF
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {report && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Report generated at {new Date(report.generatedAt).toLocaleString()} &bull; {report.sections.length} section(s)
          </p>

          {report.sections.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No data found for the selected filters. Try adjusting your criteria.
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue={report.sections[0]?.name?.replace(/\s/g, "-").toLowerCase()}>
              <TabsList className="flex flex-wrap">
                {report.sections.map((section: any) => (
                  <TabsTrigger key={section.name} value={section.name.replace(/\s/g, "-").toLowerCase()}>
                    {section.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {report.sections.map((section: any) => (
                <TabsContent key={section.name} value={section.name.replace(/\s/g, "-").toLowerCase()}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{section.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <SectionSummary section={section} />
                      {section.breakdown?.length > 0 && (
                        <div>
                          <p className="mb-2 text-sm font-medium">Breakdown</p>
                          <div className="flex flex-wrap gap-2">
                            {section.breakdown.map((b: any, i: number) => (
                              <span key={i} className="rounded-full border px-3 py-1 text-xs">
                                {b.status || b.severity || b.departmentId}: {b.count || b.totalCO2}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {section.records?.length > 0 && (
                        <div>
                          <p className="mb-2 text-sm font-medium">Records ({section.records.length})</p>
                          <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b bg-muted/50">
                                  {Object.keys(section.records[0]).slice(0, 8).map((key) => (
                                    <th key={key} className="px-3 py-2 text-left font-medium">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {section.records.slice(0, 50).map((record: any, i: number) => (
                                  <tr key={i} className="border-b last:border-0">
                                    {Object.keys(record).slice(0, 8).map((key) => {
                                      const val = record[key];
                                      const display = typeof val === "object" && val !== null
                                        ? val.name || val.title || JSON.stringify(val)
                                        : String(val ?? "");
                                      return (
                                        <td key={key} className="max-w-[200px] truncate px-3 py-2">
                                          {display}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      )}

      {!report && (
        <Card>
          <CardContent className="py-16 text-center">
            <FileBarChart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No report generated yet</p>
            <p className="text-sm text-muted-foreground">Select your filters above and click Generate Report</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
