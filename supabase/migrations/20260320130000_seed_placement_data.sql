-- Seed data for placement analytics dashboard (Real MLRIT Data)
-- Based on actual placement statistics from 2019-2025

-- ============================================================================
-- YEAR-WISE PLACEMENT DATA (Real MLRIT Statistics)
-- ============================================================================

INSERT INTO year_wise_placement (year, placed, unplaced, percentage, companies_visited, highest_salary) VALUES
(2025, 536, 64, 89, 62, 33.0),
(2024, 674, 76, 89, 56, 28.5),
(2023, 734, 66, 91, 32, 58.0),
(2022, 1236, 114, 91, 42, 25.0),
(2021, 740, 110, 87, 49, 16.0),
(2020, 346, 104, 76, 37, 10.0),
(2019, 427, 123, 77, 65, 10.0)
ON CONFLICT (year) DO UPDATE SET
  placed = EXCLUDED.placed,
  unplaced = EXCLUDED.unplaced,
  percentage = EXCLUDED.percentage,
  companies_visited = EXCLUDED.companies_visited,
  highest_salary = EXCLUDED.highest_salary;

-- ============================================================================
-- SALARY DATA (Real MLRIT Statistics)
-- ============================================================================

INSERT INTO salary_data (year, min_salary, avg_salary, max_salary) VALUES
(2025, 2.33, 6.8, 33.0),
(2024, 1.80, 6.2, 28.5),
(2023, 2.80, 7.5, 58.0),
(2022, 2.50, 6.9, 25.0),
(2021, 1.80, 5.4, 16.0),
(2020, 2.00, 4.2, 10.0),
(2019, 1.65, 3.8, 10.0)
ON CONFLICT (year) DO UPDATE SET
  min_salary = EXCLUDED.min_salary,
  avg_salary = EXCLUDED.avg_salary,
  max_salary = EXCLUDED.max_salary;

-- ============================================================================
-- TOP RECRUITERS
-- ============================================================================

INSERT INTO top_recruiters (company, hires, avg_package) VALUES
('Tata Consultancy Services', 285, 4.5),
('Accenture', 395, 5.2),
('Wipro', 268, 4.8),
('Cognizant', 154, 4.0),
('Capgemini', 250, 5.5),
('Virtusa', 180, 5.5),
('Infosys', 42, 5.0),
('Tech Mahindra', 82, 4.2),
('DXC Technology', 179, 4.2),
('HCL Technologies', 71, 4.0),
('Tata Advanced Systems Limited', 284, 5.0),
('GlobalLogic', 92, 2.4),
('Deloitte', 85, 4.2),
('Amazon', 18, 15.5),
('Amadeus Labs', 19, 11.5)
ON CONFLICT (company) DO UPDATE SET
  hires = EXCLUDED.hires,
  avg_package = EXCLUDED.avg_package;

-- ============================================================================
-- PREDICTION DATA
-- ============================================================================

INSERT INTO prediction_data (year, predicted, confidence) VALUES
(2026, 92, 0.85),
(2027, 93, 0.78),
(2028, 93, 0.72)
ON CONFLICT (year) DO UPDATE SET
  predicted = EXCLUDED.predicted,
  confidence = EXCLUDED.confidence;

-- ============================================================================
-- COMPANY PLACEMENTS (no sector column - removed)
-- ============================================================================

INSERT INTO company_placements (company, year, hires, salary_pa, job_role) VALUES
-- 2025
('ServiceNow', 2025, 1, 3300000, 'Associate Software QA Engineer'),
('BigWorks', 2025, 3, 2600000, 'Software Engineer'),
('Catalog', 2025, 1, 2500000, 'Software Associate'),
('Inovalon', 2025, 3, 2500000, 'Software Engineer'),
('Juspay', 2025, 1, 2100000, 'Product Engineer - I'),
('Amadeus Labs', 2025, 3, 1262218, 'Software Engineer - Development'),
('Realpage', 2025, 6, 1000000, 'Software Engineer'),
('Tata Advanced Systems Limited', 2025, 84, 500000, 'Graduate Engineer Trainee'),
('Cognizant', 2025, 154, 400000, 'GenC'),
('Infosys', 2025, 42, 450000, 'Systems Engineer'),
('TCS', 2025, 3, 336000, 'Ninja'),
('GlobalLogic', 2025, 38, 255000, 'Associate Analyst'),
('Deloitte', 2025, 4, 425000, 'Assistant Software Engineer'),
('Tech Mahindra', 2025, 17, 550000, 'Associate Process Engineer'),
('Virtusa', 2025, 7, 500000, 'Software Engineer'),
-- 2024
('Zscaler', 2024, 2, 2850000, 'Associate - Product Support Engineer'),
('Amadeus Labs', 2024, 3, 1300000, 'Software Engineer - Development'),
('TCS', 2024, 11, 750000, 'Digital & Prime'),
('Flipkart', 2024, 2, 821641, 'Software Engineer'),
('Capgemini', 2024, 91, 500000, 'Software Engineer'),
('Tata Advanced Systems Limited', 2024, 85, 500000, 'Graduate Engineer Trainee'),
('Accenture', 2024, 95, 453355, 'Associate Software Engineer'),
('UST', 2024, 25, 425000, 'Software Engineer'),
('Safran', 2024, 84, 400000, 'Trainee Engineer'),
('Deloitte', 2024, 81, 400000, 'Associate Software Engineer'),
('Tech Mahindra', 2024, 65, 325000, 'Associate Process Executive'),
('GlobalLogic', 2024, 54, 222815, 'Associate Analyst'),
-- 2023
('Palo Alto Networks', 2023, 3, 5800000, 'Software Engineer'),
('Cisco Systems', 2023, 1, 2259000, 'Software Engineer'),
('Experian Services', 2023, 4, 1550000, 'Automation Test Engineer'),
('Epam Systems', 2023, 19, 1200000, 'Junior Software Engineer'),
('Amadeus Labs', 2023, 9, 1177164, 'Software Engineer - Development'),
('TCS', 2023, 28, 500000, 'Digital & Ninja'),
('Virtusa', 2023, 180, 575000, 'Developer'),
('DXC Technology', 2023, 179, 420000, 'Associate Professional'),
('Accenture', 2023, 66, 450000, 'Associate Software Engineer'),
-- 2022
('Amazon', 2022, 3, 2500000, 'Software Development Engineer'),
('Walmart Global Tech', 2022, 3, 2400000, 'Software Engineer'),
('Amadeus Labs', 2022, 7, 1032934, 'Software Engineer - Development'),
('Infosys', 2022, 34, 550000, 'Specialist Programmer'),
('Capgemini', 2022, 159, 525000, 'Senior Analyst'),
('TCS', 2022, 128, 500000, 'Digital & Ninja'),
('Accenture', 2022, 213, 525000, 'Associate Software Engineer'),
('Virtusa', 2022, 112, 575000, 'Developer'),
('Wipro', 2022, 251, 500000, 'Project Engineer'),
('Epam Systems', 2022, 20, 600000, 'Junior Software Engineer'),
-- 2021
('Amazon', 2021, 4, 1300000, 'Programmer Analyst'),
('L&T Infotech', 2021, 26, 650000, 'Infinity Level'),
('TCS', 2021, 56, 450000, 'Digital & Ninja'),
('Accenture', 2021, 221, 525000, 'Associate Software Engineer'),
('Virtusa', 2021, 51, 450000, 'Associate Engineer'),
('Cognizant', 2021, 86, 401988, 'Programmer Analyst Trainee'),
('Capgemini', 2021, 55, 380000, 'Analyst'),
-- 2020
('Byjus', 2020, 1, 1000000, 'Business Development'),
('TCS', 2020, 39, 450000, 'Digital & Ninja'),
('Virtusa', 2020, 46, 400000, 'Associate Engineer'),
('Capgemini', 2020, 31, 380000, 'Analyst'),
('LTI', 2020, 41, 425000, 'Engineer'),
('Cognizant', 2020, 20, 400000, 'Programmer Analyst'),
-- 2019
('Byjus', 2019, 2, 1000000, 'Business Development'),
('Mu Sigma', 2019, 1, 725000, 'Data Analyst'),
('HSBC', 2019, 2, 700000, 'Software Engineer'),
('Capgemini', 2019, 52, 380000, 'Analyst'),
('Wipro', 2019, 33, 350000, 'Project Engineer'),
('TCS', 2019, 25, 330000, 'Ninja'),
('Virtusa', 2019, 28, 400000, 'Associate Engineer')
ON CONFLICT (year, company, job_role) DO UPDATE SET
  hires = EXCLUDED.hires,
  salary_pa = EXCLUDED.salary_pa;

-- ============================================================================
-- DEPARTMENT PLACEMENTS
-- ============================================================================

INSERT INTO department_placements (year, department, placed, total, percentage, predicted_percentage, trend) VALUES
(2024, 'CSE', 285, 310, 91, 92, 'rising'),
(2024, 'ECE', 165, 185, 89, 90, 'rising'),
(2024, 'EEE', 95, 110, 86, 87, 'rising'),
(2024, 'MECH', 75, 95, 78, 80, 'rising'),
(2024, 'CIVIL', 54, 75, 72, 74, 'rising'),
(2023, 'CSE', 310, 335, 92, 93, 'rising'),
(2023, 'ECE', 175, 195, 89, 90, 'rising'),
(2023, 'EEE', 105, 120, 87, 88, 'rising'),
(2023, 'MECH', 85, 105, 81, 82, 'rising'),
(2023, 'CIVIL', 59, 80, 73, 75, 'rising'),
(2022, 'CSE', 520, 560, 92, NULL, NULL),
(2022, 'ECE', 295, 325, 90, NULL, NULL),
(2022, 'EEE', 185, 210, 88, NULL, NULL),
(2022, 'MECH', 145, 180, 80, NULL, NULL),
(2022, 'CIVIL', 91, 125, 72, NULL, NULL),
(2021, 'CSE', 310, 360, 86, NULL, NULL),
(2021, 'ECE', 175, 205, 85, NULL, NULL),
(2021, 'EEE', 110, 130, 84, NULL, NULL),
(2021, 'MECH', 95, 125, 76, NULL, NULL),
(2021, 'CIVIL', 50, 75, 66, NULL, NULL),
(2020, 'CSE', 145, 195, 74, NULL, NULL),
(2020, 'ECE', 85, 115, 73, NULL, NULL),
(2020, 'EEE', 55, 80, 68, NULL, NULL),
(2020, 'MECH', 40, 65, 61, NULL, NULL),
(2020, 'CIVIL', 21, 40, 52, NULL, NULL),
(2019, 'CSE', 180, 235, 76, NULL, NULL),
(2019, 'ECE', 100, 135, 74, NULL, NULL),
(2019, 'EEE', 65, 90, 72, NULL, NULL),
(2019, 'MECH', 55, 80, 68, NULL, NULL),
(2019, 'CIVIL', 27, 45, 60, NULL, NULL)
ON CONFLICT DO NOTHING;
