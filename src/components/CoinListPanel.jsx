import React, { useState } from 'react';
import { Search, Star, TrendingUp } from 'lucide-react';

const CoinListPanel = ({ isOpen, onMouseEnter, onMouseLeave }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(['BTC/INR', 'XRP/INR', 'ETH/INR', 'SHIB/INR']);

  const allCoins = [
    { id: 1, pair: 'USDT/INR', exchange: 'CoinSwitchX', price: '₹94.20', change: '-0.47%', volume: '3.59 Cr', isNegative: true, icon: '₮', color: 'bg-green-600' },
    { id: 2, pair: 'BTC/INR', exchange: 'CoinSwitchX', price: '₹67,07,000', change: '+0.42%', volume: '79.66 Lac', isNegative: false, icon: '₿', color: 'bg-orange-500' },
    { id: 3, pair: 'DOGE/INR', exchange: 'CoinSwitchX', price: '₹10.8829', change: '+17.97%', volume: '51.57 Lac', isNegative: false, icon: 'Ð', color: 'bg-yellow-600' },
    { id: 4, pair: 'XRP/INR', exchange: 'CoinSwitchX', price: '₹153.64', change: '+11.14%', volume: '44.97 Lac', isNegative: false, icon: 'X', color: 'bg-gray-700' },
    { id: 5, pair: 'ETH/INR', exchange: 'CoinSwitchX', price: '₹1,95,535', change: '-1.69%', volume: '44.14 Lac', isNegative: true, icon: 'Ξ', color: 'bg-blue-600' },
    { id: 6, pair: 'PEPE/INR', exchange: 'CoinSwitchX', price: '₹0.0004556', change: '+24.00%', volume: '33.90 Lac', isNegative: false, icon: '🐸', color: 'bg-green-700' },
    { id: 7, pair: 'SOL/INR', exchange: 'CoinSwitchX', price: '₹8,516.62', change: '+3.32%', volume: '28.74 Lac', isNegative: false, icon: '◎', color: 'bg-purple-600' },
    { id: 8, pair: 'SHIB/INR', exchange: 'CoinSwitchX', price: '₹0.000657', change: '+6.82%', volume: '15.82 Lac', isNegative: false, icon: '🐕', color: 'bg-orange-600' },
    { id: 9, pair: 'GALA/INR', exchange: 'CoinSwitchX', price: '₹0.4020', change: '+0.34%', volume: '13.52 Lac', isNegative: false, icon: '⬡', color: 'bg-gray-600' },
    { id: 10, pair: 'EUR/INR', exchange: 'CoinSwitchX', price: '₹89.50', change: '+2.15%', volume: '12.33 Lac', isNegative: false, icon: '€', color: 'bg-blue-700' },
  ];

  const innovationCoins = allCoins.filter(coin => ['PEPE/INR', 'SHIB/INR', 'DOGE/INR'].includes(coin.pair));

  const toggleFavorite = (pair) => {
    setFavorites(prev => 
      prev.includes(pair) ? prev.filter(p => p !== pair) : [...prev, pair]
    );
  };

  const getDisplayCoins = () => {
    let coins;
    if (activeTab === 'FAVORITES') {
      coins = allCoins.filter(coin => favorites.includes(coin.pair));
    } else if (activeTab === 'ALL') {
      coins = allCoins;
    } else if (activeTab === 'INNOVATION ZONE') {
      coins = innovationCoins;
    }
    
    if (searchQuery) {
      coins = coins.filter(coin => 
        coin.pair.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return coins;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="w-[400px] bg-[#0f1419] border-r border-gray-800 flex flex-col h-full shadow-2xl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header with Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2 bg-[#1a2332] rounded-lg px-3 py-2.5">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search coins"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-4 px-4 py-3 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('FAVORITES')}
          className={`pb-2 text-sm font-medium transition-colors relative ${
            activeTab === 'FAVORITES' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Star size={16} fill={activeTab === 'FAVORITES' ? 'currentColor' : 'none'} />
          {activeTab === 'FAVORITES' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-2 text-sm font-medium transition-colors relative ${
            activeTab === 'ALL' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>ALL</span>
          {activeTab === 'ALL' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('INNOVATION ZONE')}
          className={`pb-2 text-sm font-medium transition-colors relative ${
            activeTab === 'INNOVATION ZONE' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>INNOVATION ZONE</span>
          {activeTab === 'INNOVATION ZONE' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
          )}
        </button>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-3 text-xs text-gray-400 border-b border-gray-800 bg-[#0a0e13]">
        <div className="flex items-center">
          <div className="w-6"></div>
          <span>Pair</span>
        </div>
        <div className="text-right">Price</div>
        <div className="text-right">Change</div>
        <div className="text-right">Vol</div>
      </div>

      {/* Coin List */}
      <div className="flex-1 overflow-y-auto">
        {getDisplayCoins().map((coin) => (
          <div
            key={coin.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-4 hover:bg-[#1a2332] transition-colors cursor-pointer border-b border-gray-800"
          >
            {/* Star + Coin Info */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleFavorite(coin.pair)}
                className="flex-shrink-0"
              >
                <Star
                  size={16}
                  className={favorites.includes(coin.pair) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                />
              </button>

              <div className={`w-7 h-7 ${coin.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {coin.icon}
              </div>

              <div className="min-w-0">
                <div className="text-white text-sm font-medium truncate">{coin.pair}</div>
                <div className="text-gray-500 text-xs truncate">{coin.exchange}</div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right text-white text-sm font-medium truncate">
              {coin.price}
            </div>

            {/* Change */}
            <div className={`text-right text-sm font-medium truncate ${
              coin.isNegative ? 'text-red-500' : 'text-green-500'
            }`}>
              {coin.change}
            </div>

            {/* Volume */}
            <div className="text-right text-gray-400 text-xs truncate">
              {coin.volume}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info Bar */}
      <div className="border-t border-gray-800 px-4 py-3 bg-[#0a0e13]">
        <div className="flex items-center text-xs text-gray-400">
          <TrendingUp size={14} className="text-yellow-500 mr-2" />
          <span className="text-yellow-500 font-medium mr-3">Top Gainers</span>
          <div className="text-[10px] space-x-2">
            <span>24H Vol (INR): <span className="text-white">₹357.35</span></span>
            <span className="ml-2">24H Vol (BTC): <span className="text-white">1.194</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinListPanel;