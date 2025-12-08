import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [invoicesExpanded, setInvoicesExpanded] = useState(true);
  const [vaultExpanded, setVaultExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-[280px] bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-5 border-b border-gray-200">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setVaultExpanded(!vaultExpanded)}
        >
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-gray-800">Vault</span>
            {user ? (
              <span className="text-sm text-gray-600">{user.name || user.email}</span>
            ) : (
              <span className="text-sm text-gray-600">Guest User</span>
            )}
          </div>
          <span className={`text-xs text-gray-600 transition-transform ${vaultExpanded ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </div>

      <nav className="py-2.5 border-b border-gray-200">
        <div className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-lg w-6 text-center">📊</span>
          <span className="text-sm text-gray-800">Dashboard</span>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-lg w-6 text-center">🔗</span>
          <span className="text-sm text-gray-800">Nexus</span>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-lg w-6 text-center">📥</span>
          <span className="text-sm text-gray-800">Intake</span>
        </div>
      </nav>

      <div className="border-b border-gray-200">
        <div 
          className="flex justify-between items-center px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setServicesExpanded(!servicesExpanded)}
        >
          <span className="text-sm font-semibold text-gray-800">Services</span>
          <span className={`text-xs text-gray-600 transition-transform ${servicesExpanded ? 'rotate-180' : ''}`}>▼</span>
        </div>
        {servicesExpanded && (
          <div className="px-5 py-2 pb-3 flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              <input type="checkbox" className="w-4 h-4 cursor-pointer" />
              <span>Pre-active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              <input type="checkbox" className="w-4 h-4 cursor-pointer" />
              <span>Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              <input type="checkbox" className="w-4 h-4 cursor-pointer" />
              <span>Blocked</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              <input type="checkbox" className="w-4 h-4 cursor-pointer" />
              <span>Closed</span>
            </label>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200">
        <div 
          className="flex justify-between items-center px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setInvoicesExpanded(!invoicesExpanded)}
        >
          <span className="text-sm font-semibold text-gray-800">Invoices</span>
          <span className={`text-xs text-gray-600 transition-transform ${invoicesExpanded ? 'rotate-180' : ''}`}>▼</span>
        </div>
        {invoicesExpanded && (
          <div className="px-5 py-2 pb-3 flex flex-col gap-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded bg-gray-100 font-medium cursor-pointer">
              <span className="text-base">📄</span>
              <span className="text-sm text-gray-800">Proforma Invoices</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-gray-50">
              <span className="text-base">📋</span>
              <span className="text-sm text-gray-800">Final Invoices</span>
            </div>
          </div>
        )}
      </div>

      {user && (
        <div className="mt-auto p-5 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
