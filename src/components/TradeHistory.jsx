import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

// ── Mock data (replace with real API) ─────────────────────────────────────────
const MOCK_TRADES = [
  { id: 1, pair: 'LIGHT/INR', exchange: 'CoinSwitchX', type: 'Limit', side: 'Buy', quantity: 8.93, orderValue: 199.94, limitPrice: 22.30, status: 'Fulfilled', filledQty: 8.93, lockedAmount: 199.94, createdAt: '2026-02-18T11:28:37' },
  { id: 2, pair: 'OM/INR', exchange: 'CoinSwitchX', type: 'Limit', side: 'Buy', quantity: 33.2, orderValue: 185.32, limitPrice: 5.56, status: 'Fulfilled', filledQty: 33.2, lockedAmount: 0, createdAt: '2026-02-18T11:34:24' },
  { id: 3, pair: 'LIGHT/INR', exchange: 'CoinSwitchX', type: 'Limit', side: 'Buy', quantity: 8.94, orderValue: 0, limitPrice: null, status: 'Cancelled', filledQty: 0, lockedAmount: 0, createdAt: '2026-02-18T11:25:16' },
  { id: 4, pair: 'USDT/INR', exchange: 'CoinSwitchX', type: 'Limit', side: 'Sell', quantity: 5, orderValue: 467.39, limitPrice: 94.80, status: 'Fulfilled', filledQty: 5, lockedAmount: 0, createdAt: '2026-02-16T13:52:45' },
  { id: 5, pair: 'USDT/INR', exchange: 'CoinSwitchX', type: 'Limit', side: 'Buy', quantity: 5, orderValue: 475.49, limitPrice: 94.72, status: 'Fulfilled', filledQty: 5, lockedAmount: 0, createdAt: '2026-02-16T13:20:37' },
  { id: 6, pair: 'OM/INR', exchange: 'CoinSwitchX', type: 'Limit', side: 'Buy', quantity: 30, orderValue: 0, limitPrice: null, status: 'Cancelled', filledQty: 0, lockedAmount: 0, createdAt: '2026-02-15T12:09:33' },
];

