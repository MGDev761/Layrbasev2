-- Populate leave balances for existing employees
-- Run this in your Supabase SQL editor

-- Insert default leave balances for employees who don't have them
INSERT INTO leave_balances (employee_id, type, year, balance, used, carryover, organization_id)
SELECT 
  e.id as employee_id,
  'holiday' as type,
  EXTRACT(YEAR FROM CURRENT_DATE) as year,
  25 as balance,
  0 as used,
  0 as carryover,
  e.organization_id
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM leave_balances lb 
  WHERE lb.employee_id = e.id 
  AND lb.type = 'holiday' 
  AND lb.year = EXTRACT(YEAR FROM CURRENT_DATE)
);

INSERT INTO leave_balances (employee_id, type, year, balance, used, carryover, organization_id)
SELECT 
  e.id as employee_id,
  'sick' as type,
  EXTRACT(YEAR FROM CURRENT_DATE) as year,
  10 as balance,
  0 as used,
  0 as carryover,
  e.organization_id
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM leave_balances lb 
  WHERE lb.employee_id = e.id 
  AND lb.type = 'sick' 
  AND lb.year = EXTRACT(YEAR FROM CURRENT_DATE)
);

INSERT INTO leave_balances (employee_id, type, year, balance, used, carryover, organization_id)
SELECT 
  e.id as employee_id,
  'unpaid' as type,
  EXTRACT(YEAR FROM CURRENT_DATE) as year,
  0 as balance,
  0 as used,
  0 as carryover,
  e.organization_id
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM leave_balances lb 
  WHERE lb.employee_id = e.id 
  AND lb.type = 'unpaid' 
  AND lb.year = EXTRACT(YEAR FROM CURRENT_DATE)
);

INSERT INTO leave_balances (employee_id, type, year, balance, used, carryover, organization_id)
SELECT 
  e.id as employee_id,
  'parental' as type,
  EXTRACT(YEAR FROM CURRENT_DATE) as year,
  0 as balance,
  0 as used,
  0 as carryover,
  e.organization_id
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM leave_balances lb 
  WHERE lb.employee_id = e.id 
  AND lb.type = 'parental' 
  AND lb.year = EXTRACT(YEAR FROM CURRENT_DATE)
); 