import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer 
} from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState({ totals: {}, categoryBreakdown: [], monthlyTrends: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/reports/dashboard');
        setData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64 text-slate-500">Loading dashboard...</div>;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const cardClass = "bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors";

  return (
    <div className="flex flex-col gap-8">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardClass} flex items-center gap-5`}>
          <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-xl">
            <Wallet size={32} className="text-primary" />
          </div>
          <div>
            <p className="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Current Balance</p>
            <h2 className="m-0 text-2xl font-bold text-slate-800 dark:text-white">₹{data.totals?.balance?.toFixed(2) || '0.00'}</h2>
          </div>
        </div>
        
        <div className={`${cardClass} flex items-center gap-5`}>
          <div className="p-4 bg-success/10 dark:bg-success/20 rounded-xl">
            <ArrowUpCircle size={32} className="text-success" />
          </div>
          <div>
            <p className="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Total Income</p>
            <h2 className="m-0 text-2xl font-bold text-slate-800 dark:text-white">₹{data.totals?.income?.toFixed(2) || '0.00'}</h2>
          </div>
        </div>

        <div className={`${cardClass} flex items-center gap-5`}>
          <div className="p-4 bg-danger/10 dark:bg-danger/20 rounded-xl">
            <ArrowDownCircle size={32} className="text-danger" />
          </div>
          <div>
            <p className="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</p>
            <h2 className="m-0 text-2xl font-bold text-slate-800 dark:text-white">₹{data.totals?.expense?.toFixed(2) || '0.00'}</h2>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className={cardClass}>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Expense by Category</h3>
          <div className="h-[300px]">
            {data.categoryBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No expense data available</div>
            )}
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Income vs Expenses</h3>
          <div className="h-[300px]">
             {data.monthlyTrends?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-slate-200)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dx={-10} />
                  <RechartsTooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Legend wrapperStyle={{paddingTop: '20px'}} />
                  <Bar dataKey="income" fill="var(--color-success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="expense" fill="var(--color-danger)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No trend data available</div>
             )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
