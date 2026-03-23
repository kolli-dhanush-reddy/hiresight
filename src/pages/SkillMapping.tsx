import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Download } from "lucide-react";
import { useSkillDemand, useCompanyDetails } from "@/hooks/usePlacementData";
import { useChartColors } from "@/hooks/useChartColors";
import { exportToCsv } from "@/lib/exportCsv";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";

const trendIcon = (trend: string) => {
  if (trend === "rising")   return <ArrowUp className="w-3 h-3 text-chart-6" />;
  if (trend === "declining") return <ArrowDown className="w-3 h-3 text-destructive" />;
  return <ArrowRight className="w-3 h-3 text-muted-foreground" />;
};

const categoryColor: Record<string, string> = {
  programming: "bg-chart-1/15 text-chart-1 border-0",
  framework:   "bg-chart-2/15 text-chart-2 border-0",
  soft:        "bg-chart-3/15 text-chart-3 border-0",
  tool:        "bg-chart-4/15 text-chart-4 border-0",
  domain:      "bg-chart-6/15 text-chart-6 border-0",
};

const barColors: Record<string, string> = {
  programming: "hsl(175, 55%, 40%)",
  framework:   "hsl(220, 60%, 45%)",
  soft:        "hsl(38, 92%, 55%)",
  tool:        "hsl(280, 50%, 55%)",
  domain:      "hsl(145, 55%, 42%)",
};

const SkillMapping = () => {
  const { data: skills = [], isLoading: loadingSkills, isError: skillsError } = useSkillDemand();
  const { data: companies = [], isLoading: loadingCompanies } = useCompanyDetails();
  const { grid, axis, tooltip } = useChartColors();

  const [catFilter, setCatFilter]         = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [skillSearch, setSkillSearch]     = useState("");

  const filteredSkills = skills
    .filter((s) => catFilter === "all" || s.category === catFilter)
    .filter((s) => companyFilter === "all" || s.companies.includes(companyFilter))
    .filter((s) => s.skill.toLowerCase().includes(skillSearch.toLowerCase()));

  const emergingSkills = skills.filter((s) => s.trend === "rising");

  return (
    <DashboardLayout title="Skill Mapping" subtitle="Job Role & Skill Intelligence">
      <div className="space-y-6">

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="pl-9 w-[180px]"
              />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="framework">Frameworks</SelectItem>
                <SelectItem value="soft">Soft Skills</SelectItem>
                <SelectItem value="tool">Tools</SelectItem>
                <SelectItem value="domain">Domain</SelectItem>
              </SelectContent>
            </Select>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Company" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {filteredSkills.length > 0 && (
            <Button size="sm" variant="outline" className="gap-1.5"
              onClick={() => exportToCsv("skills.csv", filteredSkills.map(s => ({
                skill: s.skill, category: s.category, demand_count: s.demand_count, trend: s.trend, companies: s.companies.join("; "),
              })))}>
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demand bar chart */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display">Skill Demand Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">Number of companies requiring each skill</p>
            </CardHeader>
            <CardContent>
              {loadingSkills ? (
                <Skeleton className="h-[400px] w-full rounded-lg" />
              ) : skillsError ? (
                <div className="h-[400px] flex items-center justify-center text-sm text-muted-foreground">Failed to load skills</div>
              ) : filteredSkills.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-sm text-muted-foreground">No skills match your filters</div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredSkills} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 12 }} stroke={axis} />
                      <YAxis type="category" dataKey="skill" width={100} tick={{ fontSize: 11 }} stroke={axis} />
                      <Tooltip contentStyle={{ borderRadius: "0.75rem", border: `1px solid ${tooltip.border}`, background: tooltip.background, color: tooltip.color }} formatter={(v: number) => [`${v} companies`, "Demand"]} />
                      <Bar dataKey="demand_count" radius={[0, 6, 6, 0]} barSize={20}>
                        {filteredSkills.map((s, i) => (
                          <Cell key={i} fill={barColors[s.category] ?? "hsl(175, 55%, 40%)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emerging skills */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display">🔥 Emerging Skills</CardTitle>
              <p className="text-sm text-muted-foreground">Skills with rising demand trends</p>
            </CardHeader>
            <CardContent>
              {loadingSkills ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                </div>
              ) : emergingSkills.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No emerging skills found</div>
              ) : (
                <div className="space-y-3">
                  {emergingSkills.map((s) => (
                    <div key={s.skill} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-2">
                        {trendIcon(s.trend)}
                        <span className="font-medium">{s.skill}</span>
                        <Badge variant="secondary" className={categoryColor[s.category] ?? ""}>{s.category}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{s.demand_count} companies</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Company → Role → Skills table */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">Company → Role → Skills Mapping</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loadingCompanies ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded" />)}
              </div>
            ) : companies.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No company data available</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Job Roles</TableHead>
                    <TableHead>Required Skills</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium whitespace-nowrap">{c.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {c.job_roles.map((r) => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {c.required_skills.map((s) => (
                            <Badge key={s} variant="secondary" className="bg-secondary/10 text-secondary border-0 text-xs">{s}</Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default SkillMapping;