// ── Coin icon ─────────────────────────────────────────────────────────────────
const getCoinIcon = (pair) => {
  const base = pair.split('/')[0].toLowerCase();
  return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/${base}.png`;
};

const CoinIcon = ({ pair }) => {
  const [err, setErr] = useState(false);
  const base = pair.split('/')[0];
  
  if (!err) {
    return (
      <img
        src={getCoinIcon(pair)}
        alt={base}
        onError={() => setErr(true)}
        style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0 }}
      />
    );
  }
  
  const hash = base.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const colors = ['#f97316', '#3b82f6', '#a855f7', '#22c55e', '#eab308', '#ec4899'];
  const bg = colors[hash % colors.length];
  
  return (
    <div style={{
      width: 24, height: 24, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 800, color: '#fff', flexShrink: 0,
    }}>
      {base.slice(0, 2)}
    </div>
  );
};

// ── Format helpers ────────────────────────────────────────────────────────────
const fmt = (n) => n ? `₹${Number(n).toFixed(2)}` : '--';
const fmtDate = (d) => new Date(d).toLocaleString('en-IN', { 
  day: '2-digit', month: 'short', year: 'numeric', 
  hour: '2-digit', minute: '2-digit', hour12: true 
});

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const colors = {
    Fulfilled: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.25)' },
    Cancelled: { bg: 'rgba(107,114,128,0.1)', text: '#6b7280', border: 'rgba(107,114,128,0.25)' },
    Partial: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  };
  const c = colors[status] || colors.Cancelled;
  
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700,
      display: 'inline-block', letterSpacing: '0.3px',
    }}>
      {status}
    </span>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const TradeHistory = ({ searchQuery = '', dateFilter = null }) => {
  const [trades, setTrades] = useState(MOCK_TRADES);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filter
  const filtered = useMemo(() => {
    let data = [...trades];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(t => t.pair.toLowerCase().includes(q) || t.exchange.toLowerCase().includes(q));
    }
    if (dateFilter) {
      data = data.filter(t => new Date(t.createdAt).toDateString() === dateFilter.toDateString());
    }
    return data;
  }, [trades, searchQuery, dateFilter]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  // Group by date
  const grouped = useMemo(() => {
    const map = {};
    paginated.forEach(t => {
      const date = new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      if (!map[date]) map[date] = [];
      map[date].push(t);
    });
    return map;
  }, [paginated]);

  return (
    <div style={{
      fontFamily: "'DM Mono','JetBrains Mono',monospace",
      color: '#e5e7eb',
    }}>
      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: '#0a0e13', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>PAIR</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>EXCHANGE</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>ORDER TYPE</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>BUY/SELL</th>
              <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>QUANTITY</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>STATUS</th>
              <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>ORDER VALUE</th>
              <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>LIMIT PRICE</th>
              <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>CREATED AT</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(grouped).length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#4b5563', fontSize: 13 }}>
                  No trade history found
                </td>
              </tr>
            ) : (
              Object.entries(grouped).map(([date, rows]) => (
                <React.Fragment key={date}>
                  {/* Date separator */}
                  <tr>
                    <td colSpan={10} style={{ 
                      padding: '12px 16px', background: '#060810', 
                      fontSize: 11, fontWeight: 600, color: '#6b7280',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      {date}
                    </td>
                  </tr>
                  {rows.map((trade, idx) => (
                    <tr
                      key={trade.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Pair */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CoinIcon pair={trade.pair} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb' }}>
                            {trade.pair.split('/')[0]}
                            <span style={{ color: '#4b5563', fontWeight: 400 }}>/{trade.pair.split('/')[1]}</span>
                          </span>
                        </div>
                      </td>
                      {/* Exchange */}
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af' }}>
                        {trade.exchange}
                      </td>
                      {/* Order Type */}
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af' }}>
                        {trade.type}
                      </td>
                      {/* Buy/Sell */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700,
                          background: trade.side === 'Buy' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: trade.side === 'Buy' ? '#22c55e' : '#ef4444',
                          border: trade.side === 'Buy' ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.25)',
                        }}>
                          {trade.side}
                        </span>
                      </td>
                      {/* Quantity */}
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'right', fontWeight: 600 }}>
                        {trade.filledQty > 0 ? `${trade.filledQty} / ${trade.quantity}` : trade.quantity}
                      </td>
                      {/* Status */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <StatusBadge status={trade.status} />
                      </td>
                      {/* Order Value */}
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'right', fontWeight: 600 }}>
                        {fmt(trade.orderValue)}
                      </td>
                      {/* Limit Price */}
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>
                        {trade.limitPrice ? fmt(trade.limitPrice) : '--'}
                      </td>
                      {/* Created At */}
                      <td style={{ padding: '12px 16px', fontSize: 11, color: '#6b7280', textAlign: 'right' }}>
                        {new Date(trade.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </td>
                      {/* Details icon */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: '#f59e0b', padding: 4,
                        }}>
                          <FileText size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12, padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)',
          marginTop: 8,
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              background: page === 1 ? 'transparent' : 'rgba(245,158,11,0.1)',
              border: `1px solid ${page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.25)'}`,
              color: page === 1 ? '#374151' : '#f59e0b',
              padding: '6px 12px', borderRadius: 6, cursor: page === 1 ? 'default' : 'pointer',
              fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <ChevronLeft size={14} /> Prev
          </button>
          
          <span style={{ fontSize: 12, color: '#6b7280' }}>
            Page <span style={{ color: '#f59e0b', fontWeight: 700 }}>{page}</span> of {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              background: page === totalPages ? 'transparent' : 'rgba(245,158,11,0.1)',
              border: `1px solid ${page === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.25)'}`,
              color: page === totalPages ? '#374151' : '#f59e0b',
              padding: '6px 12px', borderRadius: 6, cursor: page === totalPages ? 'default' : 'pointer',
              fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeHistory;