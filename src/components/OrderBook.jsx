import React, { useState } from 'react';

const OrderBook = () => {
  const [activeView, setActiveView] = useState('both');

  const sellOrders = [
    { price: 28.00, quantity: 537.38 },
    { price: 27.40, quantity: 74.65 },
    { price: 27.12, quantity: 279.62 },
    { price: 26.95, quantity: 1261.66 },
    { price: 26.92, quantity: 1261.66 },
    { price: 26.88, quantity: 18.60 },
    { price: 26.87, quantity: 1261.66 },
    { price: 26.75, quantity: 2246.72 },
  ];

  const buyOrders = [
    { price: 26.67, quantity: 753.65 },
    { price: 26.63, quantity: 189.14 },
    { price: 26.23, quantity: 766.29 },
    { price: 26.22, quantity: 1264.44 },
    { price: 26.20, quantity: 1261.66 },
    { price: 26.17, quantity: 1261.66 },
    { price: 26.13, quantity: 2300.03 },
    { price: 25.99, quantity: 725.18 },
  ];

  return (
    <div className="bg-primary rounded-lg p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button className="text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect width="16" height="2" />
              <rect y="7" width="16" height="2" />
              <rect y="14" width="16" height="2" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect width="16" height="7" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect y="9" width="16" height="7" />
            </svg>
          </button>
        </div>
        <button className="text-gray-400 text-sm">Depth</button>
      </div>

      {/* Column Headers */}
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <div>Price (INR)</div>
        <div className="text-right">Quantity</div>
      </div>

      {/* Sell Orders */}
      <div className="space-y-0.5 mb-3">
        {sellOrders.map((order, index) => (
          <div key={index} className="flex justify-between text-sm relative">
            <div className="absolute inset-0 bg-danger opacity-10" style={{ width: `${(order.quantity / 2300) * 100}%` }}></div>
            <div className="text-danger relative z-10">₹{order.price.toFixed(2)}</div>
            <div className="text-white relative z-10">{order.quantity.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Current Price */}
      <div className="bg-secondary py-2 px-3 rounded mb-3 flex items-center justify-between">
        <div className="text-accent text-lg font-bold">₹26.43</div>
        <div className="text-xs text-gray-400">Spread 1.50%</div>
      </div>

      {/* Buy Orders */}
      <div className="space-y-0.5">
        {buyOrders.map((order, index) => (
          <div key={index} className="flex justify-between text-sm relative">
            <div className="absolute inset-0 bg-accent opacity-10" style={{ width: `${(order.quantity / 2300) * 100}%` }}></div>
            <div className="text-accent relative z-10">₹{order.price.toFixed(2)}</div>
            <div className="text-white relative z-10">{order.quantity.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
