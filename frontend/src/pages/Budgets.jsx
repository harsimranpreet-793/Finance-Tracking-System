import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Plus, X } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [formData, setFormData] = useState({ category: 'Food', limit: '' });

  const fetchData = async () => {
    try {
      const [budgetsRes, txsRes] = await Promise.all([
        api.get(`/budgets?month=${selectedMonth}&year=${selectedYear}`),
        api.get(`/transactions?startDate=${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01&endDate=${selectedYear}-${String(selectedMonth).padStart(2, '0')}-31`)
      ]);
      setBudgets(budgetsRes.data);
      setTransactions(txsRes.data);
    } catch (error) {
      toast.error('Failed to load budgets data');
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', { ...formData, month: selectedMonth, year: selectedYear });
      toast.success('Budget saved');
      setIsModalOpen(false);
      fetchData();
      setFormData({ category: 'Food', limit: '' });
    } catch (error) {
      toast.error('Failed to save budget');
    }
  };

  const getCategorySpent = (category) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const inputClass = "w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors";

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Monthly Budgets</h2>
        <div className="flex items-center gap-3">
          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {Array.from({length: 12}).map((_, i) => (
              <option key={i+1} value={i+1}>{new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md transition-colors font-medium whitespace-nowrap"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Add Limit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length > 0 ? budgets.map(budget => {
          const spent = getCategorySpent(budget.category);
          const percentage = Math.min((spent / budget.limit) * 100, 100);
          
          let alertColor = 'bg-success';
          let textColor = 'text-success';
          if (percentage >= 100) {
            alertColor = 'bg-danger';
            textColor = 'text-danger';
          }
          else if (percentage >= 80) {
            alertColor = 'bg-warning';
            textColor = 'text-warning';
          }

          return (
            <div key={budget._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h4 className="m-0 text-lg font-semibold text-slate-800 dark:text-white">{budget.category}</h4>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-white">₹{spent.toFixed(2)}</strong> / ₹{budget.limit.toFixed(2)}
                </div>
              </div>
              
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${alertColor} transition-all duration-500 rounded-full`}
                  style={{ width: `${percentage}%` }} 
                />
              </div>
              
              <div className="mt-3 flex justify-between text-xs font-semibold">
                <span className={textColor}>{percentage.toFixed(1)}% Used</span>
                {percentage >= 100 && <span className="text-danger flex items-center gap-1">Limit Exceeded</span>}
                {percentage >= 80 && percentage < 100 && <span className="text-warning flex items-center gap-1">Warning</span>}
              </div>
            </div>
          )
        }) : (
          <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-slate-500">
            <p>No budgets set for this month.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Set Budget Limit</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputClass}>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Limit Amount (₹)</label>
                <input type="number" step="0.01" required value={formData.limit} onChange={e => setFormData({...formData, limit: e.target.value})} className={inputClass} />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 font-medium text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-colors">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Budgets;
