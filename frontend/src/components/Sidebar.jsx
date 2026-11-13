import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Receipt,
  FileText,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();

  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-3 p-3 rounded-xl font-medium transition-colors duration-200 mb-1 ` +
    (isActive 
      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-hover' 
      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800');

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col p-6 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md">
          <PieChart size={18} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white m-0">FinanceApp</h2>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        <NavLink to="/" className={navLinkClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={navLinkClass}>
          <ArrowLeftRight size={20} />
          Transactions
        </NavLink>
        <NavLink to="/budgets" className={navLinkClass}>
          <PieChart size={20} />
          Budgets
        </NavLink>
        <NavLink to="/bills" className={navLinkClass}>
          <Receipt size={20} />
          Bills
        </NavLink>
        <NavLink to="/reports" className={navLinkClass}>
          <FileText size={20} />
          Reports
        </NavLink>
      </nav>

      <button 
        onClick={logout} 
        className="flex items-center gap-3 p-3 rounded-xl font-medium text-slate-500 dark:text-slate-400 hover:text-danger dark:hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-left w-full cursor-pointer"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
