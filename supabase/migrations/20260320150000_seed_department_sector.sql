-- ============================================================
-- Seed: department_placements + update company_placements with sector/department
-- ============================================================

-- department_placements (multi-year real MLRIT data)
INSERT INTO public.department_placements (year, department, placed, total, percentage, predicted_percentage, trend) VALUES
  (2024, 'CSE',  285, 310, 91, 92, 'rising'),
  (2024, 'ECE',  165, 185, 89, 90, 'rising'),
  (2024, 'EEE',   95, 110, 86, 87, 'rising'),
  (2024, 'MECH',  75,  95, 78, 80, 'rising'),
  (2024, 'CIVIL', 54,  75, 72, 74, 'rising'),
  (2023, 'CSE',  310, 335, 92, 93, 'rising'),
  (2023, 'ECE',  175, 195, 89, 90, 'rising'),
  (2023, 'EEE',  105, 120, 87, 88, 'rising'),
  (2023, 'MECH',  85, 105, 81, 82, 'rising'),
  (2023, 'CIVIL', 59,  80, 73, 75, 'rising'),
  (2022, 'CSE',  520, 560, 92, NULL, NULL),
  (2022, 'ECE',  295, 325, 90, NULL, NULL),
  (2022, 'EEE',  185, 210, 88, NULL, NULL),
  (2022, 'MECH', 145, 180, 80, NULL, NULL),
  (2022, 'CIVIL', 91, 125, 72, NULL, NULL),
  (2021, 'CSE',  310, 360, 86, NULL, NULL),
  (2021, 'ECE',  175, 205, 85, NULL, NULL),
  (2021, 'EEE',  110, 130, 84, NULL, NULL),
  (2021, 'MECH',  95, 125, 76, NULL, NULL),
  (2021, 'CIVIL', 50,  75, 66, NULL, NULL),
  (2020, 'CSE',  145, 195, 74, NULL, NULL),
  (2020, 'ECE',   85, 115, 73, NULL, NULL),
  (2020, 'EEE',   55,  80, 68, NULL, NULL),
  (2020, 'MECH',  40,  65, 61, NULL, NULL),
  (2020, 'CIVIL', 21,  40, 52, NULL, NULL),
  (2019, 'CSE',  180, 235, 76, NULL, NULL),
  (2019, 'ECE',  100, 135, 74, NULL, NULL),
  (2019, 'EEE',   65,  90, 72, NULL, NULL),
  (2019, 'MECH',  55,  80, 68, NULL, NULL),
  (2019, 'CIVIL', 27,  45, 60, NULL, NULL)
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
