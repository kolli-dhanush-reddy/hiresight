import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useTopRecruiters } from "@/hooks/usePlacementData";
import { exportToCsv } from "@/lib/exportCsv";

type SortKey = "company" | "hires" | "avg_package";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 8;

const TopRecruitersTable = () => {
  const { data: recruiters = [], isLoading, isError } = useTopRecruiters();
  const [sortKey, setSortKey] = useState<SortKey>("hires");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
    setPage(0);
  };

  const sorted = [...recruiters].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === "asc"
      ? <ArrowUp className="w-3 h-3 ml-1 text-secondary" />
      : <ArrowDown className="w-3 h-3 ml-1 text-secondary" />;
  };

  const handleExport = () => {
    exportToCsv("top_recruiters.csv", sorted.map((r, i) => ({
      rank: i + 1,
      company: r.company,
      hires: r.hires,
      avg_package_lpa: r.avg_package,
    })));
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="text-lg font-display">Top Recruiting Companies</CardTitle>
            <p className="text-sm text-muted-foreground">Companies ranked by number of hires</p>
          </div>
          {!isLoading && !isError && sorted.length > 0 && (
            <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded" />)}
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Failed to load recruiters</div>
        ) : sorted.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">No recruiter data available</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>
                    <button onClick={() => handleSort("company")} className="flex items-center hover:text-foreground transition-colors">
                      Company <SortIcon col="company" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button onClick={() => handleSort("hires")} className="flex items-center ml-auto hover:text-foreground transition-colors">
                      Hires <SortIcon col="hires" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button onClick={() => handleSort("avg_package")} className="flex items-center ml-auto hover:text-foreground transition-colors">
                      Avg Package (LPA) <SortIcon col="avg_package" />
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((company, i) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium text-muted-foreground">{page * PAGE_SIZE + i + 1}</TableCell>
                    <TableCell className="font-medium">{company.company}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0">
                        {company.hires}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">₹{company.avg_package}L</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                <span>Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="px-2">{page + 1} / {totalPages}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TopRecruitersTable;
