import React, { useState } from 'react';
import { Menu, Search, Bell, User, ChevronDown } from 'lucide-react';

const Header = () => {
  const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);

  const navItems = ['Portfolio', 'Spot', 'Futures', 'Options', 'Wallet & Fees', 'API Trading', 'Crypto Deposit'];

  return (
    <header className="bg-secondary border-b border-gray-800 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <img 
            src="https://fusiongrid.dev/exc/derivative/images/logo/logo.png" 
            alt="Platinx" 
            className="h-8"
          />
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <button 
                key={index}
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                {item}
              </button>
            ))}
            
            {/* Orders Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowOrdersDropdown(true)}
              onMouseLeave={() => setShowOrdersDropdown(false)}
            >
              <button className="text-gray-300 hover:text-white text-sm transition-colors flex items-center space-x-1">
                <span>Orders</span>
                <ChevronDown size={14} className={`transition-transform ${showOrdersDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showOrdersDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-secondary border border-gray-700 rounded-lg shadow-xl z-50">
                  <button className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white text-sm transition-colors rounded-t-lg">
                    Spot Orders
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white text-sm transition-colors rounded-b-lg">
                    Futures Orders
                  </button>
                </div>
              )}
            </div>

            <button className="text-gray-300 hover:text-white text-sm transition-colors">
              Smartinvest
            </button>
            <button className="text-gray-300 hover:text-white text-sm transition-colors">
              Affiliate Program
            </button>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white">
            <Search size={20} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Bell size={20} />
          </button>
          <button className="bg-accent text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-600 transition-colors">
            A
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;