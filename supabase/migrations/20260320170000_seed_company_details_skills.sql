-- ============================================================
-- Seed: company_details
-- ============================================================
INSERT INTO public.company_details
  (id, name, sector, avg_package, highest_package, selection_ratio, min_cgpa,
   visit_probability, expected_hires_next, expected_pkg_min, expected_pkg_max,
   hiring_departments, job_roles, required_skills)
VALUES
  ('tcs','TCS','IT',4.5,7.0,42,6.0,98,90,3.6,7.5,
   ARRAY['CSE','IT','ECE','EE'],ARRAY['Software Developer','System Engineer','Data Analyst'],
   ARRAY['Java','SQL','Problem Solving','Communication']),

  ('infosys','Infosys','IT',4.2,8.5,38,6.5,95,65,3.6,9.0,
   ARRAY['CSE','IT','ECE'],ARRAY['Systems Engineer','Digital Specialist','Operations Executive'],
   ARRAY['Python','Java','Cloud Computing','Agile']),

  ('wipro','Wipro','IT',4.0,6.5,35,6.0,96,50,3.5,7.0,
   ARRAY['CSE','IT','ECE','EE','ME'],ARRAY['Project Engineer','Software Developer','Testing Engineer'],
   ARRAY['Java','SQL','Testing','Communication']),

  ('cognizant','Cognizant','IT',4.8,7.5,28,6.0,90,38,4.0,8.0,
   ARRAY['CSE','IT','ECE'],ARRAY['Programmer Analyst','Software Engineer','QA Engineer'],
   ARRAY['Java','Python','SQL','Testing','Agile']),

  ('accenture','Accenture','Consulting',5.0,9.0,30,6.5,92,45,4.5,10.0,
   ARRAY['CSE','IT','ECE','ME'],ARRAY['Associate Software Engineer','Analyst','Technology Architect'],
   ARRAY['Java','Cloud','Agile','Communication','Problem Solving']),

  ('deloitte','Deloitte','Consulting',7.5,12.0,20,7.0,85,30,7.0,13.0,
   ARRAY['CSE','IT','ME','CE'],ARRAY['Analyst','Consultant','Technology Consultant'],
   ARRAY['Analytical Thinking','Excel','SQL','Communication','Business Acumen']),

  ('google','Google','IT',32.0,45.0,5,8.0,70,8,28.0,48.0,
   ARRAY['CSE'],ARRAY['Software Engineer','SDE Intern','Cloud Engineer'],
   ARRAY['DSA','System Design','C++','Python','Machine Learning']),

  ('microsoft','Microsoft','IT',24.5,38.0,8,7.5,75,13,22.0,40.0,
   ARRAY['CSE','IT'],ARRAY['Software Engineer','Program Manager','Data Scientist'],
   ARRAY['DSA','C#','.NET','Azure','System Design']),

  ('amazon','Amazon','IT',22.0,35.0,10,7.0,80,16,20.0,38.0,
   ARRAY['CSE','IT','ECE'],ARRAY['SDE-1','Quality Assurance','Operations Manager'],
   ARRAY['DSA','Java','AWS','System Design','Leadership Principles']),

  ('goldmansachs','Goldman Sachs','Finance',28.0,40.0,4,8.0,60,5,25.0,42.0,
   ARRAY['CSE','IT'],ARRAY['Software Engineer','Quantitative Analyst','Risk Analyst'],
   ARRAY['DSA','Java','Python','Financial Modeling','Statistics']),

  ('larsentoubro','L&T','Core',5.5,8.0,15,6.5,82,11,5.0,8.5,
   ARRAY['ME','CE','EE'],ARRAY['Graduate Engineer Trainee','Design Engineer','Site Engineer'],
   ARRAY['AutoCAD','MATLAB','Project Management','Domain Knowledge']),

  ('razorpay','Razorpay','Startup',18.0,25.0,8,7.5,72,12,16.0,28.0,
   ARRAY['CSE','IT'],ARRAY['Backend Engineer','Frontend Engineer','DevOps Engineer'],
   ARRAY['Go','React','AWS','Microservices','System Design'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed: department_placements — add predicted + trend for 2024
-- ============================================================
UPDATE public.department_placements SET predicted_percentage = 98, trend = 'rising'   WHERE year = 2024 AND department = 'CSE';
UPDATE public.department_placements SET predicted_percentage = 96, trend = 'rising'   WHERE year = 2024 AND department = 'IT';
UPDATE public.department_placements SET predicted_percentage = 84, trend = 'rising'   WHERE year = 2024 AND department = 'ECE';
UPDATE public.department_placements SET predicted_percentage = 71, trend = 'rising'   WHERE year = 2024 AND department = 'CE';
UPDATE public.department_placements SET predicted_percentage = 66, trend = 'stable'   WHERE year = 2024 AND department = 'EE';
UPDATE public.department_placements SET predicted_percentage = 63, trend = 'declining' WHERE year = 2024 AND department = 'ME';

-- ============================================================
-- Seed: skill_demand
-- ============================================================
INSERT INTO public.skill_demand (skill, demand_count, category, trend, companies) VALUES
  ('Java',             9, 'programming', 'stable',   ARRAY['TCS','Infosys','Wipro','Cognizant','Accenture','Amazon','Goldman Sachs','Deloitte','Microsoft']),
  ('Python',           7, 'programming', 'rising',   ARRAY['Google','Infosys','Amazon','Cognizant','Goldman Sachs','Razorpay','Microsoft']),
  ('DSA',              5, 'domain',      'rising',   ARRAY['Google','Microsoft','Amazon','Goldman Sachs','Razorpay']),
  ('SQL',              6, 'tool',        'stable',   ARRAY['TCS','Wipro','Deloitte','Cognizant','Infosys','Goldman Sachs']),
  ('System Design',    4, 'domain',      'rising',   ARRAY['Google','Microsoft','Amazon','Razorpay']),
  ('Communication',    5, 'soft',        'stable',   ARRAY['TCS','Wipro','Deloitte','Accenture','Infosys']),
  ('Cloud Computing',  4, 'framework',   'rising',   ARRAY['Infosys','Google','Amazon','Accenture']),
  ('Problem Solving',  3, 'soft',        'stable',   ARRAY['TCS','Accenture','Deloitte']),
  ('React',            3, 'framework',   'rising',   ARRAY['Razorpay','Microsoft','Amazon']),
  ('Machine Learning', 2, 'domain',      'rising',   ARRAY['Google','Microsoft']),
  ('C++',              2, 'programming', 'stable',   ARRAY['Google','Goldman Sachs']),
  ('Go',               1, 'programming', 'rising',   ARRAY['Razorpay']),
  ('Agile',            3, 'framework',   'stable',   ARRAY['Infosys','Cognizant','Accenture']),
  ('AWS',              3, 'tool',        'rising',   ARRAY['Amazon','Razorpay','Accenture']),
  ('Microservices',    2, 'framework',   'rising',   ARRAY['Razorpay','Amazon']),
  ('AutoCAD',          1, 'tool',        'declining',ARRAY['L&T']),
  ('MATLAB',           1, 'tool',        'declining',ARRAY['L&T'])
ON CONFLICT (skill) DO NOTHING;
