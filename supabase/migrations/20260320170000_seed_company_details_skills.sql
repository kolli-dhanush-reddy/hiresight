-- Seed data for company details and skill demand (Real MLRIT Companies)
-- Based on actual placement data from 2019-2025

-- ============================================================================
-- COMPANY DETAILS (Real MLRIT Recruiters with Predictions)
-- ============================================================================

INSERT INTO company_details (
  id, name, sector, avg_package, highest_package, selection_ratio, min_cgpa,
  visit_probability, expected_hires_next, expected_pkg_min, expected_pkg_max,
  hiring_departments, job_roles, required_skills
) VALUES

-- Top Tier Companies (High Package)
('servicenow', 'ServiceNow', 'IT', 33.0, 33.0, 15, 8.5, 75, 2, 30.0, 35.0,
 ARRAY['CSE', 'IT'], 
 ARRAY['Software QA Engineer', 'Associate Engineer'],
 ARRAY['Java', 'Python', 'Testing', 'Automation', 'Cloud']),

('palo-alto', 'Palo Alto Networks', 'IT', 58.0, 58.0, 10, 8.8, 70, 3, 55.0, 60.0,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Software Engineer', 'Security Engineer'],
 ARRAY['Python', 'C++', 'Cybersecurity', 'Networking', 'Cloud']),

('amazon', 'Amazon', 'IT', 18.5, 25.0, 12, 8.0, 85, 5, 20.0, 28.0,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['SDE', 'Quality Specialist', 'DevOps Engineer'],
 ARRAY['Java', 'Python', 'DSA', 'System Design', 'AWS']),

('walmart', 'Walmart Global Tech', 'IT', 24.0, 24.0, 8, 8.5, 65, 4, 22.0, 26.0,
 ARRAY['CSE', 'IT'], 
 ARRAY['Software Engineer', 'Data Engineer'],
 ARRAY['Java', 'Python', 'React', 'SQL', 'Cloud']),

('zscaler', 'Zscaler', 'IT', 28.5, 28.5, 12, 8.2, 70, 3, 26.0, 30.0,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Product Support Engineer', 'Software Engineer'],
 ARRAY['Python', 'Networking', 'Security', 'Cloud', 'Linux']),

-- High Package Companies
('cisco', 'Cisco Systems', 'IT', 22.6, 22.6, 10, 8.0, 68, 2, 20.0, 25.0,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Software Engineer', 'Network Engineer'],
 ARRAY['C', 'Python', 'Networking', 'Security', 'Cloud']),

('experian', 'Experian Services', 'IT', 15.5, 15.5, 15, 7.8, 72, 5, 14.0, 17.0,
 ARRAY['CSE', 'IT'], 
 ARRAY['Automation Test Engineer', 'QA Engineer'],
 ARRAY['Java', 'Selenium', 'Testing', 'Automation', 'Python']),

('epam', 'Epam Systems', 'IT', 10.5, 12.0, 18, 7.5, 88, 20, 10.0, 13.0,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Junior Software Engineer', 'Software Engineer'],
 ARRAY['Java', 'JavaScript', 'React', 'Node.js', 'SQL']),

('amadeus', 'Amadeus Labs', 'IT', 11.5, 13.0, 20, 7.5, 90, 8, 11.0, 14.0,
 ARRAY['CSE', 'IT'], 
 ARRAY['Software Engineer - Development'],
 ARRAY['Java', 'C++', 'Python', 'DSA', 'System Design']),

-- Mass Recruiters (High Volume)
('tcs', 'Tata Consultancy Services', 'IT', 4.5, 9.0, 45, 6.5, 98, 150, 3.6, 9.0,
 ARRAY['CSE', 'IT', 'ECE', 'EEE'], 
 ARRAY['Ninja', 'Digital', 'Prime', 'Systems Engineer'],
 ARRAY['Java', 'Python', 'SQL', 'Web Development', 'Cloud']),

('accenture', 'Accenture', 'Consulting', 5.2, 6.5, 42, 6.8, 95, 120, 4.5, 7.0,
 ARRAY['CSE', 'IT', 'ECE', 'EEE'], 
 ARRAY['Associate Software Engineer', 'Advanced ASE'],
 ARRAY['Java', 'Python', 'SQL', 'Cloud', 'Agile']),

('cognizant', 'Cognizant', 'IT', 4.0, 4.0, 38, 6.5, 92, 100, 4.0, 4.5,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['GenC', 'Programmer Analyst Trainee'],
 ARRAY['Java', 'Python', 'SQL', 'Web Development']),

