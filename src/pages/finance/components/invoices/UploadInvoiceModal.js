import React, { useState, useCallback } from 'react';
import { XMarkIcon, DocumentArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { invoiceService } from '../../../../services/invoiceService';

const UploadInvoiceModal = ({ isOpen, onClose, organizationId, onInvoiceUploaded }) => {
  const [formData, setFormData] = useState({
    supplier: '',
    invoiceNumber: '',
    dateIssued: '',
    dueDate: '',
    amount: '',
    currency: 'GBP',
    description: '',
    category: '',
    paymentMethod: '',
    status: 'pending'
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = useCallback((file) => {
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      // TODO: Extract data from PDF using OCR or parsing
      console.log('File uploaded:', file.name);
    } else {
      alert('Please upload a PDF file');
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }

    if (!formData.dateIssued) {
      newErrors.dateIssued = 'Date issued is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!uploadedFile) {
      newErrors.file = 'Please upload an invoice file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (!organizationId) {
        alert('No organization selected');
        return;
      }
      // Map form fields to DB columns
      const dbInvoiceData = {
        invoice_number: formData.invoiceNumber,
        supplier_name: formData.supplier,
        date_issued: formData.dateIssued,
        due_date: formData.dueDate,
        total_amount: formData.amount,
        category: formData.category,
        payment_method: formData.paymentMethod,
        status: formData.status,
        currency: formData.currency,
        description: formData.description,
      };
      await invoiceService.uploadReceivedInvoice(organizationId, dbInvoiceData, uploadedFile);
      onInvoiceUploaded();
    } catch (error) {
      console.error('Error uploading invoice:', error);
      alert('Error uploading invoice. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Upload Received Invoice</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice File *
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                isDragOver 
                  ? 'border-purple-400 bg-purple-50' 
                  : uploadedFile 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-3">
                  <DocumentTextIcon className="h-8 w-8 text-green-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Drag and drop your invoice PDF here, or{' '}
                      <label className="text-purple-600 hover:text-purple-500 cursor-pointer">
                        browse
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF files only, max 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{errors.file}</p>
            )}
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier *
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                  errors.supplier ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter supplier name"
              />
              {errors.supplier && (
                <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number *
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                  errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., SUP-8868"
              />
              {errors.invoiceNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Issued *
              </label>
              <input
                type="date"
                value={formData.dateIssued}
                onChange={(e) => handleInputChange('dateIssued', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                  errors.dateIssued ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateIssued && (
                <p className="mt-1 text-sm text-red-600">{errors.dateIssued}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select category</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="SaaS">SaaS</option>
                <option value="Contractors">Contractors</option>
                <option value="Supplies">Supplies</option>
                <option value="Marketing">Marketing</option>
                <option value="Legal">Legal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select method</option>
                <option value="Direct Debit">Direct Debit</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Check">Check</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Brief description of the invoice..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Upload Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadInvoiceModal; 