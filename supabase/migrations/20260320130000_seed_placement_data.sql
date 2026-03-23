-- Seed data for placement analytics dashboard (Real MLRIT Data)
-- Based on actual placement statistics from 2019-2025

-- ============================================================================
-- YEAR-WISE PLACEMENT DATA (Real MLRIT Statistics)
-- ============================================================================

INSERT INTO year_wise_placement (year, placed, unplaced, percentage, companies_visited, highest_salary) VALUES
(2025, 536, 64, 89.3, 62, 33.0),   -- 536 placed, highest: ServiceNow 33L
(2024, 674, 76, 89.9, 56, 28.5),   -- 674 placed, highest: Zscaler 28.5L
(2023, 734, 66, 91.8, 32, 58.0),   -- 734 placed, highest: Palo Alto 58L
(2022, 1236, 114, 91.6, 42, 25.0), -- 1236 placed, highest: Amazon 25L
(2021, 740, 110, 87.1, 49, 16.0),  -- 740 placed, highest: Amazon 16L
(2020, 346, 104, 76.9, 37, 10.0),  -- 346 placed, highest: Byjus 10L
(2019, 427, 123, 77.6, 65, 10.0);  -- 427 placed, highest: Byjus 10L

-- ============================================================================
-- SALARY DATA (Real MLRIT Statistics)
-- ============================================================================

INSERT INTO salary_data (year, min_salary, avg_salary, max_salary) VALUES
(2025, 2.33, 6.8, 33.0),   -- Min: AstraMWP 2.33L, Max: ServiceNow 33L
(2024, 1.80, 6.2, 28.5),   -- Min: Inovaantage 1.8L, Max: Zscaler 28.5L
(2023, 2.80, 7.5, 58.0),   -- Min: Texmo 2.8L, Max: Palo Alto 58L
(2022, 2.50, 6.9, 25.0),   -- Min: JMDR 2.5L, Max: Amazon 25L
(2021, 1.80, 5.4, 16.0),   -- Min: SVK Global 1.8L, Max: Amazon 16L
(2020, 2.00, 4.2, 10.0),   -- Min: Hexaware 2L, Max: Byjus 10L
(2019, 1.65, 3.8, 10.0);   -- Min: Wonjin 1.65L, Max: Byjus 10L

-- ============================================================================
-- TOP RECRUITERS (Based on highest hiring numbers from real data)
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
('Amadeus Labs', 19, 11.5);

-- ============================================================================
-- PREDICTION DATA (Based on trends from real data)
-- ============================================================================

INSERT INTO prediction_data (year, predicted, confidence) VALUES
(2026, 92.5, 0.85),  -- Continuing upward trend
(2027, 93.2, 0.78),  -- Slight increase
(2028, 93.8, 0.72);  -- Gradual improvement

-- ============================================================================
-- COMPANY PLACEMENTS (Real companies from MLRIT data 2019-2025)
-- ============================================================================

-- 2025 Data (Top companies)
INSERT INTO company_placements (company, year, hires, salary_pa, job_role, sector) VALUES
('ServiceNow', 2025, 1, 3300000, 'Associate Software QA Engineer', 'IT'),
('BigWorks', 2025, 3, 2600000, 'Software Engineer', 'IT'),
('Catalog', 2025, 1, 2500000, 'Software Associate', 'IT'),
('Inovalon', 2025, 3, 2500000, 'Software Engineer', 'IT'),
('Juspay', 2025, 1, 2100000, 'Product Engineer - I', 'IT'),
('Amadeus Labs', 2025, 3, 1262218, 'Software Engineer - Development', 'IT'),
('Realpage', 2025, 6, 1000000, 'Software Engineer', 'IT'),
('Tata Advanced Systems Limited', 2025, 84, 500000, 'Graduate Engineer Trainee', 'Core'),
('Cognizant', 2025, 154, 400000, 'GenC', 'IT'),
('Infosys', 2025, 42, 450000, 'Systems Engineer', 'IT'),
('TCS', 2025, 3, 336000, 'Ninja', 'IT'),
('GlobalLogic', 2025, 38, 255000, 'Associate Analyst', 'IT'),
('Deloitte', 2025, 4, 425000, 'Assistant Software Engineer', 'Consulting'),
('Tech Mahindra', 2025, 17, 550000, 'Associate Process Engineer', 'IT'),
('Virtusa', 2025, 7, 500000, 'Software Engineer', 'IT'),

-- 2024 Data (Top companies)
('Zscaler', 2024, 2, 2850000, 'Associate - Product Support Engineer', 'IT'),
('Amadeus Labs', 2024, 3, 1300000, 'Software Engineer - Development', 'IT'),
('TCS', 2024, 11, 750000, 'Digital & Prime', 'IT'),
('Flipkart', 2024, 2, 821641, 'Software Engineer', 'IT'),
('Capgemini', 2024, 91, 500000, 'Software Engineer', 'IT'),
('Tata Advanced Systems Limited', 2024, 85, 500000, 'Graduate Engineer Trainee', 'Core'),
('Accenture', 2024, 95, 453355, 'Associate Software Engineer', 'IT'),
('UST', 2024, 25, 425000, 'Software Engineer', 'IT'),
('Safran', 2024, 84, 400000, 'Trainee Engineer', 'Core'),
('Deloitte', 2024, 81, 400000, 'Associate Software Engineer', 'Consulting'),
('Tech Mahindra', 2024, 65, 325000, 'Associate Process Executive', 'IT'),
('GlobalLogic', 2024, 54, 222815, 'Associate Analyst', 'IT'),

