-- Invoicing System Schema
-- This creates tables for managing both sent and received invoices

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sent Invoices (Accounts Receivable)
CREATE TABLE sent_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_address TEXT,
    date_issued DATE NOT NULL,
    due_date DATE NOT NULL,
    description TEXT,
    currency VARCHAR(3) DEFAULT 'GBP',
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    notes TEXT,
    pdf_url TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_reference VARCHAR(255),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    UNIQUE(organization_id, invoice_number)
);

-- Received Invoices (Accounts Payable)
CREATE TABLE received_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_email VARCHAR(255),
    supplier_address TEXT,
    date_issued DATE NOT NULL,
    due_date DATE NOT NULL,
    description TEXT,
    currency VARCHAR(3) DEFAULT 'GBP',
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'paid', 'overdue', 'cancelled')),
    category VARCHAR(100),
    payment_method VARCHAR(50),
    payment_scheduled_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_reference VARCHAR(255),
    file_url TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    UNIQUE(organization_id, invoice_number)
);

-- Line Items for Sent Invoices
CREATE TABLE sent_invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES sent_invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_rate DECIMAL(15,2) NOT NULL DEFAULT 0,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CHECK (quantity > 0),
    CHECK (unit_rate >= 0),
    CHECK (amount >= 0)
);

-- Invoice Attachments
CREATE TABLE invoice_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL,
    invoice_type VARCHAR(20) NOT NULL CHECK (invoice_type IN ('sent', 'received')),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES auth.users(id)
);

-- Invoice Status History (for tracking status changes)
CREATE TABLE invoice_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL,
    invoice_type VARCHAR(20) NOT NULL CHECK (invoice_type IN ('sent', 'received')),
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    changed_by UUID REFERENCES auth.users(id),
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_sent_invoices_organization ON sent_invoices(organization_id);
CREATE INDEX idx_sent_invoices_status ON sent_invoices(status);
CREATE INDEX idx_sent_invoices_date_issued ON sent_invoices(date_issued);
CREATE INDEX idx_sent_invoices_due_date ON sent_invoices(due_date);
CREATE INDEX idx_sent_invoices_client ON sent_invoices(client_name);

CREATE INDEX idx_received_invoices_organization ON received_invoices(organization_id);
CREATE INDEX idx_received_invoices_status ON received_invoices(status);
CREATE INDEX idx_received_invoices_date_issued ON received_invoices(date_issued);
CREATE INDEX idx_received_invoices_due_date ON received_invoices(due_date);
CREATE INDEX idx_received_invoices_supplier ON received_invoices(supplier_name);
CREATE INDEX idx_received_invoices_category ON received_invoices(category);

CREATE INDEX idx_sent_invoice_line_items_invoice ON sent_invoice_line_items(invoice_id);
CREATE INDEX idx_invoice_attachments_invoice ON invoice_attachments(invoice_id, invoice_type);
CREATE INDEX idx_invoice_status_history_invoice ON invoice_status_history(invoice_id, invoice_type);

-- Row Level Security (RLS) Policies
ALTER TABLE sent_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE received_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sent_invoices
CREATE POLICY "Users can view sent invoices in their organization" ON sent_invoices
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert sent invoices in their organization" ON sent_invoices
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update sent invoices in their organization" ON sent_invoices
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete sent invoices in their organization" ON sent_invoices
    FOR DELETE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for received_invoices
CREATE POLICY "Users can view received invoices in their organization" ON received_invoices
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert received invoices in their organization" ON received_invoices
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update received invoices in their organization" ON received_invoices
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete received invoices in their organization" ON received_invoices
    FOR DELETE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for sent_invoice_line_items
