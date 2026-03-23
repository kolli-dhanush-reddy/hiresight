-- ============================================================
-- Seed: department_placements + update company_placements with sector/department
-- ============================================================

-- department_placements (2024 snapshot — the chart shows latest year)
INSERT INTO public.department_placements (year, department, placed, total, percentage) VALUES
  (2024, 'CSE', 145, 150, 97),
  (2024, 'ECE',  98, 120, 82),
  (2024, 'ME',   65, 100, 65),
  (2024, 'EE',   52,  80, 65),
  (2024, 'CE',   48,  70, 69),
  (2024, 'IT',   47,  50, 94)
ON CONFLICT (year, department) DO NOTHING;

-- Update sector on existing company_placements rows
UPDATE public.company_placements SET sector = 'IT'          WHERE company IN ('TCS','Infosys','Wipro','Cognizant','HCL Technologies','Tech Mahindra','DXC Technology','Epam Systems','GlobalLogic','PeopleTech');
UPDATE public.company_placements SET sector = 'IT'          WHERE company IN ('Google','Microsoft','Amazon');
UPDATE public.company_placements SET sector = 'Startup'     WHERE company IN ('Razorpay');
UPDATE public.company_placements SET sector = 'Consulting'  WHERE company IN ('Accenture','Capgemini','Virtusa','Deloitte');
UPDATE public.company_placements SET sector = 'Finance'     WHERE company IN ('Goldman Sachs','Amadeus Labs','Walmart Global Tech','Palo Alto Networks');
UPDATE public.company_placements SET sector = 'Core'        WHERE company IN ('L&T','Bosch Global Software');

-- Update department on company_placements rows (heatmap source)
-- TCS
UPDATE public.company_placements SET department = 'CSE' WHERE company = 'TCS' AND year = 2024 AND job_role = 'Software Developer';
-- We insert per-department rows for heatmap companies in 2024
INSERT INTO public.company_placements (year, company, job_role, hires, salary_pa, sector, department) VALUES
  (2024, 'TCS',          'System Engineer',    20, 450000, 'IT',         'IT'),
  (2024, 'TCS',          'System Engineer',    20, 450000, 'IT',         'ECE'),
  (2024, 'TCS',          'System Engineer',    15, 450000, 'IT',         'EE'),
  (2024, 'Infosys',      'Systems Engineer',   20, 420000, 'IT',         'IT'),
  (2024, 'Infosys',      'Systems Engineer',   17, 420000, 'IT',         'ECE'),
  (2024, 'Wipro',        'Project Engineer',   12, 400000, 'IT',         'IT'),
  (2024, 'Wipro',        'Project Engineer',   10, 400000, 'IT',         'ECE'),
  (2024, 'Wipro',        'Project Engineer',    6, 400000, 'IT',         'EE'),
  (2024, 'Wipro',        'Project Engineer',    5, 400000, 'IT',         'ME'),
  (2024, 'Microsoft',    'Software Engineer',   4, 2450000,'IT',         'IT'),
  (2024, 'Amazon',       'SDE-1',               4, 2200000,'IT',         'IT'),
  (2024, 'Amazon',       'SDE-1',               3, 2200000,'IT',         'ECE'),
  (2024, 'Deloitte',     'Analyst',             8, 750000, 'Consulting', 'IT'),
  (2024, 'Deloitte',     'Analyst',             5, 750000, 'Consulting', 'ME'),
  (2024, 'Deloitte',     'Analyst',             5, 750000, 'Consulting', 'CE'),
  (2024, 'Accenture',    'Associate SE',       10, 500000, 'Consulting', 'IT'),
  (2024, 'Accenture',    'Associate SE',        8, 500000, 'Consulting', 'ECE'),
  (2024, 'Accenture',    'Associate SE',        9, 500000, 'Consulting', 'ME'),
  (2024, 'Goldman Sachs','Software Engineer',   2, 2800000,'Finance',    'IT'),
  (2024, 'L&T',          'GET',                 3, 550000, 'Core',       'EE'),
  (2024, 'L&T',          'GET',                 4, 550000, 'Core',       'ME'),
  (2024, 'L&T',          'GET',                 3, 550000, 'Core',       'CE'),
  (2024, 'Razorpay',     'Backend Engineer',    3, 1800000,'Startup',    'IT')
ON CONFLICT (year, company, job_role) DO NOTHING;
