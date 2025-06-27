import { supabase } from '../lib/supabase';

export const invoiceService = {
  // Get invoice statistics for dashboard
  async getStats(organizationId) {
    try {
      const [
        { data: sentInvoices, error: sentError },
        { data: receivedInvoices, error: receivedError }
      ] = await Promise.all([
        supabase
          .from('sent_invoices')
          .select('status, total_amount, due_date')
          .eq('organization_id', organizationId),
        supabase
          .from('received_invoices')
          .select('status, total_amount, due_date')
          .eq('organization_id', organizationId)
      ]);

      if (sentError) throw sentError;
      if (receivedError) throw receivedError;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Calculate statistics
      const stats = {
        totalSent: sentInvoices.length,
        totalReceived: receivedInvoices.length,
        totalPaid: 0,
        totalUnpaid: 0,
        totalOverdue: 0,
        outstandingReceivables: 0,
        outstandingPayables: 0,
        netFlow: 0
      };

      // Process sent invoices
      sentInvoices.forEach(invoice => {
        if (invoice.status === 'paid') {
          stats.totalPaid++;
        } else if (invoice.status === 'overdue') {
          stats.totalOverdue++;
          stats.outstandingReceivables += parseFloat(invoice.total_amount);
        } else if (['draft', 'sent'].includes(invoice.status)) {
          stats.totalUnpaid++;
          stats.outstandingReceivables += parseFloat(invoice.total_amount);
        }
      });

      // Process received invoices
      receivedInvoices.forEach(invoice => {
        if (invoice.status === 'paid') {
          stats.totalPaid++;
        } else if (invoice.status === 'overdue') {
          stats.totalOverdue++;
          stats.outstandingPayables += parseFloat(invoice.total_amount);
        } else if (['pending', 'scheduled'].includes(invoice.status)) {
          stats.totalUnpaid++;
          stats.outstandingPayables += parseFloat(invoice.total_amount);
        }
      });

      // Calculate net flow
      stats.netFlow = stats.outstandingReceivables - stats.outstandingPayables;

      return stats;
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
      throw error;
    }
  },

  // Get sent invoices with optional filters
  async getSentInvoices(organizationId, filters = {}) {
    try {
      let query = supabase
        .from('sent_invoices')
        .select(`
          *,
          sent_invoice_line_items(*)
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        query = query.or(`client_name.ilike.%${filters.search}%,invoice_number.ilike.%${filters.search}%`);
      }

      if (filters.dateFrom) {
        query = query.gte('date_issued', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('date_issued', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching sent invoices:', error);
      throw error;
    }
  },

  // Get received invoices with optional filters
  async getReceivedInvoices(organizationId, filters = {}) {
    try {
      let query = supabase
        .from('received_invoices')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        query = query.or(`supplier_name.ilike.%${filters.search}%,invoice_number.ilike.%${filters.search}%`);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.dateFrom) {
        query = query.gte('date_issued', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('date_issued', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching received invoices:', error);
      throw error;
    }
  },

  // Create a new sent invoice
  async createSentInvoice(organizationId, invoiceData) {
    try {
      const { lineItems, ...invoice } = invoiceData;

      // Calculate totals
      const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const total = subtotal + (invoice.tax_amount || 0);

      // Insert invoice
      const { data: invoiceRecord, error: invoiceError } = await supabase
        .from('sent_invoices')
        .insert({
          ...invoice,
          organization_id: organizationId,
          subtotal,
          total_amount: total,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Insert line items
      if (lineItems && lineItems.length > 0) {
        const lineItemsData = lineItems.map((item, index) => ({
          invoice_id: invoiceRecord.id,
          description: item.description,
          quantity: parseFloat(item.quantity),
          unit_rate: parseFloat(item.rate),
          amount: parseFloat(item.quantity) * parseFloat(item.rate),
          sort_order: index
        }));

        // Explicitly pick only allowed fields
        const allowedFields = ['invoice_id', 'description', 'quantity', 'unit_rate', 'amount', 'sort_order'];
        const sanitizedLineItemsData = lineItemsData.map(item => {
          const sanitized = {};
          allowedFields.forEach(field => {
            sanitized[field] = item[field];
          });
          return sanitized;
        });

        console.log('Inserting sanitized line items:', sanitizedLineItemsData);

        const { error: lineItemsError } = await supabase
          .from('sent_invoice_line_items')
          .insert(sanitizedLineItemsData);

        if (lineItemsError) throw lineItemsError;
      }

      return invoiceRecord;
    } catch (error) {
      console.error('Error creating sent invoice:', error);
      throw error;
    }
  },

  // Upload a received invoice
  async uploadReceivedInvoice(organizationId, invoiceData, file = null) {
    try {
      let fileUrl = null;

      // Upload file if provided
      if (file) {
        const fileName = `invoices/${organizationId}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('invoices')
          .upload(fileName, file);

        console.log('Upload response:', uploadData, uploadError);

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('invoices')
          .getPublicUrl(fileName);

        console.log('Public URL data:', publicUrlData);

        fileUrl = publicUrlData.publicUrl;
      }

      // Insert invoice
      const { data, error } = await supabase
        .from('received_invoices')
        .insert({
          ...invoiceData,
          organization_id: organizationId,
          file_url: fileUrl,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      console.log('DB insert response:', data, error);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading received invoice:', error);
      throw error;
    }
  },

  // Update invoice status
  async updateInvoiceStatus(invoiceId, invoiceType, status, notes = '') {
    try {
      const tableName = invoiceType === 'sent' ? 'sent_invoices' : 'received_invoices';
      
      const updateData = { status };
      
      // Add paid_at timestamp if status is 'paid'
      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', invoiceId)
        .select()
        .single();

      if (error) throw error;

      // Log status change
      await supabase
        .from('invoice_status_history')
        .insert({
          invoice_id: invoiceId,
          invoice_type: invoiceType,
          new_status: status,
          changed_by: (await supabase.auth.getUser()).data.user?.id,
          notes
        });

      return data;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },

  // Delete invoice
  async deleteInvoice(invoiceId, invoiceType) {
    try {
      const tableName = invoiceType === 'sent' ? 'sent_invoices' : 'received_invoices';
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  // Get invoice by ID
  async getInvoiceById(invoiceId, invoiceType) {
    try {
      const tableName = invoiceType === 'sent' ? 'sent_invoices' : 'received_invoices';
      
      let query = supabase
        .from(tableName)
        .select('*')
        .eq('id', invoiceId)
        .single();

      // Include line items for sent invoices
      if (invoiceType === 'sent') {
        query = supabase
          .from(tableName)
          .select(`
            *,
            sent_invoice_line_items(*)
          `)
          .eq('id', invoiceId)
          .single();
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  // Get recent activity
  async getRecentActivity(organizationId, limit = 10) {
    try {
      const [
        { data: sentInvoices, error: sentError },
        { data: receivedInvoices, error: receivedError }
      ] = await Promise.all([
        supabase
          .from('sent_invoices')
          .select('id, invoice_number, client_name, total_amount, status, created_at')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false })
          .limit(limit),
        supabase
          .from('received_invoices')
          .select('id, invoice_number, supplier_name, total_amount, status, created_at')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false })
          .limit(limit)
      ]);

      if (sentError) throw sentError;
      if (receivedError) throw receivedError;

      // Combine and sort by date
      const allActivity = [
        ...sentInvoices.map(invoice => ({
          ...invoice,
          type: 'sent',
          title: `Invoice ${invoice.invoice_number} sent to ${invoice.client_name}`,
          amount: `£${invoice.total_amount.toLocaleString()}`,
          date: new Date(invoice.created_at).toLocaleDateString()
        })),
        ...receivedInvoices.map(invoice => ({
          ...invoice,
          type: 'received',
          title: `Invoice ${invoice.invoice_number} received from ${invoice.supplier_name}`,
          amount: `£${invoice.total_amount.toLocaleString()}`,
          date: new Date(invoice.created_at).toLocaleDateString()
        }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
       .slice(0, limit);

      return allActivity;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  },

  // Get invoice status history
  async getInvoiceStatusHistory(invoiceId, invoiceType) {
    try {
      const { data, error } = await supabase
        .from('invoice_status_history')
        .select(`
          *,
          changed_by_user:users!invoice_status_history_changed_by_fkey(email)
        `)
        .eq('invoice_id', invoiceId)
        .eq('invoice_type', invoiceType)
        .order('changed_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching status history:', error);
      throw error;
    }
  },

  // Bulk operations
  async bulkUpdateStatus(invoiceIds, invoiceType, status) {
    try {
      const tableName = invoiceType === 'sent' ? 'sent_invoices' : 'received_invoices';
      
      const updateData = { status };
      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .in('id', invoiceIds)
        .select();

      if (error) throw error;

      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Log status changes
      const statusHistoryData = invoiceIds.map(id => ({
        invoice_id: id,
        invoice_type: invoiceType,
        new_status: status,
        changed_by: userId,
        notes: `Bulk status update to ${status}`
      }));

      await supabase
        .from('invoice_status_history')
        .insert(statusHistoryData);

      return data;
    } catch (error) {
      console.error('Error bulk updating status:', error);
      throw error;
    }
  },

  // Export invoices to CSV
  async exportInvoices(organizationId, invoiceType, filters = {}) {
    try {
      const invoices = invoiceType === 'sent' 
        ? await this.getSentInvoices(organizationId, filters)
        : await this.getReceivedInvoices(organizationId, filters);

      // Convert to CSV format
      const headers = invoiceType === 'sent' 
        ? ['Invoice Number', 'Client', 'Date Issued', 'Due Date', 'Amount', 'Status', 'Description']
        : ['Invoice Number', 'Supplier', 'Date Issued', 'Due Date', 'Amount', 'Status', 'Category', 'Description'];

      const csvData = [
        headers.join(','),
        ...invoices.map(invoice => {
          const row = invoiceType === 'sent'
            ? [
                invoice.invoice_number,
                invoice.client_name,
                invoice.date_issued,
                invoice.due_date,
                invoice.total_amount,
                invoice.status,
                invoice.description || ''
              ]
            : [
                invoice.invoice_number,
                invoice.supplier_name,
                invoice.date_issued,
                invoice.due_date,
                invoice.total_amount,
                invoice.status,
                invoice.category || '',
                invoice.description || ''
              ];
          return row.map(field => `"${field}"`).join(',');
        })
      ].join('\n');

      return csvData;
    } catch (error) {
      console.error('Error exporting invoices:', error);
      throw error;
    }
  }
}; 