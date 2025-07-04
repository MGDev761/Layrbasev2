-- Leave Management Schema for Layrbase
-- Run this in your Supabase SQL editor

-- Leave balances table
CREATE TABLE IF NOT EXISTS leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('holiday', 'sick', 'unpaid', 'parental', 'custom')),
  balance DECIMAL NOT NULL DEFAULT 0,
  used DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, employee_id, type)
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('holiday', 'sick', 'unpaid', 'parental', 'custom')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days DECIMAL NOT NULL,
  half_day BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'cancelled')),
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by INTEGER REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leave_balances_org_employee ON leave_balances(organization_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_balances_type ON leave_balances(type);
CREATE INDEX IF NOT EXISTS idx_leave_requests_org_employee ON leave_requests(organization_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON leave_requests(start_date, end_date);

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_leave_balances_updated_at ON leave_balances;
CREATE TRIGGER update_leave_balances_updated_at BEFORE UPDATE ON leave_balances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leave_requests_updated_at ON leave_requests;
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for leave_balances
DROP POLICY IF EXISTS "Users can view leave balances for their organization" ON leave_balances;
CREATE POLICY "Users can view leave balances for their organization" ON leave_balances
  FOR SELECT USING (public.is_org_member(organization_id, auth.uid()));

DROP POLICY IF EXISTS "Users can manage leave balances for their organization" ON leave_balances;
CREATE POLICY "Users can manage leave balances for their organization" ON leave_balances
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid()));

-- RLS policies for leave_requests
DROP POLICY IF EXISTS "Users can view leave requests for their organization" ON leave_requests;
CREATE POLICY "Users can view leave requests for their organization" ON leave_requests
  FOR SELECT USING (public.is_org_member(organization_id, auth.uid()));

DROP POLICY IF EXISTS "Users can manage leave requests for their organization" ON leave_requests;
CREATE POLICY "Users can manage leave requests for their organization" ON leave_requests
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid())); 