('wipro', 'Wipro', 'IT', 4.8, 6.5, 40, 6.5, 90, 80, 3.75, 6.5,
 ARRAY['CSE', 'IT', 'ECE', 'EEE'], 
 ARRAY['Project Engineer', 'Senior Project Engineer'],
 ARRAY['Java', 'Python', 'SQL', 'Testing', 'Cloud']),

('capgemini', 'Capgemini', 'Consulting', 5.5, 7.5, 35, 7.0, 93, 90, 4.0, 7.5,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Analyst', 'Senior Analyst', 'Software Engineer'],
 ARRAY['Java', 'Python', 'SQL', 'Cloud', 'DevOps']),

('infosys', 'Infosys', 'IT', 5.0, 9.5, 35, 7.0, 88, 50, 3.6, 9.5,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Systems Engineer', 'Specialist Programmer', 'Digital Specialist'],
 ARRAY['Java', 'Python', 'SQL', 'Web Development', 'Cloud']),

('virtusa', 'Virtusa', 'IT', 5.5, 7.0, 38, 6.8, 85, 60, 5.0, 7.0,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Developer', 'Power Developer', 'Software Engineer'],
 ARRAY['Java', 'Python', 'React', 'SQL', 'Cloud']),

('tech-mahindra', 'Tech Mahindra', 'IT', 4.2, 5.5, 40, 6.5, 87, 70, 3.25, 5.5,
 ARRAY['CSE', 'IT', 'ECE', 'EEE'], 
 ARRAY['Associate Process Engineer', 'Trainee Software Engineer'],
 ARRAY['Java', 'Python', 'SQL', 'Testing']),

('hcl', 'HCL Technologies', 'IT', 4.0, 4.25, 42, 6.5, 85, 50, 4.0, 4.5,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Graduate Engineer Trainee', 'Software Engineer'],
 ARRAY['Java', 'Python', 'SQL', 'Web Development']),

('dxc', 'DXC Technology', 'IT', 4.2, 4.2, 45, 6.5, 82, 40, 3.6, 4.5,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Associate Professional', 'Software Engineer'],
 ARRAY['Java', 'Python', 'SQL', 'Cloud']),

-- Core Engineering Companies
('tasl', 'Tata Advanced Systems Limited', 'Core', 5.0, 5.0, 50, 6.5, 95, 100, 5.0, 5.5,
 ARRAY['MECH', 'EEE', 'ECE', 'CIVIL'], 
 ARRAY['Graduate Engineer Trainee', 'Engineer Trainee'],
 ARRAY['CAD', 'Manufacturing', 'Quality Control', 'Project Management']),

('safran', 'Safran Group', 'Core', 4.0, 4.0, 35, 7.0, 88, 90, 4.0, 4.5,
 ARRAY['MECH', 'EEE', 'ECE'], 
 ARRAY['Graduate Engineer Trainee', 'Trainee Engineer'],
 ARRAY['CAD', 'Manufacturing', 'Aerospace', 'Quality']),

-- Consulting & Finance
('deloitte', 'Deloitte', 'Consulting', 4.2, 4.25, 25, 7.5, 85, 15, 4.0, 4.5,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Associate Software Engineer', 'Assistant Software Engineer'],
 ARRAY['Java', 'Python', 'SQL', 'Cloud', 'Analytics']),

('flipkart', 'Flipkart', 'IT', 8.2, 8.2, 10, 8.0, 75, 3, 8.0, 9.0,
 ARRAY['CSE', 'IT'], 
 ARRAY['Software Engineer', 'SDE'],
 ARRAY['Java', 'Python', 'DSA', 'System Design', 'Microservices']),

('globallogic', 'GlobalLogic', 'IT', 2.4, 2.6, 48, 6.0, 90, 50, 2.3, 2.8,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Associate Analyst', 'Junior Engineer'],
 ARRAY['Java', 'Python', 'SQL', 'Testing']),

-- Mid-tier Companies
('ust', 'UST', 'IT', 4.25, 4.25, 32, 7.0, 85, 30, 4.0, 4.5,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Software Engineer', 'Associate Engineer'],
 ARRAY['Java', 'Python', 'React', 'SQL', 'Cloud']),

('lti', 'L&T Infotech', 'IT', 5.5, 10.0, 28, 7.2, 80, 25, 5.0, 10.0,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Level 1', 'Level 2', 'Infinity Level'],
 ARRAY['Java', 'Python', 'SQL', 'Cloud', 'DevOps']),

('cybage', 'Cybage Software', 'IT', 4.5, 4.5, 30, 7.0, 78, 20, 4.0, 5.0,
 ARRAY['CSE', 'IT'], 
 ARRAY['Development Engineer', 'Trainee Software Engineer'],
 ARRAY['Java', 'Python', 'React', 'SQL']),