CREATE POLICY "Users can view line items for invoices in their organization" ON sent_invoice_line_items
    FOR SELECT USING (
        invoice_id IN (
            SELECT id FROM sent_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can insert line items for invoices in their organization" ON sent_invoice_line_items
    FOR INSERT WITH CHECK (
        invoice_id IN (
            SELECT id FROM sent_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update line items for invoices in their organization" ON sent_invoice_line_items
    FOR UPDATE USING (
        invoice_id IN (
            SELECT id FROM sent_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete line items for invoices in their organization" ON sent_invoice_line_items
    FOR DELETE USING (
        invoice_id IN (
            SELECT id FROM sent_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        )
    );

-- RLS Policies for invoice_attachments
CREATE POLICY "Users can view attachments for invoices in their organization" ON invoice_attachments
    FOR SELECT USING (
        invoice_id IN (
            SELECT id FROM sent_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        ) OR invoice_id IN (
            SELECT id FROM received_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can insert attachments for invoices in their organization" ON invoice_attachments
    FOR INSERT WITH CHECK (
        invoice_id IN (
            SELECT id FROM sent_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        ) OR invoice_id IN (
            SELECT id FROM received_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        )
    );

-- RLS Policies for invoice_status_history
CREATE POLICY "Users can view status history for invoices in their organization" ON invoice_status_history
    FOR SELECT USING (
        invoice_id IN (
            SELECT id FROM sent_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        ) OR invoice_id IN (
            SELECT id FROM received_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can insert status history for invoices in their organization" ON invoice_status_history
    FOR INSERT WITH CHECK (
        invoice_id IN (
            SELECT id FROM sent_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        ) OR invoice_id IN (
            SELECT id FROM received_invoices 
            WHERE organization_id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_sent_invoices_updated_at BEFORE UPDATE ON sent_invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_received_invoices_updated_at BEFORE UPDATE ON received_invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate invoice totals
CREATE OR REPLACE FUNCTION calculate_sent_invoice_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate subtotal from line items
    SELECT COALESCE(SUM(amount), 0) INTO NEW.subtotal
    FROM sent_invoice_line_items
    WHERE invoice_id = NEW.id;
    
    -- Calculate total (subtotal + tax)
    NEW.total_amount = NEW.subtotal + COALESCE(NEW.tax_amount, 0);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically calculate totals when line items change
CREATE TRIGGER calculate_sent_invoice_total_trigger
    AFTER INSERT OR UPDATE OR DELETE ON sent_invoice_line_items
    FOR EACH ROW EXECUTE FUNCTION calculate_sent_invoice_total();

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_invoice_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO invoice_status_history (
            invoice_id,
            invoice_type,
            old_status,
            new_status,
            changed_by,
            notes
        ) VALUES (
            NEW.id,
            'sent',
            OLD.status,
            NEW.status,
            auth.uid(),
            'Status changed from ' || OLD.status || ' to ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_sent_invoice_status_change
    AFTER UPDATE ON sent_invoices
    FOR EACH ROW EXECUTE FUNCTION log_invoice_status_change();

-- Function to log received invoice status changes
CREATE OR REPLACE FUNCTION log_received_invoice_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO invoice_status_history (
            invoice_id,
            invoice_type,
            old_status,
            new_status,
            changed_by,
            notes
        ) VALUES (
            NEW.id,
            'received',
            OLD.status,
            NEW.status,
            auth.uid(),
            'Status changed from ' || OLD.status || ' to ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_received_invoice_status_change
    AFTER UPDATE ON received_invoices
    FOR EACH ROW EXECUTE FUNCTION log_received_invoice_status_change();

-- Insert some sample data for testing
INSERT INTO sent_invoices (
    organization_id,
    invoice_number,
    client_name,
    date_issued,
    due_date,
    description,
    total_amount,
    status
) VALUES 
(
    (SELECT id FROM organizations LIMIT 1),
    'INV-1023',
    'Dentsu UK',
    '2025-01-10',
    '2025-02-10',
    'June media planning services',
    12000.00,
    'sent'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'INV-1022',
    'Unilever',
    '2025-01-08',
    '2025-02-08',
    'Q1 consulting services',
    8500.00,
    'paid'
);

INSERT INTO received_invoices (
    organization_id,
    invoice_number,
    supplier_name,
    date_issued,
    due_date,
    description,
    total_amount,
    status,
    category
) VALUES 
(
    (SELECT id FROM organizations LIMIT 1),
    'SUP-8867',
    'AWS UK',
    '2025-01-05',
    '2025-02-05',
    'Cloud services - January 2025',
    1350.00,
    'pending',
    'Infrastructure'
),
(
    (SELECT id FROM organizations LIMIT 1),
    'SUP-8866',
    'Adobe Creative Cloud',
    '2025-01-03',
    '2025-02-03',
    'Monthly subscription',
    89.00,
    'paid',
    'SaaS'
); 