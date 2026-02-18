import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import MyOrders from '../components/MyOrders';
import Portfolio from '../components/Portfolio';

const OrdersPortfolioPage = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'portfolio'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060810',
      fontFamily: "'DM Mono','JetBrains Mono',monospace",
      padding: '24px 32px',
    }}>
      {/* Header with Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        {/* MY ORDERS Tab */}
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '8px 18px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'orders'
              ? 'linear-gradient(135deg, #d4a574, #b8935f)'
              : 'transparent',
            color: activeTab === 'orders' ? '#000' : '#6b7280',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.3px',
            outline: activeTab === 'orders' ? 'none' : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.15s',
          }}
        >
          MY ORDERS
        </button>

        {/* PORTFOLIO Tab */}
        <button
          onClick={() => setActiveTab('portfolio')}
          style={{
            padding: '8px 18px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'portfolio'
              ? 'linear-gradient(135deg, #d4a574, #b8935f)'
              : 'transparent',
            color: activeTab === 'portfolio' ? '#000' : '#6b7280',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.3px',
            outline: activeTab === 'portfolio' ? 'none' : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.15s',
          }}
        >
          PORTFOLIO
          {activeTab === 'portfolio' && (
            <span style={{ marginLeft: 6, color: '#000', opacity: 0.7 }}></span>
          )}
        </button>

        {/* Actions (right side) */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          {activeTab === 'portfolio' && (
            <button style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: '#6b7280',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}>
              <RefreshCw size={14} /> Refresh
            </button>
          )}
          
          <button style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent',
            color: '#6b7280',
            fontSize: 12,
            cursor: 'pointer',
          }}>
            View All Orders →
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'orders' && <MyOrders />}
        {activeTab === 'portfolio' && <Portfolio />}
      </div>
    </div>
  );
};

export default OrdersPortfolioPage;