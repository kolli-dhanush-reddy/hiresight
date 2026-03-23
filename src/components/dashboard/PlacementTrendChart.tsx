import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useYearWisePlacement, usePredictionData } from "@/hooks/usePlacementData";
import { useChartColors } from "@/hooks/useChartColors";

const PlacementTrendChart = () => {
  const { data: placements = [], isLoading: l1, isError: e1 } = useYearWisePlacement();
  const { data: predictions = [], isLoading: l2, isError: e2 } = usePredictionData();

  const isLoading = l1 || l2;
  const isError = e1 || e2;
  const { grid, axis, tooltip } = useChartColors();

  const allData = [
    ...placements.map((d) => ({ year: String(d.year), percentage: d.percentage, predicted: null as number | null })),
    ...predictions.map((d) => ({ year: String(d.year), percentage: null as number | null, predicted: d.predicted })),
  ];

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display">Placement Trend & Prediction</CardTitle>
        <p className="text-sm text-muted-foreground">Year-wise placement percentage with future predictions</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : isError ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
            Failed to load data
          </div>
        ) : allData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
            No placement data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={allData}>
                <defs>
                  <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(175, 55%, 40%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(175, 55%, 40%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke={axis} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 12 }} stroke={axis} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: `1px solid ${tooltip.border}`, background: tooltip.background, color: tooltip.color }} />
                <Area type="monotone" dataKey="percentage" stroke="hsl(175, 55%, 40%)" strokeWidth={2.5} fill="url(#colorPct)" name="Actual" connectNulls={false} />
                <Area type="monotone" dataKey="predicted" stroke="hsl(38, 92%, 55%)" strokeWidth={2.5} fill="url(#colorPred)" strokeDasharray="5 5" name="Predicted" connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {!isLoading && !isError && allData.length > 0 && (
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-secondary inline-block" /> Actual</span>
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 inline-block" style={{ borderTop: "2px dashed hsl(38, 92%, 55%)" }} /> Predicted</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlacementTrendChart;
