// import React, { useState } from 'react';
// import { Search, Star, TrendingUp } from 'lucide-react';

// const CoinListPanel = ({ isOpen, onMouseEnter, onMouseLeave }) => {
//   const [activeTab, setActiveTab] = useState('ALL');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [favorites, setFavorites] = useState(['BTC/INR', 'XRP/INR', 'ETH/INR', 'SHIB/INR']);

//   const allCoins = [
//     { id: 1, pair: 'USDT/INR', exchange: 'CoinSwitchX', price: '₹94.20', change: '-0.47%', volume: '3.59 Cr', isNegative: true, icon: '₮', color: 'bg-green-600' },
//     { id: 2, pair: 'BTC/INR', exchange: 'CoinSwitchX', price: '₹67,07,000', change: '+0.42%', volume: '79.66 Lac', isNegative: false, icon: '₿', color: 'bg-orange-500' },
//     { id: 3, pair: 'DOGE/INR', exchange: 'CoinSwitchX', price: '₹10.8829', change: '+17.97%', volume: '51.57 Lac', isNegative: false, icon: 'Ð', color: 'bg-yellow-600' },
//     { id: 4, pair: 'XRP/INR', exchange: 'CoinSwitchX', price: '₹153.64', change: '+11.14%', volume: '44.97 Lac', isNegative: false, icon: 'X', color: 'bg-gray-700' },
//     { id: 5, pair: 'ETH/INR', exchange: 'CoinSwitchX', price: '₹1,95,535', change: '-1.69%', volume: '44.14 Lac', isNegative: true, icon: 'Ξ', color: 'bg-blue-600' },
//     { id: 6, pair: 'PEPE/INR', exchange: 'CoinSwitchX', price: '₹0.0004556', change: '+24.00%', volume: '33.90 Lac', isNegative: false, icon: '🐸', color: 'bg-green-700' },
//     { id: 7, pair: 'SOL/INR', exchange: 'CoinSwitchX', price: '₹8,516.62', change: '+3.32%', volume: '28.74 Lac', isNegative: false, icon: '◎', color: 'bg-purple-600' },
//     { id: 8, pair: 'SHIB/INR', exchange: 'CoinSwitchX', price: '₹0.000657', change: '+6.82%', volume: '15.82 Lac', isNegative: false, icon: '🐕', color: 'bg-orange-600' },
//     { id: 9, pair: 'GALA/INR', exchange: 'CoinSwitchX', price: '₹0.4020', change: '+0.34%', volume: '13.52 Lac', isNegative: false, icon: '⬡', color: 'bg-gray-600' },
//     { id: 10, pair: 'EUR/INR', exchange: 'CoinSwitchX', price: '₹89.50', change: '+2.15%', volume: '12.33 Lac', isNegative: false, icon: '€', color: 'bg-blue-700' },
//   ];

//   const innovationCoins = allCoins.filter(coin => ['PEPE/INR', 'SHIB/INR', 'DOGE/INR'].includes(coin.pair));

//   const toggleFavorite = (pair) => {
//     setFavorites(prev => 
//       prev.includes(pair) ? prev.filter(p => p !== pair) : [...prev, pair]
//     );
//   };

//   const getDisplayCoins = () => {
//     let coins;
//     if (activeTab === 'FAVORITES') {
//       coins = allCoins.filter(coin => favorites.includes(coin.pair));
//     } else if (activeTab === 'ALL') {
//       coins = allCoins;
//     } else if (activeTab === 'INNOVATION ZONE') {
//       coins = innovationCoins;
//     }
    
//     if (searchQuery) {
//       coins = coins.filter(coin => 
//         coin.pair.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     return coins;
//   };

//   if (!isOpen) return null;

