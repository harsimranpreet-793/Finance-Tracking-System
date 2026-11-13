import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Check, Clock, X } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', amount: '', dueDate: '', frequency: 'monthly'
  });

  const fetchBills = async () => {
    try {
      const res = await api.get('/bills');
      setBills(res.data);
    } catch (error) {
      toast.error('Failed to load bills');
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bills', formData);
      toast.success('Bill reminder added');
      setIsModalOpen(false);
      fetchBills();
      setFormData({ name: '', amount: '', dueDate: '', frequency: 'monthly' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving bill');
    }
  };

  const markAsPaid = async (id, currentStatus) => {
    try {
      await api.put(`/bills/${id}`, { isPaid: !currentStatus });
      toast.success(`Bill marked as ${!currentStatus ? 'paid' : 'unpaid'}`);
      fetchBills();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const inputClass = "w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recurring Bills</h2>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md transition-colors font-medium"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} /> Add Bill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bills.length > 0 ? (
          bills.map(bill => {
            const daysUntilDue = differenceInDays(new Date(bill.dueDate), new Date());
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
            const isOverdue = daysUntilDue < 0 && !bill.isPaid;

            let cardBorder = 'border-slate-100 dark:border-slate-700';
            if (!bill.isPaid) {
              if (isOverdue) cardBorder = 'border-danger/50 dark:border-danger/50';
              else if (isDueSoon) cardBorder = 'border-warning/50 dark:border-warning/50';
            }

            return (
              <div key={bill._id} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border ${cardBorder} transition-colors ${bill.isPaid ? 'opacity-60 grayscale-[0.2]' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-lg font-semibold text-slate-800 dark:text-white m-0 tracking-tight ${bill.isPaid ? 'line-through text-slate-400' : ''}`}>
                      {bill.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400">
                      <Clock size={14} /> 
                      <span className="text-xs">Due {format(new Date(bill.dueDate), 'MMM dd, yyyy')}</span>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-[10px] uppercase tracking-wider font-semibold rounded-md text-slate-600 dark:text-slate-300">
                        {bill.frequency}
                      </span>
                    </div>
                  </div>
                  <h3 className="m-0 text-xl font-bold text-slate-800 dark:text-white">₹{bill.amount.toFixed(2)}</h3>
                </div>

                {!bill.isPaid && isOverdue && (
                  <div className="inline-block bg-danger/10 text-danger px-2.5 py-1 rounded-md text-xs font-bold mb-4">
                    Overdue by {Math.abs(daysUntilDue)} days
                  </div>
                )}
                {!bill.isPaid && isDueSoon && (
                  <div className="inline-block bg-warning/10 text-warning px-2.5 py-1 rounded-md text-xs font-bold mb-4">
                    Due in {daysUntilDue} days!
                  </div>
                )}

                <div className={`border-t border-slate-100 dark:border-slate-700 pt-4 ${bill.isPaid || (!isOverdue && !isDueSoon) ? 'mt-4' : ''}`}>
                  <button 
                    onClick={() => markAsPaid(bill._id, bill.isPaid)}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium transition-colors ${
                      bill.isPaid 
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600' 
                        : 'bg-primary/10 text-primary dark:text-primary-hover hover:bg-primary hover:text-white'
                    }`} 
                  >
                    {bill.isPaid ? 'Mark as Unpaid' : <><Check size={16} /> Mark as Paid</>}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-slate-500">
            <p>No bills set up yet.</p>
          </div>
        )}
      </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Add Bill</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bill Name</label>
                <input type="text" required placeholder="Rent, Electricity, etc." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount (₹)</label>
                <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
                <input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Frequency</label>
                <select required value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} className={inputClass}>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 font-medium text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md transition-colors">
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Bills;
