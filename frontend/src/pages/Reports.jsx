import React, { useState } from 'react';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FileText, Download } from 'lucide-react';

const Reports = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [reportData, setReportData] = useState(null);

  const generateReportData = async () => {
    try {
      const res = await api.get(`/transactions?startDate=${startDate}&endDate=${endDate}`);
      return res.data;
    } catch (error) {
      toast.error('Failed to grab report data');
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    const data = await generateReportData();
    if (!data) return;

    if (data.length === 0) {
      toast.info('No transactions in this date range.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Financial Report (${format(new Date(startDate), 'MMM dd')} - ${format(new Date(endDate), 'MMM dd, yyyy')})`, 14, 20);
    
    doc.setFontSize(12);
    let yPos = 40;

    let totalIncome = 0;
    let totalExpense = 0;

    doc.setFont("helvetica", "bold");
    doc.text("Date", 14, yPos);
    doc.text("Category", 50, yPos);
    doc.text("Type", 100, yPos);
    doc.text("Amount", 160, yPos);
    
    doc.setLineWidth(0.5);
    doc.line(14, yPos + 2, 200, yPos + 2);
    yPos += 10;
    
    doc.setFont("helvetica", "normal");
    
    data.forEach(t => {
      const dateStr = format(new Date(t.date), 'MM/dd/yyyy');
      doc.text(dateStr, 14, yPos);
      doc.text(t.category, 50, yPos);
      doc.text(t.type, 100, yPos);
      doc.text(`₹${t.amount.toFixed(2)}`, 160, yPos);
      
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
      
      yPos += 8;
    });

    yPos += 10;
    
    doc.setFont("helvetica", "bold");
    doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`, 14, yPos);
    doc.text(`Total Expense: ₹${totalExpense.toFixed(2)}`, 14, yPos + 8);
    doc.text(`Net Balance: ₹${(totalIncome - totalExpense).toFixed(2)}`, 14, yPos + 16);

    doc.save(`finance-report_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-primary/10 rounded-xl">
          <FileText size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white m-0">Generate Reports</h2>
      </div>
      
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">
        Select a date range to generate a comprehensive financial report detailing every logged transaction, total categorizations, and net balance.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 mb-10 items-end">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)} 
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Date</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)} 
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
        </div>
        <button 
          onClick={async () => {
            const data = await generateReportData();
            if (data) setReportData(data);
          }}
          className="w-full sm:w-auto p-2.5 px-6 font-medium text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
        >
          Load Data for CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-700">
        <button 
          onClick={handleDownloadPDF} 
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-md shadow-red-500/20 transition-colors"
        >
          <Download size={18} />
          Export as PDF (Styled)
        </button>

        {reportData && reportData.length > 0 ? (
          <CSVLink 
            data={reportData} 
            filename={`finance-data_${startDate}_to_${endDate}.csv`}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-md shadow-emerald-500/20 transition-colors no-underline"
          >
            <Download size={18} />
            Download Raw CSV
          </CSVLink>
        ) : (
          <button 
            disabled 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-medium rounded-xl cursor-not-allowed"
          >
            <Download size={18} />
            CSV (Load Data First)
          </button>
        )}
      </div>

    </div>
  );
};

export default Reports;
