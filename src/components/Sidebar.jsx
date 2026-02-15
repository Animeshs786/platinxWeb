import React, { useState } from 'react';
import { BarChart3, Menu, Wallet, ChevronRight } from 'lucide-react';

const Sidebar = ({ onShowPanel }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sidebarItems = [
    { icon: <ChevronRight size={20} />, color: 'text-gray-400', label: 'Toggle Panel', isToggle: true },
    { divider: true },
    { icon: '₿', color: 'text-white', label: 'BTC', bgColor: 'bg-orange-500' },
    { icon: 'Ξ', color: 'text-white', label: 'ETH', bgColor: 'bg-blue-600' },
    { icon: '◎', color: 'text-white', label: 'SOL', bgColor: 'bg-purple-600' },
    { icon: 'X', color: 'text-white', label: 'XRP', bgColor: 'bg-gray-700' },
    { icon: 'Ð', color: 'text-white', label: 'DOGE', bgColor: 'bg-yellow-600' },
    { icon: '🐕', color: 'text-white', label: 'SHIB', bgColor: 'bg-orange-600' },
    { divider: true },
    { icon: <BarChart3 size={18} />, color: 'text-gray-400', label: 'Charts' },
    { icon: <Menu size={18} />, color: 'text-gray-400', label: 'Menu' },
    { icon: <Wallet size={18} />, color: 'text-gray-400', label: 'Wallet' },
  ];

  return (
    <div
      className={`bg-[#0a0e13] border-r border-gray-800 transition-all duration-300 flex flex-col h-full ${
        isExpanded ? 'w-16' : 'w-14'
      }`}
      onMouseEnter={() => {
        setIsExpanded(true);
        onShowPanel(true);
      }}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Icon List */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {sidebarItems.map((item, index) => {
          if (item.divider) {
            return (
              <div key={index} className="px-3 py-1">
                <div className="border-t border-gray-700"></div>
              </div>
            );
          }

          if (item.isToggle) {
            return (
              <button
                key={index}
                onClick={() => onShowPanel(true)}
                className="w-full h-12 flex items-center justify-center hover:bg-gray-800 transition-colors group relative"
                title={item.label}
              >
                <span className={item.color}>{item.icon}</span>
                
                {/* Tooltip */}
                {isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </button>
            );
          }

          return (
            <button
              key={index}
              className="w-full h-12 flex items-center justify-center hover:bg-gray-800 transition-colors group relative"
              title={item.label}
            >
              {item.bgColor ? (
                <div className={`w-8 h-8 ${item.bgColor} rounded-full flex items-center justify-center shadow-md`}>
                  <span className="text-white text-sm font-bold">{item.icon}</span>
                </div>
              ) : (
                <span className={item.color}>{item.icon}</span>
              )}
              
              {/* Tooltip */}
              {isExpanded && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;