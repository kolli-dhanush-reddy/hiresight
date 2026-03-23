import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useSalaryData } from "@/hooks/usePlacementData";
import { useChartColors } from "@/hooks/useChartColors";

const SalaryChart = () => {
  const { data: rows = [], isLoading, isError } = useSalaryData();
  const { grid, axis, tooltip } = useChartColors();

  const chartData = rows.map((d) => ({
    year: String(d.year),
    min: d.min_salary,
    avg: d.avg_salary,
    max: d.max_salary,
  }));

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Salary Packages (LPA)</CardTitle>
        <p className="text-sm text-muted-foreground">Minimum, average, and highest salary trends</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : isError ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
            Failed to load data
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
            No salary data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke={axis} />
                <YAxis tick={{ fontSize: 12 }} stroke={axis} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: `1px solid ${tooltip.border}`, background: tooltip.background, color: tooltip.color }} />
                <Legend />
                <Line type="monotone" dataKey="max" stroke="hsl(38, 92%, 55%)" strokeWidth={2.5} name="Highest" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="avg" stroke="hsl(175, 55%, 40%)" strokeWidth={2.5} name="Average" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="min" stroke="hsl(220, 60%, 45%)" strokeWidth={2.5} name="Minimum" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryChart;
