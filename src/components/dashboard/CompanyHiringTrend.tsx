import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useSectorTrend } from "@/hooks/usePlacementData";
import { useChartColors } from "@/hooks/useChartColors";

const CompanyHiringTrend = () => {
  const { data = [], isLoading, isError } = useSectorTrend();
  const { grid, axis, tooltip } = useChartColors();

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Company Hiring by Sector</CardTitle>
        <p className="text-sm text-muted-foreground">Sector-wise hiring trends across years</p>
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
            No sector data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke={axis} />
                <YAxis tick={{ fontSize: 12 }} stroke={axis} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: `1px solid ${tooltip.border}`, background: tooltip.background, color: tooltip.color }} />
                <Legend />
                <Bar dataKey="it"         stackId="a" fill="hsl(175, 55%, 40%)"  name="IT"         radius={[0, 0, 0, 0]} />
                <Bar dataKey="consulting" stackId="a" fill="hsl(220, 60%, 45%)"  name="Consulting" />
                <Bar dataKey="finance"    stackId="a" fill="hsl(38, 92%, 55%)"   name="Finance" />
                <Bar dataKey="core"       stackId="a" fill="hsl(280, 50%, 55%)"  name="Core" />
                <Bar dataKey="startup"    stackId="a" fill="hsl(145, 55%, 42%)"  name="Startup"    radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyHiringTrend;