('hexaware', 'Hexaware Technologies', 'IT', 3.5, 6.0, 35, 6.8, 75, 25, 3.0, 6.0,
 ARRAY['CSE', 'IT', 'ECE'], 
 ARRAY['Software Engineer Trainee', 'Premier GET'],
 ARRAY['Java', 'Python', 'SQL', 'Testing']);

-- ============================================================================
-- SKILL DEMAND DATA (Based on real job roles from MLRIT placements)
-- ============================================================================

INSERT INTO skill_demand (skill, demand_count, category, trend, companies) VALUES

-- Programming Languages
('Java', 28, 'programming', 'stable', 
 ARRAY['TCS', 'Accenture', 'Cognizant', 'Wipro', 'Capgemini', 'Infosys', 'Virtusa', 'Tech Mahindra', 'HCL', 'DXC', 'UST', 'LTI', 'Cybage', 'Hexaware', 'Epam', 'Amadeus', 'Amazon', 'Flipkart', 'Deloitte', 'ServiceNow', 'Experian', 'Cisco', 'Walmart', 'Zscaler', 'Palo Alto', 'GlobalLogic', 'Safran', 'TASL']),

('Python', 26, 'programming', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'TCS', 'Accenture', 'Cognizant', 'Wipro', 'Capgemini', 'Infosys', 'Tech Mahindra', 'UST', 'LTI', 'Cybage', 'Epam', 'Amadeus', 'Deloitte', 'ServiceNow', 'Experian', 'Cisco', 'Walmart', 'Zscaler', 'Palo Alto', 'GlobalLogic', 'DXC', 'HCL', 'Virtusa', 'Hexaware']),

('C++', 8, 'programming', 'stable', 
 ARRAY['Amazon', 'Amadeus', 'Palo Alto', 'Cisco', 'Epam', 'Virtusa', 'HCL', 'Tech Mahindra']),

('JavaScript', 15, 'programming', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'Epam', 'Accenture', 'Capgemini', 'TCS', 'Infosys', 'Virtusa', 'UST', 'LTI', 'Cybage', 'Wipro', 'Cognizant', 'Tech Mahindra', 'HCL']),

('SQL', 25, 'programming', 'stable', 
 ARRAY['TCS', 'Accenture', 'Cognizant', 'Wipro', 'Capgemini', 'Infosys', 'Virtusa', 'Tech Mahindra', 'HCL', 'DXC', 'UST', 'LTI', 'Cybage', 'Hexaware', 'Epam', 'Amazon', 'Flipkart', 'Deloitte', 'Walmart', 'GlobalLogic', 'Experian', 'ServiceNow', 'Zscaler', 'Cisco', 'Palo Alto']),

-- Frameworks & Libraries
('React', 12, 'framework', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'Epam', 'Accenture', 'Capgemini', 'Virtusa', 'UST', 'LTI', 'Cybage', 'Wipro', 'Walmart', 'TCS']),

('Node.js', 10, 'framework', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'Epam', 'Accenture', 'Capgemini', 'Virtusa', 'UST', 'LTI', 'Cybage', 'Wipro']),

('Spring Boot', 8, 'framework', 'stable', 
 ARRAY['Amazon', 'Flipkart', 'Accenture', 'Capgemini', 'TCS', 'Infosys', 'LTI', 'UST']),

('Angular', 7, 'framework', 'stable', 
 ARRAY['Accenture', 'Capgemini', 'TCS', 'Infosys', 'Virtusa', 'UST', 'LTI']),

-- Cloud & DevOps
('AWS', 18, 'tool', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'TCS', 'Accenture', 'Capgemini', 'Infosys', 'Wipro', 'Cognizant', 'Tech Mahindra', 'HCL', 'DXC', 'UST', 'LTI', 'Deloitte', 'ServiceNow', 'Walmart', 'Zscaler', 'Palo Alto']),

('Azure', 12, 'tool', 'rising', 
 ARRAY['TCS', 'Accenture', 'Capgemini', 'Infosys', 'Wipro', 'Cognizant', 'Tech Mahindra', 'HCL', 'DXC', 'UST', 'LTI', 'Deloitte']),

('Docker', 10, 'tool', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'Accenture', 'Capgemini', 'TCS', 'Infosys', 'UST', 'LTI', 'Deloitte', 'Walmart']),

('Kubernetes', 8, 'tool', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'Accenture', 'Capgemini', 'TCS', 'Infosys', 'UST', 'LTI']),

