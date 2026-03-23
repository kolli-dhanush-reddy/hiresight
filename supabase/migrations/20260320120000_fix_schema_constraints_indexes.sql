-- ============================================================
-- Migration: Fix column types, add constraints, add indexes
-- ============================================================

-- 1. Add created_at to user_roles if missing
ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- ============================================================
-- 2. Fix year columns: TEXT → INTEGER
-- ============================================================

-- year_wise_placement
ALTER TABLE public.year_wise_placement
  ALTER COLUMN year TYPE INTEGER USING year::INTEGER;

-- salary_data
ALTER TABLE public.salary_data
  ALTER COLUMN year TYPE INTEGER USING year::INTEGER;

-- prediction_data
ALTER TABLE public.prediction_data
  ALTER COLUMN year TYPE INTEGER USING year::INTEGER;

-- company_placements
ALTER TABLE public.company_placements
  ALTER COLUMN year TYPE INTEGER USING year::INTEGER;

-- ============================================================
-- 3. Fix prediction_data.confidence: INTEGER → NUMERIC
-- ============================================================
ALTER TABLE public.prediction_data
  ALTER COLUMN confidence TYPE NUMERIC USING confidence::NUMERIC;

-- ============================================================
-- 4. Add CHECK constraints for data integrity
-- ============================================================

-- year_wise_placement
ALTER TABLE public.year_wise_placement
  ADD CONSTRAINT chk_ywp_placed_gte0       CHECK (placed >= 0),
  ADD CONSTRAINT chk_ywp_unplaced_gte0     CHECK (unplaced >= 0),
  ADD CONSTRAINT chk_ywp_percentage_range  CHECK (percentage >= 0 AND percentage <= 100),
  ADD CONSTRAINT chk_ywp_highest_sal_gte0  CHECK (highest_salary >= 0),
  ADD CONSTRAINT chk_ywp_companies_gte0    CHECK (companies_visited >= 0);

-- salary_data
ALTER TABLE public.salary_data
  ADD CONSTRAINT chk_sal_min_gte0  CHECK (min_salary >= 0),
  ADD CONSTRAINT chk_sal_avg_gte0  CHECK (avg_salary >= 0),
  ADD CONSTRAINT chk_sal_max_gte0  CHECK (max_salary >= 0);

-- top_recruiters
ALTER TABLE public.top_recruiters
  ADD CONSTRAINT chk_tr_hires_gte0   CHECK (hires >= 0),
  ADD CONSTRAINT chk_tr_pkg_gte0     CHECK (avg_package >= 0);

-- prediction_data
ALTER TABLE public.prediction_data
  ADD CONSTRAINT chk_pred_predicted_gte0    CHECK (predicted >= 0),
  ADD CONSTRAINT chk_pred_confidence_range  CHECK (confidence >= 0 AND confidence <= 1);

-- company_placements
ALTER TABLE public.company_placements
  ADD CONSTRAINT chk_cp_hires_gte0   CHECK (hires >= 0),
  ADD CONSTRAINT chk_cp_salary_gte0  CHECK (salary_pa >= 0);

-- ============================================================
-- 5. Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_ywp_year          ON public.year_wise_placement (year);
CREATE INDEX IF NOT EXISTS idx_cp_company        ON public.company_placements (company);
CREATE INDEX IF NOT EXISTS idx_cp_year           ON public.company_placements (year);
CREATE INDEX IF NOT EXISTS idx_sal_year          ON public.salary_data (year);
CREATE INDEX IF NOT EXISTS idx_pred_year         ON public.prediction_data (year);
CREATE INDEX IF NOT EXISTS idx_user_roles_userid ON public.user_roles (user_id);
