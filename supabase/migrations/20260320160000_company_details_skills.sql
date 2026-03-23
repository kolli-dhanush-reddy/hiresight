-- ============================================================
-- company_details: rich per-company metadata
-- ============================================================
CREATE TABLE public.company_details (
  id TEXT PRIMARY KEY,                        -- slug e.g. 'tcs'
  name TEXT NOT NULL UNIQUE,
  sector TEXT NOT NULL DEFAULT 'IT',
  avg_package NUMERIC NOT NULL DEFAULT 0,
  highest_package NUMERIC NOT NULL DEFAULT 0,
  selection_ratio NUMERIC NOT NULL DEFAULT 0, -- percentage 0-100
  min_cgpa NUMERIC NOT NULL DEFAULT 0,
  visit_probability NUMERIC NOT NULL DEFAULT 0, -- percentage 0-100
  expected_hires_next INTEGER NOT NULL DEFAULT 0,
  expected_pkg_min NUMERIC NOT NULL DEFAULT 0,
  expected_pkg_max NUMERIC NOT NULL DEFAULT 0,
  hiring_departments TEXT[] NOT NULL DEFAULT '{}',
  job_roles TEXT[] NOT NULL DEFAULT '{}',
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_cd_avg_pkg_gte0        CHECK (avg_package >= 0),
  CONSTRAINT chk_cd_high_pkg_gte0       CHECK (highest_package >= 0),
  CONSTRAINT chk_cd_sel_ratio_range     CHECK (selection_ratio >= 0 AND selection_ratio <= 100),
  CONSTRAINT chk_cd_cgpa_range          CHECK (min_cgpa >= 0 AND min_cgpa <= 10),
  CONSTRAINT chk_cd_visit_prob_range    CHECK (visit_probability >= 0 AND visit_probability <= 100),
  CONSTRAINT chk_cd_exp_hires_gte0      CHECK (expected_hires_next >= 0)
);

ALTER TABLE public.company_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company_details"
  ON public.company_details FOR SELECT USING (true);
CREATE POLICY "Admins can insert company_details"
  ON public.company_details FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update company_details"
  ON public.company_details FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete company_details"
  ON public.company_details FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_company_details_updated_at
  BEFORE UPDATE ON public.company_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_cd_sector ON public.company_details (sector);

-- ============================================================
-- Add predicted_percentage + trend to department_placements
-- ============================================================
ALTER TABLE public.department_placements
  ADD COLUMN IF NOT EXISTS predicted_percentage NUMERIC,
  ADD COLUMN IF NOT EXISTS trend TEXT DEFAULT 'stable'
    CHECK (trend IN ('rising', 'stable', 'declining'));

-- ============================================================
-- skill_demand: skills required by companies
-- ============================================================
CREATE TABLE public.skill_demand (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill TEXT NOT NULL UNIQUE,
  demand_count INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'programming'
    CHECK (category IN ('programming','framework','soft','tool','domain')),
  trend TEXT NOT NULL DEFAULT 'stable'
    CHECK (trend IN ('rising','stable','declining')),
  companies TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_sd_demand_gte0 CHECK (demand_count >= 0)
);

ALTER TABLE public.skill_demand ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read skill_demand"
  ON public.skill_demand FOR SELECT USING (true);
CREATE POLICY "Admins can insert skill_demand"
  ON public.skill_demand FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update skill_demand"
  ON public.skill_demand FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete skill_demand"
  ON public.skill_demand FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_skill_demand_updated_at
  BEFORE UPDATE ON public.skill_demand
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_sd_category ON public.skill_demand (category);
CREATE INDEX IF NOT EXISTS idx_sd_trend    ON public.skill_demand (trend);
