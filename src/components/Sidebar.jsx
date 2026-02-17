// import React, { useState } from 'react';
// import { BarChart3, Menu, Wallet, ChevronRight } from 'lucide-react';

// const Sidebar = ({ onShowPanel }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const sidebarItems = [
//     { icon: <ChevronRight size={20} />, color: 'text-gray-400', label: 'Toggle Panel', isToggle: true },
//     { divider: true },
//     { icon: '₿', color: 'text-white', label: 'BTC', bgColor: 'bg-orange-500' },
//     { icon: 'Ξ', color: 'text-white', label: 'ETH', bgColor: 'bg-blue-600' },
//     { icon: '◎', color: 'text-white', label: 'SOL', bgColor: 'bg-purple-600' },
//     { icon: 'X', color: 'text-white', label: 'XRP', bgColor: 'bg-gray-700' },
//     { icon: 'Ð', color: 'text-white', label: 'DOGE', bgColor: 'bg-yellow-600' },
//     { icon: '🐕', color: 'text-white', label: 'SHIB', bgColor: 'bg-orange-600' },
//     { divider: true },
//     { icon: <BarChart3 size={18} />, color: 'text-gray-400', label: 'Charts' },
//     { icon: <Menu size={18} />, color: 'text-gray-400', label: 'Menu' },
//     { icon: <Wallet size={18} />, color: 'text-gray-400', label: 'Wallet' },
//   ];

//   return (
//     <div
//       className={`bg-[#0a0e13] border-r border-gray-800 transition-all duration-300 flex flex-col h-full ${
//         isExpanded ? 'w-16' : 'w-14'
//       }`}
//       onMouseEnter={() => {
//         setIsExpanded(true);
//         onShowPanel(true);
//       }}
//       onMouseLeave={() => setIsExpanded(false)}
//     >
//       {/* Icon List */}
//       <div className="flex-1 overflow-y-auto py-4 space-y-2">
//         {sidebarItems.map((item, index) => {
//           if (item.divider) {
//             return (
//               <div key={index} className="px-3 py-1">
//                 <div className="border-t border-gray-700"></div>
//               </div>
//             );
//           }

//           if (item.isToggle) {
//             return (
//               <button
//                 key={index}
//                 onClick={() => onShowPanel(true)}
//                 className="w-full h-12 flex items-center justify-center hover:bg-gray-800 transition-colors group relative"
//                 title={item.label}
//               >
//                 <span className={item.color}>{item.icon}</span>
                
//                 {/* Tooltip */}
//                 {isExpanded && (
//                   <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
//                     {item.label}
//                   </div>
//                 )}
//               </button>
//             );
//           }

//           return (
//             <button
//               key={index}
//               className="w-full h-12 flex items-center justify-center hover:bg-gray-800 transition-colors group relative"
//               title={item.label}
//             >
//               {item.bgColor ? (
//                 <div className={`w-8 h-8 ${item.bgColor} rounded-full flex items-center justify-center shadow-md`}>
//                   <span className="text-white text-sm font-bold">{item.icon}</span>
//                 </div>
//               ) : (
//                 <span className={item.color}>{item.icon}</span>
//               )}
              
//               {/* Tooltip */}
//               {isExpanded && (
//                 <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
//                   {item.label}
//                 </div>
//               )}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;





import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BarChart3, Wallet, ListFilter, RefreshCw, ChevronRight } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/coinswitch/spot/ticker/all';
const TOP_N   = 15;