//   return (
//     <div 
//       className="w-[400px] bg-[#0f1419] border-r border-gray-800 flex flex-col h-full shadow-2xl"
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//     >
//       {/* Header with Search */}
//       <div className="p-4 border-b border-gray-800">
//         <div className="flex items-center space-x-2 bg-[#1a2332] rounded-lg px-3 py-2.5">
//           <Search size={18} className="text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search coins"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
//           />
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex items-center space-x-4 px-4 py-3 border-b border-gray-800">
//         <button
//           onClick={() => setActiveTab('FAVORITES')}
//           className={`pb-2 text-sm font-medium transition-colors relative ${
//             activeTab === 'FAVORITES' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <Star size={16} fill={activeTab === 'FAVORITES' ? 'currentColor' : 'none'} />
//           {activeTab === 'FAVORITES' && (
//             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
//           )}
//         </button>
//         <button
//           onClick={() => setActiveTab('ALL')}
//           className={`pb-2 text-sm font-medium transition-colors relative ${
//             activeTab === 'ALL' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <span>ALL</span>
//           {activeTab === 'ALL' && (
//             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
//           )}
//         </button>
//         <button
//           onClick={() => setActiveTab('INNOVATION ZONE')}
//           className={`pb-2 text-sm font-medium transition-colors relative ${
//             activeTab === 'INNOVATION ZONE' ? 'text-yellow-500' : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           <span>INNOVATION ZONE</span>
//           {activeTab === 'INNOVATION ZONE' && (
//             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
//           )}
//         </button>
//       </div>

//       {/* Column Headers */}
//       <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-3 text-xs text-gray-400 border-b border-gray-800 bg-[#0a0e13]">
//         <div className="flex items-center">
//           <div className="w-6"></div>
//           <span>Pair</span>
//         </div>
//         <div className="text-right">Price</div>
//         <div className="text-right">Change</div>
//         <div className="text-right">Vol</div>
//       </div>

//       {/* Coin List */}
//       <div className="flex-1 overflow-y-auto">
//         {getDisplayCoins().map((coin) => (
//           <div
//             key={coin.id}
//             className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-4 hover:bg-[#1a2332] transition-colors cursor-pointer border-b border-gray-800"
//           >
//             {/* Star + Coin Info */}
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => toggleFavorite(coin.pair)}
//                 className="flex-shrink-0"
//               >
//                 <Star
//                   size={16}
//                   className={favorites.includes(coin.pair) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
//                 />
//               </button>

//               <div className={`w-7 h-7 ${coin.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
//                 {coin.icon}
//               </div>

//               <div className="min-w-0">
//                 <div className="text-white text-sm font-medium truncate">{coin.pair}</div>
//                 <div className="text-gray-500 text-xs truncate">{coin.exchange}</div>
//               </div>
//             </div>

//             {/* Price */}
//             <div className="text-right text-white text-sm font-medium truncate">
//               {coin.price}
//             </div>

//             {/* Change */}
//             <div className={`text-right text-sm font-medium truncate ${
//               coin.isNegative ? 'text-red-500' : 'text-green-500'
//             }`}>
//               {coin.change}
//             </div>

//             {/* Volume */}
//             <div className="text-right text-gray-400 text-xs truncate">
//               {coin.volume}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Bottom Info Bar */}
//       <div className="border-t border-gray-800 px-4 py-3 bg-[#0a0e13]">
//         <div className="flex items-center text-xs text-gray-400">
//           <TrendingUp size={14} className="text-yellow-500 mr-2" />
//           <span className="text-yellow-500 font-medium mr-3">Top Gainers</span>
//           <div className="text-[10px] space-x-2">
//             <span>24H Vol (INR): <span className="text-white">₹357.35</span></span>
//             <span className="ml-2">24H Vol (BTC): <span className="text-white">1.194</span></span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoinListPanel;





import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Star, TrendingUp, TrendingDown, RefreshCw, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/coinswitch/spot/ticker/all';
const PAGE_SIZE = 50;