-- 2023 Data (Top companies)
('Palo Alto Networks', 2023, 3, 5800000, 'Software Engineer', 'IT'),
('Cisco Systems', 2023, 1, 2259000, 'Software Engineer', 'IT'),
('Experian Services', 2023, 4, 1550000, 'Automation Test Engineer', 'IT'),
('Epam Systems', 2023, 19, 1200000, 'Junior Software Engineer', 'IT'),
('Amadeus Labs', 2023, 9, 1177164, 'Software Engineer – Development', 'IT'),
('TCS', 2023, 28, 500000, 'Digital & Ninja', 'IT'),
('Virtusa', 2023, 180, 575000, 'Developer', 'IT'),
('DXC Technology', 2023, 179, 420000, 'Associate Professional', 'IT'),
('Accenture', 2023, 66, 450000, 'Associate Software Engineer', 'IT'),

-- 2022 Data (Top companies)
('Amazon', 2022, 3, 2500000, 'Software Development Engineer', 'IT'),
('Walmart Global Tech', 2022, 3, 2400000, 'Software Engineer', 'IT'),
('Amadeus Labs', 2022, 7, 1032934, 'Software Engineer – Development', 'IT'),
('Infosys', 2022, 34, 550000, 'Specialist Programmer', 'IT'),
('Capgemini', 2022, 159, 525000, 'Senior Analyst', 'IT'),
('TCS', 2022, 128, 500000, 'Digital & Ninja', 'IT'),
('Accenture', 2022, 213, 525000, 'Associate Software Engineer', 'IT'),
('Virtusa', 2022, 112, 575000, 'Developer', 'IT'),
('Wipro', 2022, 251, 500000, 'Project Engineer', 'IT'),
('Epam Systems', 2022, 20, 600000, 'Junior Software Engineer', 'IT'),

-- 2021 Data (Top companies)
('Amazon', 2021, 4, 1300000, 'Programmer Analyst', 'IT'),
('L&T Infotech', 2021, 26, 650000, 'Infinity Level', 'IT'),
('TCS', 2021, 56, 450000, 'Digital & Ninja', 'IT'),
('Accenture', 2021, 221, 525000, 'Associate Software Engineer', 'IT'),
('Virtusa', 2021, 51, 450000, 'Associate Engineer', 'IT'),
('Cognizant', 2021, 86, 401988, 'Programmer Analyst Trainee', 'IT'),
('Capgemini', 2021, 55, 380000, 'Analyst', 'IT'),

-- 2020 Data (Top companies)
('Byjus', 2020, 1, 1000000, 'Business Development', 'Startup'),
('TCS', 2020, 39, 450000, 'Digital & Ninja', 'IT'),
('Virtusa', 2020, 46, 400000, 'Associate Engineer', 'IT'),
('Capgemini', 2020, 31, 380000, 'Analyst', 'IT'),
('LTI', 2020, 41, 425000, 'Engineer', 'IT'),
('Cognizant', 2020, 20, 400000, 'Programmer Analyst', 'IT'),

-- 2019 Data (Top companies)
('Byjus', 2019, 2, 1000000, 'Business Development', 'Startup'),
('Mu Sigma', 2019, 1, 725000, 'Data Analyst', 'IT'),
('HSBC', 2019, 2, 700000, 'Software Engineer', 'Finance'),
('Capgemini', 2019, 52, 380000, 'Analyst', 'IT'),
('Wipro', 2019, 33, 350000, 'Project Engineer', 'IT'),
('TCS', 2019, 25, 330000, 'Ninja', 'IT'),
('Virtusa', 2019, 28, 400000, 'Associate Engineer', 'IT');

-- ============================================================================
-- DEPARTMENT PLACEMENTS (Realistic distribution based on MLRIT data)
-- ============================================================================

-- 2024 Department-wise data
INSERT INTO department_placements (year, department, placed, total, percentage, predicted_percentage, trend) VALUES
(2024, 'CSE', 285, 310, 91.9, 92.5, 'rising'),
(2024, 'ECE', 165, 185, 89.2, 90.0, 'rising'),
(2024, 'EEE', 95, 110, 86.4, 87.5, 'rising'),
(2024, 'MECH', 75, 95, 78.9, 80.0, 'rising'),
(2024, 'CIVIL', 54, 75, 72.0, 74.0, 'rising'),
(2024, 'IT', 0, 0, 0, 0, 'stable');

-- 2023 Department-wise data
INSERT INTO department_placements (year, department, placed, total, percentage, predicted_percentage, trend) VALUES
(2023, 'CSE', 310, 335, 92.5, 93.0, 'rising'),
(2023, 'ECE', 175, 195, 89.7, 90.5, 'rising'),
(2023, 'EEE', 105, 120, 87.5, 88.5, 'rising'),
(2023, 'MECH', 85, 105, 81.0, 82.5, 'rising'),
(2023, 'CIVIL', 59, 80, 73.8, 75.5, 'rising'),
(2023, 'IT', 0, 0, 0, 0, 'stable');

-- 2022 Department-wise data
INSERT INTO department_placements (year, department, placed, total, percentage, predicted_percentage, trend) VALUES
(2022, 'CSE', 520, 560, 92.9, NULL, NULL),
(2022, 'ECE', 295, 325, 90.8, NULL, NULL),
(2022, 'EEE', 185, 210, 88.1, NULL, NULL),
(2022, 'MECH', 145, 180, 80.6, NULL, NULL),
(2022, 'CIVIL', 91, 125, 72.8, NULL, NULL),
(2022, 'IT', 0, 0, 0, NULL, NULL);

COMMIT;