// ── Crypto icon (same helper as CoinListPanel) ───────────────────────────────
const getCoinIconUrl = (symbol) => {
  const base = symbol.split('/')[0].toLowerCase();
  return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${base}.png`;
};

const colorFor = (sym) => {
  const palette = [
    '#f97316','#3b82f6','#a855f7','#22c55e',
    '#eab308','#ec4899','#06b6d4','#ef4444',
    '#8b5cf6','#14b8a6','#f59e0b','#6366f1',
  ];
  let h = 0;
  for (let i = 0; i < sym.length; i++) h = sym.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
};

// ── Coin Avatar ──────────────────────────────────────────────────────────────
const CoinAvatar = ({ symbol, size = 32, selected = false }) => {
  const [err, setErr] = useState(false);
  const base = symbol.split('/')[0];

  const ring = selected
    ? '0 0 0 2px #f59e0b, 0 0 10px rgba(245,158,11,0.35)'
    : '0 2px 8px rgba(0,0,0,0.45)';

  if (!err) {
    return (
      <img
        src={getCoinIconUrl(symbol)}
        alt={base}
        onError={() => setErr(true)}
        style={{
          width: size, height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          boxShadow: ring,
          transition: 'box-shadow 0.2s',
          flexShrink: 0,
          border: selected ? '2px solid #f59e0b' : '1.5px solid rgba(255,255,255,0.07)',
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: colorFor(base),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontWeight: 800, color: '#fff',
      boxShadow: ring,
      transition: 'box-shadow 0.2s',
      flexShrink: 0,
      border: selected ? '2px solid #f59e0b' : '1.5px solid rgba(255,255,255,0.07)',
      letterSpacing: '-0.5px',
      fontFamily: "'DM Mono', 'JetBrains Mono', monospace",
    }}>
      {base.slice(0, 3)}
    </div>
  );
};

// ── Tooltip ──────────────────────────────────────────────────────────────────
const Tooltip = ({ children, label, subLabel, color }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: 'relative', display: 'flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute',
          left: 'calc(100% + 10px)',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#0f1520',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 7,
          padding: '6px 10px',
          pointerEvents: 'none',
          zIndex: 999,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          minWidth: 100,
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute', left: -5, top: '50%',
            transform: 'translateY(-50%) rotate(45deg)',
            width: 8, height: 8,
            background: '#0f1520',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRight: 'none', borderTop: 'none',
          }} />
          <div style={{ fontSize: 12, fontWeight: 700, color: '#e5e7eb', fontFamily: "'DM Mono', monospace" }}>
            {label}
          </div>
          {subLabel && (
            <div style={{ fontSize: 11, marginTop: 2, color, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>
              {subLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ padding: '4px 12px' }}>
    <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }} />
  </div>
);

// ── Format helpers ───────────────────────────────────────────────────────────
const fmtPct = (n) => {
  const v = Number(n);
  if (isNaN(v)) return null;
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
};

const pctColor = (n) => Number(n) >= 0 ? '#22c55e' : '#ef4444';

// ── Main Sidebar ─────────────────────────────────────────────────────────────
const Sidebar = ({ onShowPanel, onSelectCoin, selectedCoin = 'BTC/INR' }) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [topCoins, setTopCoins]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const timerRef = useRef(null);

  // ── Fetch top coins by volume ────────────────────────────────────────────
  const fetchTop = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res  = await fetch(API_URL);
      const json = await res.json();
      if (json.success && json.data?.data) {
        const arr = Object.values(json.data.data)
          .filter((c) => c.symbol?.endsWith('/INR') && Number(c.lastPrice) > 0)
          .sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
          .slice(0, TOP_N);
        setTopCoins(arr);
      }
    } catch (e) {
      console.error('Sidebar fetch err:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTop();
    timerRef.current = setInterval(() => fetchTop(true), 30000);
    return () => clearInterval(timerRef.current);
  }, [fetchTop]);

  const handlePanelToggle = (val) => {
    setPanelOpen(val);
    onShowPanel?.(val);
  };

  return (
    <div style={{
      width: 52,
      background: '#060810',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 8,
      gap: 0,
      boxShadow: '2px 0 16px rgba(0,0,0,0.4)',
      fontFamily: "'DM Mono','JetBrains Mono',monospace",
      userSelect: 'none',
      zIndex: 100,
      position: 'relative',
    }}>

      {/* ── Top: Panel toggle ── */}
      <Tooltip label={panelOpen ? 'Close Panel' : 'Open Panel'}>
        <button
          onClick={() => handlePanelToggle(!panelOpen)}
          onMouseEnter={() => handlePanelToggle(true)}
          style={{
            width: 36, height: 36,
            borderRadius: 8,
            background: panelOpen ? 'rgba(245,158,11,0.12)' : 'transparent',
            border: panelOpen ? '1px solid rgba(245,158,11,0.3)' : '1px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            marginBottom: 6,
            transition: 'all 0.15s',
          }}
        >
          <ChevronRight
            size={16}
            color={panelOpen ? '#f59e0b' : '#374151'}
            style={{
              transition: 'transform 0.2s',
              transform: panelOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>
      </Tooltip>

      <Divider />

      {/* ── Top coins list ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        paddingTop: 6,
        paddingBottom: 6,
        width: '100%',
        scrollbarWidth: 'none',
      }}>
        <style>{`
          .sb-coin:hover .sb-coin-inner {
            background: rgba(255,255,255,0.04) !important;
          }
          @keyframes sb-spin { to { transform: rotate(360deg); } }
          @keyframes sb-pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        `}</style>

        {loading && topCoins.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              animation: 'sb-pulse 1.5s ease infinite',
              animationDelay: `${i * 0.1}s`,
              marginBottom: 2,
            }} />
          ))
        ) : (
          topCoins.map((coin) => {
            const isSelected = coin.symbol === selectedCoin;
            const pct = fmtPct(coin.percentageChange);
            const clr = pctColor(coin.percentageChange);

            return (
              <Tooltip
                key={coin.symbol}
                label={coin.symbol}
                subLabel={pct}
                color={clr}
              >
                <button
                  className="sb-coin"
                  onClick={() => onSelectCoin?.(coin)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '3px 0',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Active indicator */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      left: 0, top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3, height: 20,
                      background: '#f59e0b',
                      borderRadius: '0 2px 2px 0',
                      boxShadow: '0 0 6px rgba(245,158,11,0.5)',
                    }} />
                  )}

                  <div
                    className="sb-coin-inner"
                    style={{
                      width: 36, height: 36,
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isSelected ? 'rgba(245,158,11,0.08)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    <CoinAvatar symbol={coin.symbol} size={22} selected={isSelected} />
                  </div>


                </button>
              </Tooltip>
            );
          })
        )}
      </div>

     
    </div>
  );
};

export default Sidebar;