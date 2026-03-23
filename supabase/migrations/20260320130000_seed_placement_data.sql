-- ============================================================
-- Seed: Initial placement data (idempotent via ON CONFLICT DO NOTHING)
-- ============================================================

-- year_wise_placement
INSERT INTO public.year_wise_placement (year, placed, unplaced, percentage, companies_visited, highest_salary) VALUES
  (2019, 427, 173, 71, 65, 10),
  (2020, 346, 254, 58, 37, 10),
  (2021, 868, 132, 87, 55, 30),
  (2022, 1048, 152, 87, 22, 21),
  (2023, 734, 166, 82, 32, 58),
  (2024, 634, 166, 79, 64, 25)
ON CONFLICT (year) DO NOTHING;

-- salary_data
INSERT INTO public.salary_data (year, min_salary, avg_salary, max_salary) VALUES
  (2019, 2.5, 4.5, 10.0),
  (2020, 2.2, 4.2, 10.0),
  (2021, 3.0, 6.5, 30.0),
  (2022, 3.5, 7.0, 21.0),
  (2023, 3.8, 8.5, 58.0),
  (2024, 4.0, 8.0, 25.0)
ON CONFLICT (year) DO NOTHING;

-- top_recruiters
INSERT INTO public.top_recruiters (company, hires, avg_package) VALUES
  ('Accenture',             608, 4.8),
  ('Virtusa',               497, 4.5),
  ('Capgemini',             424, 4.1),
  ('Wipro',                 331, 4.2),
  ('TCS',                   286, 3.8),
  ('DXC Technology',        188, 3.9),
  ('Tech Mahindra',         117, 3.3),
  ('Cognizant',             112, 4.0),
  ('Infosys',                82, 4.0),
  ('HCL Technologies',       74, 3.8),
  ('Epam Systems',           53, 7.5),
  ('GlobalLogic',            54, 2.2),
  ('PeopleTech',             38, 3.3),
  ('Bosch Global Software',  28, 5.5),
  ('Amadeus Labs',           19, 10.5),
  ('Amazon',                 17, 14.0),
  ('Palo Alto Networks',      3, 58.0),
  ('Walmart Global Tech',     3, 24.0)
ON CONFLICT (company) DO NOTHING;

-- prediction_data (confidence stored as 0–1 decimal)
INSERT INTO public.prediction_data (year, predicted, confidence) VALUES
  (2025, 81, 0.88),
  (2026, 84, 0.74),
  (2027, 86, 0.58)
ON CONFLICT (year) DO NOTHING;

-- company_placements (year-wise per company)
INSERT INTO public.company_placements (year, company, job_role, hires, salary_pa) VALUES
  -- TCS
  (2019, 'TCS', 'Software Developer',  55, 450000),
  (2020, 'TCS', 'Software Developer',  42, 450000),
  (2021, 'TCS', 'System Engineer',     60, 450000),
  (2022, 'TCS', 'System Engineer',     72, 450000),
  (2023, 'TCS', 'Data Analyst',        78, 450000),
  (2024, 'TCS', 'Software Developer',  85, 450000),
  -- Infosys
  (2019, 'Infosys', 'Systems Engineer',    40, 420000),
  (2020, 'Infosys', 'Systems Engineer',    35, 420000),
  (2021, 'Infosys', 'Digital Specialist',  48, 420000),
  (2022, 'Infosys', 'Digital Specialist',  55, 420000),
  (2023, 'Infosys', 'Systems Engineer',    58, 420000),
  (2024, 'Infosys', 'Systems Engineer',    62, 420000),
  -- Wipro
  (2019, 'Wipro', 'Project Engineer',  30, 400000),
  (2020, 'Wipro', 'Project Engineer',  25, 400000),
  (2021, 'Wipro', 'Software Developer',35, 400000),
  (2022, 'Wipro', 'Software Developer',40, 400000),
  (2023, 'Wipro', 'Testing Engineer',  45, 400000),
  (2024, 'Wipro', 'Project Engineer',  48, 400000),
  -- Accenture
  (2019, 'Accenture', 'Associate Software Engineer', 28, 500000),
  (2020, 'Accenture', 'Associate Software Engineer', 22, 500000),
  (2021, 'Accenture', 'Analyst',                     32, 500000),
  (2022, 'Accenture', 'Analyst',                     36, 500000),
  (2023, 'Accenture', 'Technology Architect',        40, 500000),
  (2024, 'Accenture', 'Associate Software Engineer', 42, 500000),
  -- Cognizant
  (2019, 'Cognizant', 'Programmer Analyst', 22, 480000),
  (2020, 'Cognizant', 'Programmer Analyst', 18, 480000),
  (2021, 'Cognizant', 'Software Engineer',  25, 480000),
  (2022, 'Cognizant', 'Software Engineer',  30, 480000),
  (2023, 'Cognizant', 'QA Engineer',        32, 480000),
  (2024, 'Cognizant', 'Programmer Analyst', 35, 480000),
  -- Google
  (2019, 'Google', 'Software Engineer', 3, 3200000),
  (2020, 'Google', 'Software Engineer', 2, 3200000),
  (2021, 'Google', 'SDE Intern',        5, 3200000),
  (2022, 'Google', 'Cloud Engineer',    6, 3200000),
  (2023, 'Google', 'Software Engineer', 7, 3200000),
  (2024, 'Google', 'Software Engineer', 8, 3200000),
  -- Microsoft
  (2019, 'Microsoft', 'Software Engineer', 5, 2450000),
  (2020, 'Microsoft', 'Software Engineer', 4, 2450000),
  (2021, 'Microsoft', 'Program Manager',   8, 2450000),
  (2022, 'Microsoft', 'Data Scientist',   10, 2450000),
  (2023, 'Microsoft', 'Software Engineer',11, 2450000),
  (2024, 'Microsoft', 'Software Engineer',12, 2450000),
  -- Amazon
  (2019, 'Amazon', 'SDE-1',              6, 2200000),
  (2020, 'Amazon', 'SDE-1',              5, 2200000),
  (2021, 'Amazon', 'SDE-1',             10, 2200000),
  (2022, 'Amazon', 'Quality Assurance', 12, 2200000),
  (2023, 'Amazon', 'SDE-1',             14, 2200000),
  (2024, 'Amazon', 'SDE-1',             15, 2200000),
  -- Deloitte
  (2019, 'Deloitte', 'Analyst',               15, 750000),
  (2020, 'Deloitte', 'Analyst',               12, 750000),
  (2021, 'Deloitte', 'Consultant',            18, 750000),
  (2022, 'Deloitte', 'Technology Consultant', 22, 750000),
  (2023, 'Deloitte', 'Analyst',               25, 750000),
  (2024, 'Deloitte', 'Analyst',               28, 750000),
  -- Goldman Sachs
  (2019, 'Goldman Sachs', 'Software Engineer',    2, 2800000),
  (2020, 'Goldman Sachs', 'Quantitative Analyst', 1, 2800000),
  (2021, 'Goldman Sachs', 'Software Engineer',    3, 2800000),
  (2022, 'Goldman Sachs', 'Risk Analyst',         4, 2800000),
  (2023, 'Goldman Sachs', 'Software Engineer',    4, 2800000),
  (2024, 'Goldman Sachs', 'Software Engineer',    5, 2800000),
  -- L&T
  (2019, 'L&T', 'Graduate Engineer Trainee', 18, 550000),
  (2020, 'L&T', 'Graduate Engineer Trainee', 12, 550000),
  (2021, 'L&T', 'Design Engineer',           15, 550000),
  (2022, 'L&T', 'Site Engineer',             14, 550000),
  (2023, 'L&T', 'Graduate Engineer Trainee', 12, 550000),
  (2024, 'L&T', 'Graduate Engineer Trainee', 10, 550000),
  -- Razorpay
  (2021, 'Razorpay', 'Backend Engineer',   3, 1800000),
  (2022, 'Razorpay', 'Frontend Engineer',  5, 1800000),
  (2023, 'Razorpay', 'DevOps Engineer',    7, 1800000),
  (2024, 'Razorpay', 'Backend Engineer',  10, 1800000)
ON CONFLICT (year, company, job_role) DO NOTHING;
