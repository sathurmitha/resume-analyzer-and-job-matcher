import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileText, Briefcase, Bookmark, History, User, LogOut, Menu, X, Sparkles } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: <FileText size={20} /> },
    { name: 'Job Matches', path: '/jobs', icon: <Briefcase size={20} /> },
    { name: 'Saved Jobs', path: '/saved-jobs', icon: <Bookmark size={20} /> },
    { name: 'History', path: '/history', icon: <History size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50/80 font-sans text-slate-900">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden md:flex flex-col shadow-xs">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">ResumeAI</h1>
            <p className="text-xs font-semibold text-emerald-600">Career Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-72 bg-white flex flex-col h-full shadow-2xl z-10 p-6">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                  <Sparkles size={18} />
                </div>
                <h1 className="text-xl font-bold text-slate-900">ResumeAI</h1>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 hover:text-slate-900 p-1">
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 shadow-2xs">
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu size={22} />
            </button>
            <span className="text-lg font-extrabold text-slate-900 ml-2">ResumeAI</span>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100/80 transition-colors py-1.5 px-3.5 rounded-full border border-slate-200/80">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-semibold text-slate-700 pr-1">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/70 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
