
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import MyOrders from '../components/MyOrders';
import Portfolio from '../components/Portfolio';

const OrdersPortfolioPage = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'portfolio'
  const [openOnly, setOpenOnly] = useState(true);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060810',
      fontFamily: "'DM Mono','JetBrains Mono',monospace",
      padding: '10px 10px',
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
        </button>

        {/* Actions (right side) */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Refresh button - only on Portfolio tab */}
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

          {/* Open Orders Only Toggle - only on Orders tab */}
          {activeTab === 'orders' && (
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontSize: 12,
              color: '#9ca3af',
              userSelect: 'none',
            }}>
              <span>Open Orders Only</span>
              <div
                onClick={() => setOpenOnly(!openOnly)}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 12,
                  background: openOnly ? '#f59e0b' : '#374151',
                  position: 'relative',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 2,
                  left: openOnly ? 20 : 2,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }} />
              </div>
            </label>
          )}
          
          {/* View All Orders button - only on Orders tab */}
          {activeTab === 'orders' && (
            <button
              onClick={() => console.log('View all orders')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: '#6b7280',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              View All Orders
              <span style={{ fontSize: 14 }}>→</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'orders' && <MyOrders openOnly={openOnly} />}
        {activeTab === 'portfolio' && <Portfolio />}
      </div>
    </div>
  );
};

export default OrdersPortfolioPage;