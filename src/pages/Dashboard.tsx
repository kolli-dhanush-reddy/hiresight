import { Users, TrendingUp, Building2, IndianRupee } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import PlacementTrendChart from "@/components/dashboard/PlacementTrendChart";
import DepartmentChart from "@/components/dashboard/DepartmentChart";
import SalaryChart from "@/components/dashboard/SalaryChart";
import TopRecruitersTable from "@/components/dashboard/TopRecruitersTable";
import CompanyHiringTrend from "@/components/dashboard/CompanyHiringTrend";
import HiringHeatmap from "@/components/dashboard/HiringHeatmap";
import { useYearWisePlacement } from "@/hooks/usePlacementData";
import { useMemo, useState } from "react";

const Dashboard = () => {
  const { data: placements = [], isLoading } = useYearWisePlacement();

  const years = useMemo(
    () => [...new Set(placements.map((d) => String(d.year)))].sort(),
    [placements]
  );

  const [selectedYear, setSelectedYear] = useState("2024");

  // Update selectedYear to latest when data loads (if current selection not in list)
  const latestYear = years[years.length - 1];
  const effectiveYear = years.includes(selectedYear) ? selectedYear : (latestYear ?? "2024");

  const yearData = useMemo(
    () => placements.find((d) => String(d.year) === effectiveYear),
    [placements, effectiveYear]
  );

  const prevYearData = useMemo(
    () => placements.find((d) => String(d.year) === String(Number(effectiveYear) - 1)),
    [placements, effectiveYear]
  );

  const placementTrend =
    yearData && prevYearData
      ? (((yearData.percentage - prevYearData.percentage) / prevYearData.percentage) * 100).toFixed(1)
      : null;

  return (
    <DashboardLayout title="Dashboard" subtitle="MLRIT Placement Overview">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={effectiveYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {(years.length ? years : ["2019", "2020", "2021", "2022", "2023", "2024"]).map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Showing data for {effectiveYear}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)
          ) : (
            <>
              <StatCard
                title="Job Offers"
                value={yearData ? String(yearData.placed) : "—"}
                subtitle={`total offers in ${effectiveYear}`}
                icon={Users}
                trend={placementTrend ? { value: `${Math.abs(Number(placementTrend))}%`, positive: Number(placementTrend) >= 0 } : undefined}
              />
              <StatCard
                title="Placement Rate"
                value={yearData ? `${yearData.percentage}%` : "—"}
                subtitle="of eligible students"
                icon={TrendingUp}
                trend={placementTrend ? { value: `${Math.abs(Number(placementTrend))}%`, positive: Number(placementTrend) >= 0 } : undefined}
              />
              <StatCard
                title="Companies Visited"
                value={yearData ? String(yearData.companies_visited) : "—"}
                subtitle="across all sectors"
                icon={Building2}
              />
              <StatCard
                title="Highest Package"
                value={yearData ? `₹${yearData.highest_salary}L` : "—"}
                subtitle="per annum"
                icon={IndianRupee}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlacementTrendChart />
          <DepartmentChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalaryChart />
          <CompanyHiringTrend />
        </div>

        <HiringHeatmap />

        <TopRecruitersTable />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
