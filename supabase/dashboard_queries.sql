-- ============================================================
-- Example Dashboard Queries
-- ============================================================

-- 1. All placement stats for a specific year
SELECT * FROM year_wise_placement WHERE year = 2024;

-- 2. Year-over-year placement trend
SELECT year, placed, unplaced, percentage
FROM year_wise_placement
ORDER BY year ASC;

-- 3. Average salary across all years
SELECT AVG(avg_salary) AS overall_avg_salary FROM salary_data;

-- 4. Salary range per year
SELECT year, min_salary, avg_salary, max_salary
FROM salary_data
ORDER BY year ASC;

-- 5. Top recruiters by hires
SELECT company, hires, avg_package
FROM top_recruiters
ORDER BY hires DESC
LIMIT 10;

-- 6. Company-wise placements for a given year
SELECT company, job_role, hires, salary_pa
FROM company_placements
WHERE year = 2024
ORDER BY hires DESC;

-- 7. All roles a specific company has hired for (across years)
SELECT year, job_role, hires, salary_pa
FROM company_placements
WHERE company = 'Google'
ORDER BY year DESC;

-- 8. Total hires per company across all years
SELECT company, SUM(hires) AS total_hires, AVG(salary_pa) AS avg_salary
FROM company_placements
GROUP BY company
ORDER BY total_hires DESC;

-- 9. Prediction data for future years
SELECT year, predicted, confidence
FROM prediction_data
ORDER BY year ASC;

-- 10. Bulk insert example (CSV upload compatible)
INSERT INTO company_placements (year, company, job_role, salary_pa, hires)
VALUES
  (2024, 'Google',    'SWE',            2200000, 5),
  (2024, 'Microsoft', 'Data Engineer',  1800000, 3),
  (2024, 'Amazon',    'SDE-1',          1600000, 8)
ON CONFLICT (year, company, job_role) DO UPDATE
  SET hires     = EXCLUDED.hires,
      salary_pa = EXCLUDED.salary_pa;

-- 11. Aggregate: total placed students across all years
SELECT SUM(placed) AS total_placed, SUM(unplaced) AS total_unplaced
FROM year_wise_placement;

-- 12. Filter predictions with high confidence (>= 0.8)
SELECT year, predicted, confidence
FROM prediction_data
WHERE confidence >= 0.8
ORDER BY year ASC;
