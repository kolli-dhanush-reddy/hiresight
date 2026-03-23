import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useDepartmentPlacements } from "@/hooks/usePlacementData";
import { useChartColors } from "@/hooks/useChartColors";

const colors = [
  "hsl(175, 55%, 40%)",
  "hsl(220, 60%, 45%)",
  "hsl(38, 92%, 55%)",
  "hsl(280, 50%, 55%)",
  "hsl(0, 72%, 51%)",
  "hsl(145, 55%, 42%)",
];

const DepartmentChart = () => {
  const { data = [], isLoading, isError } = useDepartmentPlacements(2024);
  const { grid, axis, tooltip } = useChartColors();

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Department-wise Performance</CardTitle>
        <p className="text-sm text-muted-foreground">Placement percentage by department (2024)</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : isError ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
            Failed to load data
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
            No department data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke={axis} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 12 }} stroke={axis} width={50} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Placed"]}
                  contentStyle={{ borderRadius: "0.75rem", border: `1px solid ${tooltip.border}`, background: tooltip.background, color: tooltip.color }}
                />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={28}>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DepartmentChart;
