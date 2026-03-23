-- ============================================================
-- Add department_placements table and sector column
-- ============================================================

-- 1. Department-wise placement stats
CREATE TABLE public.department_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  department TEXT NOT NULL,
  placed INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  percentage NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (year, department),
  CONSTRAINT chk_dp_placed_gte0      CHECK (placed >= 0),
  CONSTRAINT chk_dp_total_gte0       CHECK (total >= 0),
  CONSTRAINT chk_dp_pct_range        CHECK (percentage >= 0 AND percentage <= 100)
);

ALTER TABLE public.department_placements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read department_placements"
  ON public.department_placements FOR SELECT USING (true);

CREATE POLICY "Admins can insert department_placements"
  ON public.department_placements FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update department_placements"
  ON public.department_placements FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete department_placements"
  ON public.department_placements FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_department_placements_updated_at
  BEFORE UPDATE ON public.department_placements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_dp_year       ON public.department_placements (year);
CREATE INDEX IF NOT EXISTS idx_dp_department ON public.department_placements (department);

-- 2. Add sector column to company_placements
ALTER TABLE public.company_placements
  ADD COLUMN IF NOT EXISTS sector TEXT NOT NULL DEFAULT 'IT';

-- 3. Add department column to company_placements (for heatmap)
ALTER TABLE public.company_placements
  ADD COLUMN IF NOT EXISTS department TEXT;

CREATE INDEX IF NOT EXISTS idx_cp_sector     ON public.company_placements (sector);
CREATE INDEX IF NOT EXISTS idx_cp_department ON public.company_placements (department);
