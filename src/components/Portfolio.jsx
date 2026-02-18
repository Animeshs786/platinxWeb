import React, { useState } from 'react';

// ── Mock data ─────────────────────────────────────────────────────────────────
const PORTFOLIO_STATS = {
  currentValue: 184.59,
  investedValue: 185.32,
  gainLoss: -0.73,
  gainLossPercent: -0.39,
};

const HOLDINGS = [
  { pair: 'OM/INR', availableBal: 33.2000000, lockedBal: 0, totalHolding: 33.2, investedValue: 185.31, currentValue: 184.59, gainLoss: -0.72, gainLossPercent: -0.39 },
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
    return <img src={getCoinIcon(pair)} alt={base} onError={() => setErr(true)} style={{ width: 24, height: 24, borderRadius: '50%' }} />;
  }
  const colors = ['#f97316', '#3b82f6', '#22c55e', '#eab308'];
  const bg = colors[base.charCodeAt(0) % colors.length];
  return <div style={{ width: 24, height: 24, borderRadius: '50%', background: bg, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>{base.slice(0,2)}</div>;
};

// ── Main Component ────────────────────────────────────────────────────────────
const Portfolio = () => {
  const { currentValue, investedValue, gainLoss, gainLossPercent } = PORTFOLIO_STATS;
  const isNegative = gainLoss < 0;

  return (
    <div style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace" }}>
      {/* Stats + Table Row */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        
        {/* Left Stats Card */}
        <div style={{
          width: 200,
          background: '#0b0e17',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10,
          padding: '20px',
          flexShrink: 0,
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Current Value</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#e5e7eb' }}>₹{currentValue.toFixed(2)}</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Invested Value</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#e5e7eb' }}>₹{investedValue.toFixed(2)}</div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Gain/Loss</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: isNegative ? '#ef4444' : '#22c55e', display: 'flex', alignItems: 'baseline', gap: 4 }}>
              {isNegative ? '▼' : '▲'} ₹{Math.abs(gainLoss).toFixed(2)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: isNegative ? '#ef4444' : '#22c55e', marginTop: 4 }}>
              {isNegative ? '▼' : '▲'} {Math.abs(gainLossPercent)}%
            </div>
          </div>
        </div>

        {/* Right Table */}
        <div style={{ flex: 1, background: '#0b0e17', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#080b12', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Pair</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Available Bal.</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Locked Bal.</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Total Holding</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Invested Value</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Current Value</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Gain/Loss</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Gain/Loss %</th>
              </tr>
            </thead>
            <tbody>
              {HOLDINGS.map((h, i) => {
                const neg = h.gainLoss < 0;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CoinIcon pair={h.pair} />
                        <span style={{ fontSize: 13, color: '#e5e7eb', fontWeight: 600 }}>{h.pair}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'center', fontWeight: 600 }}>{h.availableBal}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'center', fontWeight: 600 }}>{h.lockedBal}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'center', fontWeight: 600 }}>{h.totalHolding}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'center', fontWeight: 600 }}>₹{h.investedValue.toFixed(2)}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'center', fontWeight: 600 }}>₹{h.currentValue.toFixed(2)}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12, textAlign: 'center', fontWeight: 700, color: neg ? '#ef4444' : '#22c55e' }}>
                      ₹{h.gainLoss.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, textAlign: 'center', fontWeight: 700, color: neg ? '#ef4444' : '#22c55e' }}>
                      {h.gainLossPercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;