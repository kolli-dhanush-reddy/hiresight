import { useState, useMemo, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Download } from "lucide-react";
import { useCompanyDetails, useCompanyPlacements } from "@/hooks/usePlacementData";
import { useChartColors } from "@/hooks/useChartColors";
import { exportToCsv } from "@/lib/exportCsv";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CHART_COLORS = [
  "hsl(175, 55%, 40%)",
  "hsl(38, 92%, 55%)",
  "hsl(220, 60%, 45%)",
  "hsl(280, 50%, 55%)",
  "hsl(0, 72%, 51%)",
];

const CompanyComparison = () => {
  const { data: allCompanies = [], isLoading: loadingCompanies } = useCompanyDetails();
  const { data: allPlacements = [], isLoading: loadingPlacements } = useCompanyPlacements();
  const { grid, axis, tooltip } = useChartColors();

  const [selectedIds, setSelectedIds] = useState<string[]>(["tcs", "google", "deloitte"]);
  const [search, setSearch] = useState("");

  const toggleCompany = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 5 ? [...prev, id] : prev
    );

  const selected = allCompanies.filter((c) => selectedIds.includes(c.id));
  const filteredCompanies = allCompanies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Build year-wise hires per company from company_placements
  const yearWiseHiresMap = useMemo(() => {
    const map = new Map<string, Map<number, number>>();
    for (const row of allPlacements) {
      const companyId = allCompanies.find((c) => c.name === row.company)?.id;
      if (!companyId) continue;
      if (!map.has(companyId)) map.set(companyId, new Map());
      const yearMap = map.get(companyId)!;
      yearMap.set(row.year, (yearMap.get(row.year) ?? 0) + row.hires);
    }
    return map;
  }, [allPlacements, allCompanies]);

  const getYearWiseHires = useCallback((companyId: string) => {
    const yearMap = yearWiseHiresMap.get(companyId) ?? new Map<number, number>();
    return Array.from(yearMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, hires]) => ({ year, hires }));
  }, [yearWiseHiresMap]);

  const packageData = selected.map((c) => ({
    name: c.name,
    min: c.expected_pkg_min,
    avg: c.avg_package,
    max: c.highest_package,
  }));

  // Union of all years across selected companies
  const allYears = useMemo(() => {
    const s = new Set<number>();
    for (const c of selected) {
      for (const { year } of getYearWiseHires(c.id)) s.add(year);
    }
    return Array.from(s).sort((a, b) => a - b);
  }, [selected, getYearWiseHires]);

  const hiresData = allYears.map((year) => {
    const entry: Record<string, number | string> = { year: String(year) };
    for (const c of selected) {
      const found = getYearWiseHires(c.id).find((h) => h.year === year);
      entry[c.name] = found?.hires ?? 0;
    }
    return entry;
  });

  const radarData = [
    { metric: "Avg Package", fullMark: 35 },
    { metric: "Hires",       fullMark: 100 },
    { metric: "Selection %", fullMark: 50 },
    { metric: "Visit Prob",  fullMark: 100 },
    { metric: "Min CGPA",    fullMark: 10 },
  ].map((m) => {
    const entry: Record<string, number | string> = { metric: m.metric, fullMark: m.fullMark };
    for (const c of selected) {
      const hires = getYearWiseHires(c.id);
      if (m.metric === "Avg Package")  entry[c.name] = c.avg_package;
      else if (m.metric === "Hires")   entry[c.name] = hires[hires.length - 1]?.hires ?? 0;
      else if (m.metric === "Selection %") entry[c.name] = c.selection_ratio;
      else if (m.metric === "Visit Prob")  entry[c.name] = c.visit_probability;
      else if (m.metric === "Min CGPA")    entry[c.name] = c.min_cgpa;
    }
    return entry;
  });

  return (
    <DashboardLayout title="Company Comparison" subtitle="Compare Side by Side">
      <div className="space-y-6">

        {/* Company selector */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">Select Companies to Compare (max 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {loadingCompanies || loadingPlacements ? (
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-9 w-28 rounded-lg" />)}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No companies match your search</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {filteredCompanies.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={selectedIds.includes(c.id)}
                      onCheckedChange={() => toggleCompany(c.id)}
                      disabled={!selectedIds.includes(c.id) && selectedIds.length >= 5}
                    />
                    <span className="text-sm font-medium">{c.name}</span>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selected.length >= 2 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Package comparison */}
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-display">Package Comparison (LPA)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={packageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke={axis} />
                        <YAxis tick={{ fontSize: 12 }} stroke={axis} />
                        <Tooltip contentStyle={{ borderRadius: "0.75rem", border: `1px solid ${tooltip.border}`, background: tooltip.background, color: tooltip.color }} />
                        <Legend />
                        <Bar dataKey="min" fill="hsl(220, 60%, 45%)" name="Min" radius={[4,4,0,0]} />
                        <Bar dataKey="avg" fill="hsl(175, 55%, 40%)" name="Avg" radius={[4,4,0,0]} />
                        <Bar dataKey="max" fill="hsl(38, 92%, 55%)"  name="Max" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Radar */}
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-display">Multi-Metric Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke={grid} />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis tick={{ fontSize: 10 }} />
                        {selected.map((c, i) => (
                          <Radar key={c.id} name={c.name} dataKey={c.name}
                            stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
                        ))}
                        <Legend />
                        <Tooltip contentStyle={{ borderRadius: "0.75rem", border: `1px solid ${tooltip.border}`, background: tooltip.background, color: tooltip.color }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hiring trend */}
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-display">Hiring Trend Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hiresData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke={axis} />
                      <YAxis tick={{ fontSize: 12 }} stroke={axis} />
                      <Tooltip contentStyle={{ borderRadius: "0.75rem", border: `1px solid ${tooltip.border}`, background: tooltip.background, color: tooltip.color }} />
                      <Legend />
                      {selected.map((c, i) => (
                        <Bar key={c.id} dataKey={c.name} fill={CHART_COLORS[i]} radius={[4,4,0,0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Comparison table */}
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg font-display">Detailed Comparison Table</CardTitle>
                  <Button size="sm" variant="outline" className="gap-1.5"
                    onClick={() => exportToCsv("company_comparison.csv", selected.map(c => ({
                      company: c.name, sector: c.sector, avg_package_lpa: c.avg_package,
                      highest_package_lpa: c.highest_package, selection_ratio_pct: c.selection_ratio,
                      min_cgpa: c.min_cgpa, visit_probability_pct: c.visit_probability,
                      latest_hires: getYearWiseHires(c.id).at(-1)?.hires ?? 0,
                    })))}
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      {selected.map((c) => <TableHead key={c.id} className="text-center">{c.name}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "Sector",           render: (c: typeof selected[0]) => <Badge variant="secondary" className="text-xs">{c.sector}</Badge> },
                      { label: "Avg Package",       render: (c: typeof selected[0]) => `₹${c.avg_package}L` },
                      { label: "Highest Package",   render: (c: typeof selected[0]) => `₹${c.highest_package}L` },
                      { label: "Latest Hires",      render: (c: typeof selected[0]) => { const h = getYearWiseHires(c.id); return h[h.length - 1]?.hires ?? "—"; } },
                      { label: "Selection Ratio",   render: (c: typeof selected[0]) => `${c.selection_ratio}%` },
                      { label: "Min CGPA",          render: (c: typeof selected[0]) => c.min_cgpa },
                      { label: "Departments",       render: (c: typeof selected[0]) => c.hiring_departments.join(", ") },
                      { label: "Job Roles",         render: (c: typeof selected[0]) => <span className="text-xs">{c.job_roles.join(", ")}</span> },
                      { label: "Visit Probability", render: (c: typeof selected[0]) => <span className="font-semibold">{c.visit_probability}%</span> },
                    ].map(({ label, render }) => (
                      <TableRow key={label}>
                        <TableCell className="font-medium">{label}</TableCell>
                        {selected.map((c) => (
                          <TableCell key={c.id} className="text-center">{render(c)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-12">Select at least 2 companies to compare.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyComparison;
