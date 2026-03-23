# Sample CSV Files for Admin Panel Import

These CSV files can be used to test the CSV import functionality in the Admin Panel.

## How to Use

1. Log in as an admin user
2. Go to **Admin Panel**
3. Select the appropriate tab (e.g., "Year-wise Placement")
4. Click the **Import CSV** button
5. Select the corresponding CSV file from this folder
6. The data will be imported into the database

## Files

- `year_wise_placement.csv` - Overall placement statistics by year
- `salary_data.csv` - Salary ranges by year
- `top_recruiters.csv` - Top recruiting companies
- `company_placements.csv` - Individual company placement records
- `department_placements.csv` - Department-wise placement data
- `prediction_data.csv` - Future placement predictions

## Important Notes

- **year**: Use integers (2026, 2027, etc.)
- **percentage**: Use integers 0-100 (89 = 89%)
- **confidence**: Use decimals 0-1 (0.85 = 85%)
- **salary_pa**: Use full rupees (2550000 = ₹25.5L)
- **salary fields in other tables**: Use lakhs (25.5 = ₹25.5L)

## Column Requirements

Each CSV must have the exact column names shown in the sample files. Missing or extra columns will cause import errors.

### year_wise_placement.csv
- year (integer)
- placed (integer)
- unplaced (integer)
- percentage (integer 0-100)
- companies_visited (integer)
- highest_salary (decimal in lakhs)

### salary_data.csv
- year (integer)
- min_salary (decimal in lakhs)
- avg_salary (decimal in lakhs)
- max_salary (decimal in lakhs)

### top_recruiters.csv
- company (text)
- hires (integer)
- avg_package (decimal in lakhs)

### company_placements.csv
- company (text)
- year (integer)
- hires (integer)
- salary_pa (integer in full rupees)
- job_role (text)

### department_placements.csv
- year (integer)
- department (text: CSE, ECE, EEE, MECH, CIVIL, IT)
- placed (integer)
- total (integer)
- percentage (integer 0-100)

### prediction_data.csv
- year (integer)
- predicted (integer 0-100)
- confidence (decimal 0-1)