// ── Crypto icon helper ───────────────────────────────────────────────────────
// Primary: jsdelivr cryptocurrency-icons (free, 400+ coins)
const getCoinIcon = (symbol) => {
  const base = symbol.split('/')[0].toLowerCase();
  return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${base}.png`;
};

// Fallback avatar with color based on symbol
const colorFor = (sym) => {
  const colors = [
    '#f97316','#3b82f6','#a855f7','#22c55e',
    '#eab308','#ec4899','#06b6d4','#ef4444',
    '#8b5cf6','#14b8a6','#f59e0b','#6366f1',
  ];
  let hash = 0;
  for (let i = 0; i < sym.length; i++) hash = sym.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const CoinAvatar = ({ symbol }) => {
  const [imgError, setImgError] = useState(false);
  const base = symbol.split('/')[0];

  if (!imgError) {
    return (
      <img
        src={getCoinIcon(symbol)}
        alt={base}
        onError={() => setImgError(true)}
        style={{
          width: 28, height: 28, borderRadius: '50%',
          objectFit: 'cover', flexShrink: 0,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      />
    );
  }

  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      background: colorFor(base),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0,
      border: '1px solid rgba(255,255,255,0.12)',
      letterSpacing: '-0.5px',
    }}>
      {base.slice(0, 3)}
    </div>
  );
};

// ── Format helpers ───────────────────────────────────────────────────────────
const fmtPrice = (n) => {
  const num = Number(n);
  if (num === 0) return '—';
  if (num >= 1000) return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  if (num >= 1)    return `₹${num.toFixed(4)}`;
  return `₹${num.toPrecision(4)}`;
};

const fmtVol = (n) => {
  const num = Number(n);
  if (num >= 1e7)  return `${(num / 1e7).toFixed(2)} Cr`;
  if (num >= 1e5)  return `${(num / 1e5).toFixed(2)} Lac`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(2);
};

const fmtChange = (n) => {
  const num = Number(n);
  if (isNaN(num)) return '0.00%';
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};

// ── Innovation Zone coins ────────────────────────────────────────────────────
const INNOVATION_ZONE = ['PEPE', 'SHIB', 'DOGE', 'BONK', 'WIF', 'FLOKI', 'MEME', 'GALA', '1000CHEEMS', '1MBABYDOGE'];

// ── Sort icon ────────────────────────────────────────────────────────────────
const SortIcon = ({ field, sortConfig }) => {
  if (sortConfig.field !== field) return <ChevronsUpDown size={11} style={{ opacity: 0.3 }} />;
  return sortConfig.dir === 'desc'
    ? <ChevronDown size={11} style={{ color: '#f59e0b' }} />
    : <ChevronUp size={11} style={{ color: '#f59e0b' }} />;
};

// ── Main Component ───────────────────────────────────────────────────────────
const CoinListPanel = ({ isOpen, onMouseEnter, onMouseLeave, onSelectCoin }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cs_favorites') || '["BTC/INR","ETH/INR","XRP/INR","SOL/INR"]'); }
    catch { return ['BTC/INR', 'ETH/INR', 'XRP/INR', 'SOL/INR']; }
  });
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ field: 'quoteVolume', dir: 'desc' });
  const [selectedPair, setSelectedPair] = useState('BTC/INR');
  const listRef = useRef(null);

  // ── Fetch all tickers ──────────────────────────────────────────────────────
  const fetchTickers = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.success && json.data?.data) {
        const raw = json.data.data;
        const arr = Object.values(raw)
          .filter((c) => c.symbol && c.symbol.endsWith('/INR') && Number(c.lastPrice) > 0)
          .map((c) => ({
            symbol:           c.symbol,
            lastPrice:        c.lastPrice,
            percentageChange: c.percentageChange,
            quoteVolume:      c.quoteVolume,
            baseVolume:       c.baseVolume,
            highPrice:        c.highPrice,
            lowPrice:         c.lowPrice,
            exchange:         c.exchange || 'coinswitchx',
          }));
        setCoins(arr);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickers();
    const t = setInterval(() => fetchTickers(true), 30000);
    return () => clearInterval(t);
  }, [fetchTickers]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('cs_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Reset page on tab/search/sort change
  useEffect(() => { setPage(1); if (listRef.current) listRef.current.scrollTop = 0; },
    [activeTab, searchQuery, sortConfig]);

  // ── Toggle favorite ────────────────────────────────────────────────────────
  const toggleFavorite = useCallback((e, pair) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(pair) ? prev.filter((p) => p !== pair) : [...prev, pair]
    );
  }, []);

  // ── Sort handler ───────────────────────────────────────────────────────────
  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      dir: prev.field === field && prev.dir === 'desc' ? 'asc' : 'desc',
    }));
  };

  // ── Filtered + sorted coins ────────────────────────────────────────────────
  const displayCoins = useMemo(() => {
    let list = [...coins];

    if (activeTab === 'FAVORITES') {
      list = list.filter((c) => favorites.includes(c.symbol));
    } else if (activeTab === 'INNOVATION') {
      list = list.filter((c) => INNOVATION_ZONE.includes(c.symbol.split('/')[0]));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.symbol.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const av = Number(a[sortConfig.field]) || 0;
      const bv = Number(b[sortConfig.field]) || 0;
      return sortConfig.dir === 'desc' ? bv - av : av - bv;
    });

    return list;
  }, [coins, activeTab, favorites, searchQuery, sortConfig]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(displayCoins.length / PAGE_SIZE);
  const pageCoins  = displayCoins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Stats for footer ───────────────────────────────────────────────────────
  const topGainer = useMemo(() =>
    [...coins].sort((a, b) => Number(b.percentageChange) - Number(a.percentageChange))[0],
    [coins]
  );

  if (!isOpen) return null;

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S = {
    panel: {
      width: 400,
      background: '#080b12',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: "'DM Mono', 'JetBrains Mono', monospace",
      boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
      userSelect: 'none',
    },
    searchWrap: {
      padding: '12px 12px 0',
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: '#0f1520',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8,
      padding: '8px 12px',
    },
    searchInput: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#fff',
      fontSize: 13,
      fontFamily: 'inherit',
    },
    tabs: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      padding: '10px 12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    tab: (active) => ({
      padding: '6px 10px 8px',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.5px',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      color: active ? '#f59e0b' : '#4b5563',
      borderBottom: active ? '2px solid #f59e0b' : '2px solid transparent',
      transition: 'all 0.15s',
      fontFamily: 'inherit',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    }),
    colHead: {
      display: 'grid',
      gridTemplateColumns: '28px 1fr 90px 72px 72px',
      padding: '7px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: '#060810',
    },
    colBtn: (field) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 10,
      fontWeight: 600,
      color: sortConfig.field === field ? '#f59e0b' : '#374151',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      padding: 0,
      fontFamily: 'inherit',
      letterSpacing: '0.3px',
      justifyContent: 'flex-end',
    }),
    row: (selected) => ({
      display: 'grid',
      gridTemplateColumns: '28px 1fr 90px 72px 72px',
      padding: '8px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
      cursor: 'pointer',
      transition: 'background 0.12s',
      background: selected ? 'rgba(245,158,11,0.06)' : 'transparent',
      alignItems: 'center',
    }),
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      background: '#060810',
    },
    pgBtn: (disabled) => ({
      padding: '4px 10px',
      fontSize: 11,
      fontWeight: 600,
      background: disabled ? 'transparent' : 'rgba(245,158,11,0.1)',
      color: disabled ? '#2d3748' : '#f59e0b',
      border: `1px solid ${disabled ? 'rgba(255,255,255,0.04)' : 'rgba(245,158,11,0.25)'}`,
      borderRadius: 6,
      cursor: disabled ? 'default' : 'pointer',
      fontFamily: 'inherit',
    }),
    footer: {
      padding: '8px 12px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      background: '#060810',
    },
  };

  return (
    <div style={S.panel} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>

      {/* ── Search ── */}
      <div style={S.searchWrap}>
        <div style={S.searchBox}>
          <Search size={14} color="#4b5563" />
          <input
            style={S.searchInput}
            placeholder="Search coins…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            spellCheck={false}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: 0, fontSize: 16, lineHeight: 1 }}
            >×</button>
          )}
          {loading && (
            <RefreshCw size={13} color="#4b5563" style={{ animation: 'spin 1s linear infinite' }} />
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={S.tabs}>
        <button style={S.tab(activeTab === 'FAVORITES')} onClick={() => setActiveTab('FAVORITES')}>
          <Star size={13} fill={activeTab === 'FAVORITES' ? '#f59e0b' : 'none'} color={activeTab === 'FAVORITES' ? '#f59e0b' : '#4b5563'} />
        </button>
        <button style={S.tab(activeTab === 'ALL')} onClick={() => setActiveTab('ALL')}>ALL</button>
        <button style={S.tab(activeTab === 'INNOVATION')} onClick={() => setActiveTab('INNOVATION')}>
          🔥 ZONE
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 10, color: '#1f2937' }}>
          {lastUpdated && `${lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
        </div>
      </div>

      {/* ── Column Headers ── */}
      <div style={S.colHead}>
        <div />
        <div style={{ ...S.colBtn('symbol'), justifyContent: 'flex-start', color: '#374151' }}>
          PAIR
        </div>
        <button style={S.colBtn('lastPrice')} onClick={() => handleSort('lastPrice')}>
          PRICE <SortIcon field="lastPrice" sortConfig={sortConfig} />
        </button>
        <button style={S.colBtn('percentageChange')} onClick={() => handleSort('percentageChange')}>
          CHG% <SortIcon field="percentageChange" sortConfig={sortConfig} />
        </button>
        <button style={S.colBtn('quoteVolume')} onClick={() => handleSort('quoteVolume')}>
          VOL <SortIcon field="quoteVolume" sortConfig={sortConfig} />
        </button>
      </div>

      {/* ── Coin List ── */}
      <div
        ref={listRef}
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}
        className="cs-scrollbar"
      >
        <style>{`
          .cs-scrollbar::-webkit-scrollbar { width: 4px; }
          .cs-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .cs-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 4px; }
          .cs-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245,158,11,0.3); }
          @keyframes spin { to { transform: rotate(360deg); } }
          .coin-row:hover { background: rgba(255,255,255,0.03) !important; }
          .coin-row:hover .star-btn { opacity: 1 !important; }
        `}</style>

        {loading && coins.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#374151', fontSize: 13 }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: 10, color: '#f59e0b', display: 'block', margin: '0 auto 10px' }} />
            Loading market data…
          </div>
        ) : pageCoins.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#374151', fontSize: 13 }}>
            No pairs found
          </div>
        ) : (
          pageCoins.map((coin) => {
            const isSelected = coin.symbol === selectedPair;
            const isFav      = favorites.includes(coin.symbol);
            const pct        = Number(coin.percentageChange);
            const isUp       = pct >= 0;

            return (
              <div
                key={coin.symbol}
                className="coin-row"
                style={S.row(isSelected)}
                onClick={() => {
                  setSelectedPair(coin.symbol);
                  onSelectCoin?.(coin);
                }}
              >
                {/* Star */}
                <button
                  className="star-btn"
                  onClick={(e) => toggleFavorite(e, coin.symbol)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, display: 'flex', alignItems: 'center',
                    opacity: isFav ? 1 : 0.25,
                    transition: 'opacity 0.15s, transform 0.1s',
                  }}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    size={13}
                    fill={isFav ? '#f59e0b' : 'none'}
                    color={isFav ? '#f59e0b' : '#6b7280'}
                  />
                </button>

                {/* Pair info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <CoinAvatar symbol={coin.symbol} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      color: isSelected ? '#f59e0b' : '#e5e7eb',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.2px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {coin.symbol.split('/')[0]}
                      <span style={{ color: '#374151', fontWeight: 400 }}>/INR</span>
                    </div>
                    <div style={{ color: '#1f2937', fontSize: 10, marginTop: 1 }}>
                      CoinSwitchX
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div style={{
                  textAlign: 'right', fontSize: 12, fontWeight: 600,
                  color: isSelected ? '#f59e0b' : '#d1d5db',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {fmtPrice(coin.lastPrice)}
                </div>

                {/* Change */}
                <div style={{
                  textAlign: 'right', fontSize: 11, fontWeight: 700,
                  color: isUp ? '#22c55e' : '#ef4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2,
                }}>
                  {isUp
                    ? <TrendingUp size={10} />
                    : <TrendingDown size={10} />
                  }
                  {fmtChange(coin.percentageChange)}
                </div>

                {/* Volume */}
                <div style={{
                  textAlign: 'right', fontSize: 10,
                  color: '#374151',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {fmtVol(coin.quoteVolume)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={S.pagination}>
          <button
            style={S.pgBtn(page === 1)}
            disabled={page === 1}
            onClick={() => { setPage((p) => p - 1); listRef.current?.scrollTo(0, 0); }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: 11, color: '#374151' }}>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>{page}</span>
            {' / '}{totalPages}
            <span style={{ color: '#1f2937' }}> ({displayCoins.length} pairs)</span>
          </span>
          <button
            style={S.pgBtn(page === totalPages)}
            disabled={page === totalPages}
            onClick={() => { setPage((p) => p + 1); listRef.current?.scrollTo(0, 0); }}
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={S.footer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={13} color="#22c55e" />
          <span style={{ fontSize: 10, color: '#374151' }}>Top Gainer: </span>
          {topGainer && (
            <>
              <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>
                {topGainer.symbol}
              </span>
              <span style={{ fontSize: 11, color: '#22c55e' }}>
                +{Number(topGainer.percentageChange).toFixed(2)}%
              </span>
            </>
          )}
          <button
            onClick={() => fetchTickers()}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', padding: 2, color: '#374151',
              display: 'flex', alignItems: 'center',
            }}
            title="Refresh"
          >
            <RefreshCw size={12} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinListPanel;