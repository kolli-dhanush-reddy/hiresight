import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHiringHeatmap } from "@/hooks/usePlacementData";

const DEPARTMENTS = ["CSE", "IT", "ECE", "EE", "ME", "CE"];

const getColor = (value: number) => {
  if (value === 0) return "bg-muted";
  if (value <= 3) return "bg-secondary/20";
  if (value <= 8) return "bg-secondary/40";
  if (value <= 15) return "bg-secondary/60";
  if (value <= 25) return "bg-secondary/80";
  return "bg-secondary";
};

const getTextColor = (value: number) => {
  if (value === 0) return "text-muted-foreground/40";
  if (value <= 15) return "text-foreground";
  return "text-secondary-foreground";
};

const HiringHeatmap = () => {
  const { data: rows = [], isLoading, isError } = useHiringHeatmap(2024);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Company-Department Hiring Heatmap</CardTitle>
        <p className="text-sm text-muted-foreground">Number of hires per company per department (2024)</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded" />)}
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Failed to load heatmap data</div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">No heatmap data available</div>
        ) : (
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="min-w-[480px] w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2 font-medium text-muted-foreground whitespace-nowrap">Company</th>
                  {DEPARTMENTS.map((d) => (
                    <th key={d} className="p-2 text-center font-medium text-muted-foreground">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.company} className="border-t border-border">
                    <td className="p-2 font-medium whitespace-nowrap">{row.company}</td>
                    {DEPARTMENTS.map((dept) => {
                      const val = ((row as Record<string, unknown>)[dept] as number) ?? 0;
                      return (
                        <td key={dept} className="p-1 text-center">
                          <div className={`rounded-md py-1.5 px-2 text-xs font-semibold ${getColor(val)} ${getTextColor(val)}`}>
                            {val || "—"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && !isError && rows.length > 0 && (
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <span className="w-6 h-4 rounded bg-muted" />
            <span className="w-6 h-4 rounded bg-secondary/20" />
            <span className="w-6 h-4 rounded bg-secondary/40" />
            <span className="w-6 h-4 rounded bg-secondary/60" />
            <span className="w-6 h-4 rounded bg-secondary/80" />
            <span className="w-6 h-4 rounded bg-secondary" />
            <span>More</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HiringHeatmap;
