import { useState, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Upload, Filter, AlertTriangle, Users, Shield, ShieldOff, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";
import { exportToCsv } from "@/lib/exportCsv";

const ADMIN_PAGE_SIZE = 10;

// Simple pagination controls
const Pagination = ({ page, total, pageSize, onChange }: { page: number; total: number; pageSize: number; onChange: (p: number) => void }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
      <span>Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total}</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="px-2">{page + 1} / {totalPages}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Shared types
type DbError = { message: string };
type YWPRow = Tables<"year_wise_placement">;
type SalaryRow = Tables<"salary_data">;
type RecruiterRow = Tables<"top_recruiters">;
type CompanyPlacementRow = Tables<"company_placements">;
type DeptPlacementRow = Tables<"department_placements">;
type PredictionRow = Tables<"prediction_data">;
// CSV rows are genuinely dynamic — typed as Record
type CsvRow = Record<string, string>;
// Edit form state — all fields as strings for input compatibility, id optional
type EditState = Record<string, string | number | null | undefined>;

// ── Delete Confirmation Dialog ──
const DeleteConfirm = ({ open, onClose, onConfirm, isPending }: { open: boolean; onClose: () => void; onConfirm: () => void; isPending: boolean }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" /> Confirm Delete
        </DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">This action cannot be undone. Are you sure you want to delete this record?</p>
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isPending}>{isPending ? "Deleting..." : "Delete"}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ── CSV Import Component ──
const CsvImport = ({ onImport, fields, tableName }: { onImport: (rows: CsvRow[]) => void; fields: string[]; tableName: string }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<CsvRow[] | null>(null);
  const [open, setOpen] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split("\n");
      if (lines.length < 2) return;
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
      const rows: CsvRow[] = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim());
        const obj: CsvRow = {};
        headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
        return obj;
      });
      setPreview(rows);
      setOpen(true);
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
      <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
        <Upload className="w-4 h-4 mr-1" /> Import CSV
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CSV Preview — {tableName}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {preview?.length ?? 0} rows found. Expected columns: <code className="text-xs">{fields.join(", ")}</code>
          </p>
          {preview && preview.length > 0 && (
            <div className="overflow-x-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(preview[0]).map(k => <TableHead key={k} className="text-xs">{k}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.slice(0, 10).map((row, i) => (
                    <TableRow key={i}>
                      {Object.values(row).map((v, j) => <TableCell key={j} className="text-xs">{v as string}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {preview.length > 10 && <p className="text-xs text-muted-foreground p-2">...and {preview.length - 10} more rows</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { onImport(preview ?? []); setOpen(false); setPreview(null); }}>
              Import {preview?.length ?? 0} rows
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ── Year Filter ──
const YearFilter = ({ years, value, onChange }: { years: (string | number)[]; value: string; onChange: (v: string) => void }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-[140px] h-9">
      <Filter className="w-3 h-3 mr-1" />
      <SelectValue placeholder="All Years" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Years</SelectItem>
      {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
    </SelectContent>
  </Select>
);

// ── Year Wise Placement Tab ──
const YearPlacementTab = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editRow, setEditRow] = useState<EditState | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState("all");

  const { data: rows = [] } = useQuery({
    queryKey: ["year_wise_placement"],
    queryFn: async () => {
      const { data, error } = await supabase.from("year_wise_placement").select("*").order("year");
      if (error) throw error;
      return data;
    },
  });

  const years = useMemo(() => [...new Set(rows.map(r => r.year))].sort((a, b) => a - b), [rows]);
  const filtered = yearFilter === "all" ? rows : rows.filter(r => String(r.year) === yearFilter);

  const upsert = useMutation({
    mutationFn: async (row: EditState) => {
      const payload = { year: Number(row.year), placed: Number(row.placed), unplaced: Number(row.unplaced), percentage: Number(row.percentage), companies_visited: Number(row.companies_visited), highest_salary: Number(row.highest_salary) };
      if (row.id) {
        const { error } = await supabase.from("year_wise_placement").update(payload).eq("id", row.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("year_wise_placement").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["year_wise_placement"] }); toast({ title: "Saved!" }); setOpen(false); setEditRow(null); },
    onError: (e: DbError) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("year_wise_placement").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["year_wise_placement"] }); toast({ title: "Deleted" }); setDeleteId(null); },
  });

  const bulkImport = useMutation({
    mutationFn: async (csvRows: CsvRow[]) => {
      const payload = csvRows.map(r => ({ year: Number(r.year), placed: Number(r.placed), unplaced: Number(r.unplaced), percentage: Number(r.percentage), companies_visited: Number(r.companies_visited || "0"), highest_salary: Number(r.highest_salary || "0") }));
      const { error } = await supabase.from("year_wise_placement").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["year_wise_placement"] }); toast({ title: `Imported successfully!` }); },
    onError: (e: DbError) => toast({ title: "Import Error", description: e.message, variant: "destructive" }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
        <div>
          <CardTitle className="text-lg">Year-wise Placement</CardTitle>
          <CardDescription>{filtered.length} records</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <YearFilter years={years} value={yearFilter} onChange={setYearFilter} />
          <CsvImport onImport={(rows) => bulkImport.mutate(rows)} fields={["year", "placed", "unplaced", "percentage", "companies_visited", "highest_salary"]} tableName="Year Placement" />
          <Button size="sm" onClick={() => { setEditRow({ year: "", placed: 0, unplaced: 0, percentage: 0, companies_visited: 0, highest_salary: 0 }); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Year</TableHead><TableHead>Placed</TableHead><TableHead>Unplaced</TableHead><TableHead>%</TableHead><TableHead>Companies</TableHead><TableHead>Highest (LPA)</TableHead><TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell><Badge variant="outline">{r.year}</Badge></TableCell>
                  <TableCell>{r.placed}</TableCell>
                  <TableCell>{r.unplaced}</TableCell>
                  <TableCell>{r.percentage}%</TableCell>
                  <TableCell>{r.companies_visited}</TableCell>
                  <TableCell>₹{r.highest_salary}L</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditRow({ ...r }); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No records found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editRow?.id ? "Edit" : "Add"} Placement Data</DialogTitle></DialogHeader>
            {editRow && (
              <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(editRow); }} className="space-y-4">
                <div><Label>Year</Label><Input placeholder="e.g. 2025-26" value={editRow.year} onChange={(e) => setEditRow({ ...editRow, year: e.target.value })} required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Placed</Label><Input type="number" value={editRow.placed} onChange={(e) => setEditRow({ ...editRow, placed: e.target.value })} required /></div>
                  <div><Label>Unplaced</Label><Input type="number" value={editRow.unplaced} onChange={(e) => setEditRow({ ...editRow, unplaced: e.target.value })} required /></div>
                  <div><Label>Percentage</Label><Input type="number" value={editRow.percentage} onChange={(e) => setEditRow({ ...editRow, percentage: e.target.value })} required /></div>
                  <div><Label>Companies Visited</Label><Input type="number" value={editRow.companies_visited} onChange={(e) => setEditRow({ ...editRow, companies_visited: e.target.value })} required /></div>
                  <div className="col-span-2"><Label>Highest Salary (LPA)</Label><Input type="number" step="0.1" value={editRow.highest_salary} onChange={(e) => setEditRow({ ...editRow, highest_salary: e.target.value })} required /></div>
                </div>
                <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && remove.mutate(deleteId)} isPending={remove.isPending} />
      </CardContent>
    </Card>
  );
};

// ── Salary Tab ──
const SalaryTab = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editRow, setEditRow] = useState<EditState | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState("all");

  const { data: rows = [] } = useQuery({
    queryKey: ["salary_data"],
    queryFn: async () => { const { data, error } = await supabase.from("salary_data").select("*").order("year"); if (error) throw error; return data; },
  });

  const years = useMemo(() => [...new Set(rows.map(r => r.year))].sort((a, b) => a - b), [rows]);
  const filtered = yearFilter === "all" ? rows : rows.filter(r => String(r.year) === yearFilter);

  const upsert = useMutation({
    mutationFn: async (row: EditState) => {
      const payload = { year: Number(row.year), min_salary: Number(row.min_salary), avg_salary: Number(row.avg_salary), max_salary: Number(row.max_salary) };
      if (row.id) { const { error } = await supabase.from("salary_data").update(payload).eq("id", row.id); if (error) throw error; }
      else { const { error } = await supabase.from("salary_data").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["salary_data"] }); toast({ title: "Saved!" }); setOpen(false); },
    onError: (e: DbError) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("salary_data").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["salary_data"] }); toast({ title: "Deleted" }); setDeleteId(null); },
  });

  const bulkImport = useMutation({
    mutationFn: async (csvRows: CsvRow[]) => {
      const payload = csvRows.map(r => ({ year: r.year, min_salary: Number(r.min_salary), avg_salary: Number(r.avg_salary), max_salary: Number(r.max_salary) }));
      const { error } = await supabase.from("salary_data").insert(payload); if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["salary_data"] }); toast({ title: "Imported!" }); },
    onError: (e: DbError) => toast({ title: "Import Error", description: e.message, variant: "destructive" }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
        <div><CardTitle className="text-lg">Salary Data</CardTitle><CardDescription>{filtered.length} records</CardDescription></div>
        <div className="flex items-center gap-2">
          <YearFilter years={years} value={yearFilter} onChange={setYearFilter} />
          <CsvImport onImport={(rows) => bulkImport.mutate(rows)} fields={["year", "min_salary", "avg_salary", "max_salary"]} tableName="Salary Data" />
          <Button size="sm" onClick={() => { setEditRow({ year: "", min_salary: 0, avg_salary: 0, max_salary: 0 }); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader><TableRow className="bg-muted/50"><TableHead>Year</TableHead><TableHead>Min (LPA)</TableHead><TableHead>Avg (LPA)</TableHead><TableHead>Max (LPA)</TableHead><TableHead className="w-24 text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell><Badge variant="outline">{r.year}</Badge></TableCell>
                  <TableCell>₹{r.min_salary}L</TableCell><TableCell>₹{r.avg_salary}L</TableCell><TableCell>₹{r.max_salary}L</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditRow({ ...r }); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No records found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editRow?.id ? "Edit" : "Add"} Salary Data</DialogTitle></DialogHeader>
            {editRow && (
              <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(editRow); }} className="space-y-4">
                <div><Label>Year</Label><Input placeholder="e.g. 2025-26" value={editRow.year} onChange={(e) => setEditRow({ ...editRow, year: e.target.value })} required /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Min</Label><Input type="number" step="0.1" value={editRow.min_salary} onChange={(e) => setEditRow({ ...editRow, min_salary: e.target.value })} required /></div>
                  <div><Label>Avg</Label><Input type="number" step="0.1" value={editRow.avg_salary} onChange={(e) => setEditRow({ ...editRow, avg_salary: e.target.value })} required /></div>
                  <div><Label>Max</Label><Input type="number" step="0.1" value={editRow.max_salary} onChange={(e) => setEditRow({ ...editRow, max_salary: e.target.value })} required /></div>
                </div>
                <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && remove.mutate(deleteId)} isPending={remove.isPending} />
      </CardContent>
    </Card>
  );
};

// ── Top Recruiters Tab ──
const RecruitersTab = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editRow, setEditRow] = useState<EditState | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["top_recruiters"],
    queryFn: async () => { const { data, error } = await supabase.from("top_recruiters").select("*").order("hires", { ascending: false }); if (error) throw error; return data; },
  });

  const upsert = useMutation({
    mutationFn: async (row: EditState) => {
      const payload = { company: row.company, hires: Number(row.hires), avg_package: Number(row.avg_package) };
      if (row.id) { const { error } = await supabase.from("top_recruiters").update(payload).eq("id", row.id); if (error) throw error; }
      else { const { error } = await supabase.from("top_recruiters").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["top_recruiters"] }); toast({ title: "Saved!" }); setOpen(false); },
    onError: (e: DbError) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("top_recruiters").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["top_recruiters"] }); toast({ title: "Deleted" }); setDeleteId(null); },
  });

  const bulkImport = useMutation({
    mutationFn: async (csvRows: CsvRow[]) => {
      const payload = csvRows.map(r => ({ company: r.company, hires: Number(r.hires), avg_package: Number(r.avg_package) }));
      const { error } = await supabase.from("top_recruiters").insert(payload); if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["top_recruiters"] }); toast({ title: "Imported!" }); },
    onError: (e: DbError) => toast({ title: "Import Error", description: e.message, variant: "destructive" }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
        <div><CardTitle className="text-lg">Top Recruiters</CardTitle><CardDescription>{rows.length} companies</CardDescription></div>
        <div className="flex items-center gap-2">
          <CsvImport onImport={(rows) => bulkImport.mutate(rows)} fields={["company", "hires", "avg_package"]} tableName="Top Recruiters" />
          <Button size="sm" onClick={() => { setEditRow({ company: "", hires: 0, avg_package: 0 }); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader><TableRow className="bg-muted/50"><TableHead>Company</TableHead><TableHead>Hires</TableHead><TableHead>Avg Package (LPA)</TableHead><TableHead className="w-24 text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{r.company}</TableCell><TableCell>{r.hires}</TableCell><TableCell>₹{r.avg_package}L</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditRow({ ...r }); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No records found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editRow?.id ? "Edit" : "Add"} Recruiter</DialogTitle></DialogHeader>
            {editRow && (
              <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(editRow); }} className="space-y-4">
                <div><Label>Company</Label><Input value={editRow.company} onChange={(e) => setEditRow({ ...editRow, company: e.target.value })} required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Hires</Label><Input type="number" value={editRow.hires} onChange={(e) => setEditRow({ ...editRow, hires: e.target.value })} required /></div>
                  <div><Label>Avg Package (LPA)</Label><Input type="number" step="0.1" value={editRow.avg_package} onChange={(e) => setEditRow({ ...editRow, avg_package: e.target.value })} required /></div>
                </div>
                <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && remove.mutate(deleteId)} isPending={remove.isPending} />
      </CardContent>
    </Card>
  );
};

// ── Company Placements Tab ──
const CompanyPlacementsTab = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editRow, setEditRow] = useState<EditState | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data: rows = [] } = useQuery({
    queryKey: ["company_placements_admin"],
    queryFn: async () => { const { data, error } = await supabase.from("company_placements").select("*").order("year").order("company"); if (error) throw error; return data; },
  });

  const years = useMemo(() => [...new Set(rows.map(r => r.year))].sort((a, b) => a - b), [rows]);
  const filtered = useMemo(() => {
    let result = rows;
    if (yearFilter !== "all") result = result.filter(r => String(r.year) === yearFilter);
    if (search) result = result.filter(r => r.company.toLowerCase().includes(search.toLowerCase()) || (r.job_role?.toLowerCase().includes(search.toLowerCase())));
    return result;
  }, [rows, yearFilter, search]);

  const paged = filtered.slice(page * ADMIN_PAGE_SIZE, (page + 1) * ADMIN_PAGE_SIZE);

  const upsert = useMutation({
    mutationFn: async (row: EditState) => {
      const payload = { company: row.company, year: Number(row.year), hires: Number(row.hires), salary_pa: Number(row.salary_pa), job_role: row.job_role || null };
      if (row.id) { const { error } = await supabase.from("company_placements").update(payload).eq("id", row.id); if (error) throw error; }
      else { const { error } = await supabase.from("company_placements").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["company_placements_admin"] }); toast({ title: "Saved!" }); setOpen(false); setEditRow(null); },
    onError: (e: DbError) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("company_placements").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["company_placements_admin"] }); toast({ title: "Deleted" }); setDeleteId(null); },
  });

  const bulkImport = useMutation({
    mutationFn: async (csvRows: CsvRow[]) => {
      const payload = csvRows.map(r => ({ company: r.company, year: r.year, hires: Number(r.hires), salary_pa: Number(r.salary_pa), job_role: r.job_role || null }));
      const { error } = await supabase.from("company_placements").insert(payload); if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["company_placements_admin"] }); toast({ title: "Imported!" }); },
    onError: (e: DbError) => toast({ title: "Import Error", description: e.message, variant: "destructive" }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
        <div><CardTitle className="text-lg">Company Placements</CardTitle><CardDescription>{filtered.length} of {rows.length} records</CardDescription></div>
        <div className="flex items-center gap-2 flex-wrap">
          <Input placeholder="Search company..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="w-[160px] h-9" />
          <YearFilter years={years} value={yearFilter} onChange={(v) => { setYearFilter(v); setPage(0); }} />
          <Button size="sm" variant="outline" className="gap-1" onClick={() => exportToCsv("company_placements.csv", filtered.map(r => ({ company: r.company, year: r.year, hires: r.hires, salary_lpa: r.salary_pa, job_role: r.job_role ?? "" })))}><Download className="w-3.5 h-3.5" /> Export</Button>
          <CsvImport onImport={(rows) => bulkImport.mutate(rows)} fields={["company", "year", "hires", "salary_pa", "job_role"]} tableName="Company Placements" />
          <Button size="sm" onClick={() => { setEditRow({ company: "", year: "", hires: 0, salary_pa: 0, job_role: "" }); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Company</TableHead><TableHead>Year</TableHead><TableHead>Hires</TableHead><TableHead>Salary (LPA)</TableHead><TableHead>Job Role</TableHead><TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{r.company}</TableCell>
                  <TableCell><Badge variant="outline">{r.year}</Badge></TableCell>
                  <TableCell>{r.hires}</TableCell>
                  <TableCell>₹{r.salary_pa}L</TableCell>
                  <TableCell className="text-muted-foreground">{r.job_role || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditRow({ ...r }); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No records found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <Pagination page={page} total={filtered.length} pageSize={ADMIN_PAGE_SIZE} onChange={setPage} />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editRow?.id ? "Edit" : "Add"} Company Placement</DialogTitle></DialogHeader>
            {editRow && (
              <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(editRow); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Company</Label><Input value={editRow.company} onChange={(e) => setEditRow({ ...editRow, company: e.target.value })} required /></div>
                  <div><Label>Year</Label><Input placeholder="e.g. 2025-26" value={editRow.year} onChange={(e) => setEditRow({ ...editRow, year: e.target.value })} required /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Hires</Label><Input type="number" value={editRow.hires} onChange={(e) => setEditRow({ ...editRow, hires: e.target.value })} required /></div>
                  <div><Label>Salary (LPA)</Label><Input type="number" step="0.1" value={editRow.salary_pa} onChange={(e) => setEditRow({ ...editRow, salary_pa: e.target.value })} required /></div>
                </div>
                <div><Label>Job Role (optional)</Label><Input value={editRow.job_role || ""} onChange={(e) => setEditRow({ ...editRow, job_role: e.target.value })} /></div>
                <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && remove.mutate(deleteId)} isPending={remove.isPending} />
      </CardContent>
    </Card>
  );
};

// ── Department Placements Tab ──
const DepartmentPlacementsTab = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editRow, setEditRow] = useState<EditState | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState("all");
  const [deptPage, setDeptPage] = useState(0);

  const { data: rows = [] } = useQuery({
    queryKey: ["department_placements_admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("department_placements").select("*").order("year").order("department");
      if (error) throw error;
      return data;
    },
  });

  const years = useMemo(() => [...new Set(rows.map(r => r.year))].sort((a, b) => a - b), [rows]);
  const filtered = yearFilter === "all" ? rows : rows.filter(r => String(r.year) === yearFilter);
  const deptPaged = filtered.slice(deptPage * ADMIN_PAGE_SIZE, (deptPage + 1) * ADMIN_PAGE_SIZE);

  const upsert = useMutation({
    mutationFn: async (row: EditState) => {
      const payload = { year: Number(row.year), department: row.department, placed: Number(row.placed), total: Number(row.total), percentage: Number(row.percentage), predicted_percentage: row.predicted_percentage ? Number(row.predicted_percentage) : null, trend: row.trend || null };
      if (row.id) { const { error } = await supabase.from("department_placements").update(payload).eq("id", row.id); if (error) throw error; }
      else { const { error } = await supabase.from("department_placements").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["department_placements_admin"] }); queryClient.invalidateQueries({ queryKey: ["department_placements"] }); toast({ title: "Saved!" }); setOpen(false); setEditRow(null); },
    onError: (e: DbError) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("department_placements").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["department_placements_admin"] }); queryClient.invalidateQueries({ queryKey: ["department_placements"] }); toast({ title: "Deleted" }); setDeleteId(null); },
  });

  const bulkImport = useMutation({
    mutationFn: async (csvRows: CsvRow[]) => {
      const payload = csvRows.map(r => ({ year: Number(r.year), department: r.department, placed: Number(r.placed), total: Number(r.total), percentage: Number(r.percentage), predicted_percentage: r.predicted_percentage ? Number(r.predicted_percentage) : null, trend: r.trend || null }));
      const { error } = await supabase.from("department_placements").insert(payload); if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["department_placements_admin"] }); toast({ title: "Imported!" }); },
    onError: (e: DbError) => toast({ title: "Import Error", description: e.message, variant: "destructive" }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
        <div><CardTitle className="text-lg">Department Placements</CardTitle><CardDescription>{filtered.length} of {rows.length} records</CardDescription></div>
        <div className="flex items-center gap-2 flex-wrap">
          <YearFilter years={years} value={yearFilter} onChange={(v) => { setYearFilter(v); setDeptPage(0); }} />
          <Button size="sm" variant="outline" className="gap-1" onClick={() => exportToCsv("department_placements.csv", filtered.map(r => ({ year: r.year, department: r.department, placed: r.placed, total: r.total, percentage: r.percentage, predicted_pct: r.predicted_percentage ?? "", trend: r.trend ?? "" })))}><Download className="w-3.5 h-3.5" /> Export</Button>
          <CsvImport onImport={(rows) => bulkImport.mutate(rows)} fields={["year", "department", "placed", "total", "percentage", "predicted_percentage", "trend"]} tableName="Department Placements" />
          <Button size="sm" onClick={() => { setEditRow({ year: "", department: "", placed: 0, total: 0, percentage: 0, predicted_percentage: "", trend: "" }); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Year</TableHead><TableHead>Department</TableHead><TableHead>Placed</TableHead><TableHead>Total</TableHead><TableHead>%</TableHead><TableHead>Predicted %</TableHead><TableHead>Trend</TableHead><TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deptPaged.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell><Badge variant="outline">{r.year}</Badge></TableCell>
                  <TableCell className="font-medium">{r.department}</TableCell>
                  <TableCell>{r.placed}</TableCell>
                  <TableCell>{r.total}</TableCell>
                  <TableCell>{r.percentage}%</TableCell>
                  <TableCell>{r.predicted_percentage != null ? `${r.predicted_percentage}%` : "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.trend || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditRow({ ...r }); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No records found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <Pagination page={deptPage} total={filtered.length} pageSize={ADMIN_PAGE_SIZE} onChange={setDeptPage} />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editRow?.id ? "Edit" : "Add"} Department Placement</DialogTitle></DialogHeader>
            {editRow && (
              <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(editRow); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Year</Label><Input type="number" placeholder="e.g. 2024" value={editRow.year} onChange={(e) => setEditRow({ ...editRow, year: e.target.value })} required /></div>
                  <div><Label>Department</Label><Input placeholder="e.g. CSE" value={editRow.department} onChange={(e) => setEditRow({ ...editRow, department: e.target.value })} required /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Placed</Label><Input type="number" value={editRow.placed} onChange={(e) => setEditRow({ ...editRow, placed: e.target.value })} required /></div>
                  <div><Label>Total</Label><Input type="number" value={editRow.total} onChange={(e) => setEditRow({ ...editRow, total: e.target.value })} required /></div>
                  <div><Label>%</Label><Input type="number" min="0" max="100" value={editRow.percentage} onChange={(e) => setEditRow({ ...editRow, percentage: e.target.value })} required /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Predicted % (optional)</Label><Input type="number" min="0" max="100" value={editRow.predicted_percentage ?? ""} onChange={(e) => setEditRow({ ...editRow, predicted_percentage: e.target.value })} /></div>
                  <div>
                    <Label>Trend (optional)</Label>
                    <Select value={editRow.trend || ""} onValueChange={(v) => setEditRow({ ...editRow, trend: v || null })}>
                      <SelectTrigger><SelectValue placeholder="Select trend" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rising">Rising</SelectItem>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="declining">Declining</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && remove.mutate(deleteId)} isPending={remove.isPending} />
      </CardContent>
    </Card>
  );
};

// ── Predictions Tab ──
const PredictionsTab = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editRow, setEditRow] = useState<EditState | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["prediction_data"],
    queryFn: async () => { const { data, error } = await supabase.from("prediction_data").select("*").order("year"); if (error) throw error; return data; },
  });

  const upsert = useMutation({
    mutationFn: async (row: EditState) => {
      const payload = { year: row.year, predicted: Number(row.predicted), confidence: Number(row.confidence) };
      if (row.id) { const { error } = await supabase.from("prediction_data").update(payload).eq("id", row.id); if (error) throw error; }
      else { const { error } = await supabase.from("prediction_data").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["prediction_data"] }); toast({ title: "Saved!" }); setOpen(false); },
    onError: (e: DbError) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("prediction_data").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["prediction_data"] }); toast({ title: "Deleted" }); setDeleteId(null); },
  });

  const bulkImport = useMutation({
    mutationFn: async (csvRows: CsvRow[]) => {
      const payload = csvRows.map(r => ({ year: r.year, predicted: Number(r.predicted), confidence: Number(r.confidence) }));
      const { error } = await supabase.from("prediction_data").insert(payload); if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["prediction_data"] }); toast({ title: "Imported!" }); },
    onError: (e: DbError) => toast({ title: "Import Error", description: e.message, variant: "destructive" }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
        <div><CardTitle className="text-lg">Predictions</CardTitle><CardDescription>{rows.length} records</CardDescription></div>
        <div className="flex items-center gap-2">
          <CsvImport onImport={(rows) => bulkImport.mutate(rows)} fields={["year", "predicted", "confidence"]} tableName="Predictions" />
          <Button size="sm" onClick={() => { setEditRow({ year: "", predicted: 0, confidence: 0 }); setOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader><TableRow className="bg-muted/50"><TableHead>Year</TableHead><TableHead>Predicted %</TableHead><TableHead>Confidence %</TableHead><TableHead className="w-24 text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell><Badge variant="outline">{r.year}</Badge></TableCell>
                  <TableCell>{r.predicted}%</TableCell>
                  <TableCell>{Math.round(r.confidence * 100)}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditRow({ ...r }); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No records found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editRow?.id ? "Edit" : "Add"} Prediction</DialogTitle></DialogHeader>
            {editRow && (
              <form onSubmit={(e) => { e.preventDefault(); upsert.mutate(editRow); }} className="space-y-4">
                <div><Label>Year</Label><Input type="number" placeholder="e.g. 2027" value={editRow.year} onChange={(e) => setEditRow({ ...editRow, year: e.target.value })} required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Predicted %</Label><Input type="number" min="0" max="100" value={editRow.predicted} onChange={(e) => setEditRow({ ...editRow, predicted: e.target.value })} required /></div>
                  <div><Label>Confidence % (0–100)</Label><Input type="number" min="0" max="100" value={editRow._confidencePct ?? Math.round((editRow.confidence ?? 0) * 100)} onChange={(e) => setEditRow({ ...editRow, _confidencePct: e.target.value, confidence: Number(e.target.value) / 100 })} required /></div>
                </div>
                <Button type="submit" className="w-full" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && remove.mutate(deleteId)} isPending={remove.isPending} />
      </CardContent>
    </Card>
  );
};

// ── User Roles Management Tab ──
const UserRolesTab = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [emailMap, setEmailMap] = useState<Record<string, string>>({});

  const { data: roles = [] } = useQuery({
    queryKey: ["user_roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      // Resolve emails for all user IDs via edge function
      if (data && data.length > 0) {
        const userIds = data.map(r => r.user_id);
        const { data: emailData } = await supabase.functions.invoke("get-user-by-email", {
          body: { user_ids: userIds },
        });
        // Response is [{ user_id, email }]
        if (Array.isArray(emailData)) {
          const map: Record<string, string> = {};
          for (const entry of emailData) {
            if (entry.user_id && entry.email) map[entry.user_id] = entry.email;
          }
          setEmailMap(map);
        }
      }
      return data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_roles"] });
      toast({ title: "Admin role removed" });
      setDeleteId(null);
    },
    onError: (e: DbError) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleGrant = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      // Look up user by email via edge function
      const { data: userData, error: fnError } = await supabase.functions.invoke("get-user-by-email", {
        body: { email: email.trim() },
      });
      if (fnError) throw new Error(fnError.message || "Failed to look up user");
      if (userData?.error) throw new Error(userData.error);

      const userId = userData.user_id;

      // Check if already admin
      const existing = roles.find(r => r.user_id === userId && r.role === "admin");
      if (existing) {
        toast({ title: "Already an admin", description: `${email} already has admin role.` });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" as const });
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["user_roles"] });
      toast({ title: "Admin role granted", description: `${email} is now an admin.` });
      setEmail("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "An unexpected error occurred";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5" /> User Roles</CardTitle>
        <CardDescription>Grant or revoke admin access by email address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="Enter user email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGrant()}
            className="max-w-sm"
          />
          <Button onClick={handleGrant} disabled={loading || !email.trim()}>
            <Shield className="w-4 h-4 mr-1" /> {loading ? "Granting..." : "Grant Admin"}
          </Button>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Email</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-sm">{emailMap[r.user_id] || "Loading..."}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.user_id}</TableCell>
                  <TableCell><Badge>{r.role}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(r.id)}>
                      <ShieldOff className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {roles.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No admin users found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && remove.mutate(deleteId)} isPending={remove.isPending} />
      </CardContent>
    </Card>
  );
};

// ── Main Admin Panel ──
const AdminPanel = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) return <DashboardLayout title="Admin" subtitle="Loading..."><div /></DashboardLayout>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <DashboardLayout title="Admin Panel" subtitle="Manage placement data across all years">
      <Tabs defaultValue="companies" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="placement">Placement</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
          <TabsTrigger value="recruiters">Recruiters</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="users">User Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="companies"><CompanyPlacementsTab /></TabsContent>
        <TabsContent value="placement"><YearPlacementTab /></TabsContent>
        <TabsContent value="departments"><DepartmentPlacementsTab /></TabsContent>
        <TabsContent value="salary"><SalaryTab /></TabsContent>
        <TabsContent value="recruiters"><RecruitersTab /></TabsContent>
        <TabsContent value="predictions"><PredictionsTab /></TabsContent>
        <TabsContent value="users"><UserRolesTab /></TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminPanel;