('Git', 22, 'tool', 'stable', 
 ARRAY['Amazon', 'Flipkart', 'TCS', 'Accenture', 'Cognizant', 'Wipro', 'Capgemini', 'Infosys', 'Virtusa', 'Tech Mahindra', 'HCL', 'DXC', 'UST', 'LTI', 'Cybage', 'Hexaware', 'Epam', 'Amadeus', 'Deloitte', 'Walmart', 'ServiceNow', 'GlobalLogic']),

-- Testing & QA
('Selenium', 10, 'tool', 'stable', 
 ARRAY['TCS', 'Accenture', 'Cognizant', 'Wipro', 'Capgemini', 'Infosys', 'Tech Mahindra', 'HCL', 'Experian', 'ServiceNow']),

('Testing', 15, 'domain', 'stable', 
 ARRAY['TCS', 'Accenture', 'Cognizant', 'Wipro', 'Capgemini', 'Infosys', 'Tech Mahindra', 'HCL', 'DXC', 'Hexaware', 'Experian', 'ServiceNow', 'GlobalLogic', 'Virtusa', 'UST']),

('Automation', 12, 'domain', 'rising', 
 ARRAY['TCS', 'Accenture', 'Capgemini', 'Infosys', 'Wipro', 'Cognizant', 'Tech Mahindra', 'HCL', 'Experian', 'ServiceNow', 'Virtusa', 'UST']),

-- Core Technical Skills
('DSA', 15, 'domain', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'Walmart', 'Palo Alto', 'Cisco', 'Zscaler', 'Amadeus', 'Epam', 'TCS', 'Accenture', 'Capgemini', 'Infosys', 'LTI', 'UST', 'Virtusa']),

('System Design', 10, 'domain', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'Walmart', 'Palo Alto', 'Cisco', 'Amadeus', 'Accenture', 'Capgemini', 'TCS', 'Infosys']),

('Microservices', 8, 'domain', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'Accenture', 'Capgemini', 'TCS', 'Infosys', 'UST', 'LTI']),

-- Specialized Skills
('Cybersecurity', 6, 'domain', 'rising', 
 ARRAY['Palo Alto', 'Cisco', 'Zscaler', 'Accenture', 'Capgemini', 'Deloitte']),

('Networking', 8, 'domain', 'stable', 
 ARRAY['Cisco', 'Palo Alto', 'Zscaler', 'TCS', 'Accenture', 'Tech Mahindra', 'HCL', 'Wipro']),

('Machine Learning', 5, 'domain', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'TCS', 'Accenture', 'Capgemini']),

('Data Analytics', 7, 'domain', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'Accenture', 'Deloitte', 'TCS', 'Capgemini', 'Infosys']),

-- Soft Skills
('Communication', 30, 'soft', 'stable', 
 ARRAY['TCS', 'Accenture', 'Cognizant', 'Wipro', 'Capgemini', 'Infosys', 'Virtusa', 'Tech Mahindra', 'HCL', 'DXC', 'UST', 'LTI', 'Cybage', 'Hexaware', 'Epam', 'Amadeus', 'Amazon', 'Flipkart', 'Deloitte', 'ServiceNow', 'Experian', 'Cisco', 'Walmart', 'Zscaler', 'Palo Alto', 'GlobalLogic', 'Safran', 'TASL', 'Cognizant', 'Wipro']),

('Problem Solving', 28, 'soft', 'stable', 
 ARRAY['Amazon', 'Flipkart', 'TCS', 'Accenture', 'Cognizant', 'Wipro', 'Capgemini', 'Infosys', 'Virtusa', 'Tech Mahindra', 'HCL', 'DXC', 'UST', 'LTI', 'Cybage', 'Hexaware', 'Epam', 'Amadeus', 'Deloitte', 'ServiceNow', 'Experian', 'Cisco', 'Walmart', 'Zscaler', 'Palo Alto', 'GlobalLogic', 'Safran', 'TASL']),

('Teamwork', 25, 'soft', 'stable', 
 ARRAY['TCS', 'Accenture', 'Cognizant', 'Wipro', 'Capgemini', 'Infosys', 'Virtusa', 'Tech Mahindra', 'HCL', 'DXC', 'UST', 'LTI', 'Cybage', 'Hexaware', 'Epam', 'Amadeus', 'Amazon', 'Flipkart', 'Deloitte', 'ServiceNow', 'Walmart', 'GlobalLogic', 'Safran', 'TASL', 'Cisco']),

('Agile', 12, 'soft', 'rising', 
 ARRAY['Amazon', 'Flipkart', 'Accenture', 'Capgemini', 'TCS', 'Infosys', 'Wipro', 'UST', 'LTI', 'Deloitte', 'Virtusa', 'Tech Mahindra']);

COMMIT;
