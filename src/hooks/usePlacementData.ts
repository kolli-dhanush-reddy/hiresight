import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  yearWisePlacement as staticYWP,
  salaryData as staticSalary,
  topRecruiters as staticRecruiters,
  predictionData as staticPrediction,
  departmentWise as staticDept,
  hiringHeatmap as staticHeatmap,
  companyHiringTrend as staticSectorTrend,
  companyDetails as staticCompanyDetails,
  skillDemandData as staticSkillDemand,
} from "@/data/placementData";

// ── Year-wise placement ──────────────────────────────────────
export function useYearWisePlacement() {
  return useQuery({
    queryKey: ["year_wise_placement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("year_wise_placement")
        .select("*")
        .order("year");
      if (error) throw error;
      return data;
    },
    placeholderData: staticYWP.map((d) => ({
      id: d.year,
      year: Number(d.year),
      placed: d.placed,
      unplaced: d.unplaced,
      percentage: d.percentage,
      companies_visited: d.companiesVisited,
      highest_salary: d.highestSalary,
      created_at: "",
      updated_at: "",
    })),
  });
}

// ── Salary data ──────────────────────────────────────────────
export function useSalaryData() {
  return useQuery({
    queryKey: ["salary_data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salary_data")
        .select("*")
        .order("year");
      if (error) throw error;
      return data;
    },
    placeholderData: staticSalary.map((d) => ({
      id: d.year,
      year: Number(d.year),
      min_salary: d.min,
      avg_salary: d.avg,
      max_salary: d.max,
      created_at: "",
      updated_at: "",
    })),
  });
}

// ── Top recruiters ───────────────────────────────────────────
export function useTopRecruiters() {
  return useQuery({
    queryKey: ["top_recruiters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("top_recruiters")
        .select("*")
        .order("hires", { ascending: false });
      if (error) throw error;
      return data;
    },
    placeholderData: staticRecruiters.map((d) => ({
      id: d.company,
      company: d.company,
      hires: d.hires,
      avg_package: d.avgPackage,
      created_at: "",
      updated_at: "",
    })),
  });
}

// ── Prediction data ──────────────────────────────────────────
export function usePredictionData() {
  return useQuery({
    queryKey: ["prediction_data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prediction_data")
        .select("*")
        .order("year");
      if (error) throw error;
      return data;
    },
    // static confidence is 0-100; DB stores 0-1
    placeholderData: staticPrediction.map((d) => ({
      id: d.year,
      year: Number(d.year),
      predicted: d.predicted,
      confidence: d.confidence / 100,
      created_at: "",
      updated_at: "",
    })),
  });
}

// ── Company placements ───────────────────────────────────────
export function useCompanyPlacements(year?: number) {
  return useQuery({
    queryKey: ["company_placements", year],
    queryFn: async () => {
      let q = supabase
        .from("company_placements")
        .select("*")
        .is("department", null)   // exclude heatmap department-split rows
        .order("year")
        .order("company");
      if (year) q = q.eq("year", year);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    placeholderData: staticCompanyDetails.flatMap((c) =>
      c.yearWiseHires
        .filter((h) => !year || Number(h.year) === year)
        .map((h) => ({
          id: `${c.id}-${h.year}`,
          company: c.name,
          year: Number(h.year),
          hires: h.hires,
          salary_pa: c.avgPackage,
          job_role: c.jobRoles[0] ?? null,
          sector: c.sector,
          department: null as string | null,
          created_at: "",
          updated_at: "",
        }))
    ),
  });
}

// ── Department placements ────────────────────────────────────
export function useDepartmentPlacements(year?: number) {
  return useQuery({
    queryKey: ["department_placements", year],
    queryFn: async () => {
      let q = supabase
        .from("department_placements")
        .select("*")
        .order("percentage", { ascending: false });
      if (year) q = q.eq("year", year);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    placeholderData: staticDept.map((d) => ({
      id: d.department,
      year: 2024,
      department: d.department,
      placed: d.placed,
      total: d.total,
      percentage: d.percentage,
      predicted_percentage: null as number | null,
      trend: null as string | null,
      created_at: "",
      updated_at: "",
    })),
  });
}

// ── Heatmap: company × department hires ─────────────────────
export function useHiringHeatmap(year = 2024) {
  return useQuery({
    queryKey: ["hiring_heatmap", year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_placements")
        .select("company, department, hires")
        .eq("year", year)
        .not("department", "is", null);
      if (error) throw error;

      const map = new Map<string, Record<string, number>>();
      for (const row of data) {
        if (!row.department) continue;
        if (!map.has(row.company)) map.set(row.company, {});
        const entry = map.get(row.company)!;
        entry[row.department] = (entry[row.department] ?? 0) + row.hires;
      }
      return Array.from(map.entries()).map(([company, depts]) => ({ company, ...depts }));
    },
    placeholderData: staticHeatmap,
  });
}

// ── Sector hiring trend ──────────────────────────────────────
export function useSectorTrend() {
  return useQuery({
    queryKey: ["sector_trend"],
    queryFn: async () => {
      // Aggregate hires per (year, company) first to avoid double-counting
      // department-split rows, then join sector from company_details
      // Only use rows without a department to avoid double-counting heatmap rows
      const { data, error } = await supabase
        .from("company_placements")
        .select("year, company, sector, hires")
        .is("department", null);
      if (error) throw error;

      // Sum hires per (year, company) — pick the sector from any row for that company
      const companyYearMap = new Map<string, { year: number; sector: string; hires: number }>();
      for (const row of data) {
        const key = `${row.year}::${row.company}`;
        if (!companyYearMap.has(key)) {
          companyYearMap.set(key, { year: row.year, sector: row.sector, hires: 0 });
        }
        companyYearMap.get(key)!.hires += row.hires;
      }

      const map = new Map<number, Record<string, number>>();
      for (const { year, sector, hires } of companyYearMap.values()) {
        if (!map.has(year)) map.set(year, {});
        const entry = map.get(year)!;
        const key = sector.toLowerCase();
        entry[key] = (entry[key] ?? 0) + hires;
      }
      return Array.from(map.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([year, sectors]) => ({ year: String(year), ...sectors }));
    },
    placeholderData: staticSectorTrend,
  });
}

// ── Company details ──────────────────────────────────────────
export function useCompanyDetails() {
  return useQuery({
    queryKey: ["company_details"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_details")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
    placeholderData: staticCompanyDetails.map((c) => ({
      id: c.id,
      name: c.name,
      sector: c.sector,
      avg_package: c.avgPackage,
      highest_package: c.highestPackage,
      selection_ratio: c.selectionRatio,
      min_cgpa: c.minCGPA,
      visit_probability: c.visitProbability,
      expected_hires_next: c.expectedHires2025,
      expected_pkg_min: c.expectedPackageRange[0],
      expected_pkg_max: c.expectedPackageRange[1],
      hiring_departments: c.hiringDepartments,
      job_roles: c.jobRoles,
      required_skills: c.requiredSkills,
      created_at: "",
      updated_at: "",
    })),
  });
}

// ── Skill demand ─────────────────────────────────────────────
export function useSkillDemand() {
  return useQuery({
    queryKey: ["skill_demand"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skill_demand")
        .select("*")
        .order("demand_count", { ascending: false });
      if (error) throw error;
      return data;
    },
    placeholderData: staticSkillDemand.map((s) => ({
      id: s.skill,
      skill: s.skill,
      demand_count: s.demandCount,
      category: s.category,
      trend: s.trend,
      companies: s.companies,
      created_at: "",
      updated_at: "",
    })),
  });
}
