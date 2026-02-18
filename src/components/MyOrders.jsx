import React, { useState, useMemo } from 'react';

// ── Mock data ─────────────────────────────────────────────────────────────────
const ALL_ORDERS = [
  { id: 1, pair: 'OM/INR', side: 'Buy', type: 'Limit', exchange: 'CoinSwitchX', quantity: 33.200000, amount: 199.20, limitPrice: 6.00000000, lastPrice: 3.56, status: 'Filled', progress: '100%', createdAt: '11:34:24' },
  { id: 2, pair: 'LIGHT/INR', side: 'Buy', type: 'Limit', exchange: 'CoinSwitchX', quantity: 8.9300000, amount: 199.14, limitPrice: 22.30000000, lastPrice: 22.28, status: 'Open', progress: '0%', createdAt: '11:28:37' },
  { id: 3, pair: 'LIGHT/INR', side: 'Buy', type: 'Limit', exchange: 'CoinSwitchX', quantity: 8.9400000, amount: 199.18, limitPrice: 22.28000000, lastPrice: 22.28, status: 'Cancelled', progress: '--', createdAt: '11:25:16' },
  { id: 4, pair: 'USDT/INR', side: 'Sell', type: 'Limit', exchange: 'CoinSwitchX', quantity: 5.0000000, amount: 474.00, limitPrice: 94.80000000, lastPrice: 94.36, status: 'Filled', progress: '100%', createdAt: '13:52:45' },
  { id: 5, pair: 'USDT/INR', side: 'Buy', type: 'Limit', exchange: 'CoinSwitchX', quantity: 5.0000000, amount: 473.95, limitPrice: 94.79000000, lastPrice: 94.36, status: 'Filled', progress: '100%', createdAt: '13:20:37' },
  { id: 6, pair: 'OM/INR', side: 'Buy', type: 'Limit', exchange: 'CoinSwitchX', quantity: 30.000000, amount: 150.00, limitPrice: 5.00000000, lastPrice: 5.56, status: 'Open', progress: '0.00%', createdAt: '13:28:24' },
  { id: 7, pair: 'OM/INR', side: 'Buy', type: 'Limit', exchange: 'CoinSwitchX', quantity: 30.000000, amount: 150.00, limitPrice: 5.00000000, lastPrice: 5.56, status: 'Cancelled', progress: '--', createdAt: '12:09:33' },
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
    return <img src={getCoinIcon(pair)} alt={base} onError={() => setErr(true)} style={{ width: 20, height: 20, borderRadius: '50%' }} />;
  }
  const colors = ['#f97316', '#3b82f6', '#22c55e', '#eab308'];
  const bg = colors[base.charCodeAt(0) % colors.length];
  return <div style={{ width: 20, height: 20, borderRadius: '50%', background: bg, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>{base.slice(0,2)}</div>;
};

// ── Main Component ────────────────────────────────────────────────────────────
const MyOrders = () => {
  const [btcOnly, setBtcOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = useMemo(() => {
    let data = [...ALL_ORDERS];
    if (btcOnly) data = data.filter(o => o.pair.startsWith('BTC'));
    if (openOnly) data = data.filter(o => o.status === 'Open');
    return data;
  }, [btcOnly, openOnly]);

  const handleClose = (id) => {
    console.log('Close order:', id);
  };

  return (
    <div style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace" }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center', justifyContent: 'flex-end' }}>
        {/* BTC Only */}
        {/* <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#9ca3af' }}>
          <span>BTC Orders Only</span>
          <div onClick={() => setBtcOnly(!btcOnly)} style={{
            width: 40, height: 22, borderRadius: 12, background: btcOnly ? '#22c55e' : '#374151',
            position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 2, left: btcOnly ? 20 : 2, transition: 'left 0.2s',
            }} />
          </div>
        </label> */}

        {/* Open Only */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#9ca3af' }}>
          <span>Open Orders Only</span>
          <div onClick={() => setOpenOnly(!openOnly)} style={{
            width: 40, height: 22, borderRadius: 12, background: openOnly ? '#f59e0b' : '#374151',
            position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 2, left: openOnly ? 20 : 2, transition: 'left 0.2s',
            }} />
          </div>
        </label>
      </div>

      {/* Table */}
      <div style={{ background: '#0b0e17', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#080b12', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Pair</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Buy/Sell</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Order Type</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Exchange</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Quantity</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Amount</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Limit Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Last Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Progress</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Created at</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={12} style={{ padding: '40px', textAlign: 'center', color: '#4b5563', fontSize: 13 }}>No orders found</td></tr>
            ) : (
              filtered.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CoinIcon pair={order.pair} />
                      <span style={{ fontSize: 13, color: '#e5e7eb', fontWeight: 600 }}>{order.pair}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: order.side === 'Buy' ? '#22c55e' : '#ef4444',
                    }}>{order.side}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af' }}>{order.type}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af' }}>{order.exchange}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'right', fontWeight: 600 }}>{order.quantity}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'right', fontWeight: 600 }}>₹{order.amount.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>₹{order.limitPrice}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>₹{order.lastPrice}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: order.status === 'Filled' ? '#22c55e' : order.status === 'Open' ? '#3b82f6' : '#6b7280' }}>
                    {order.status}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'center', fontWeight: 600 }}>{order.progress}</td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: '#6b7280', textAlign: 'right' }}>{order.createdAt}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {order.status === 'Open' && (
                      <button onClick={() => handleClose(order.id)} style={{
                        background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer',
                        fontSize: 11, fontWeight: 600, textDecoration: 'underline',
                      }}>Close</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;