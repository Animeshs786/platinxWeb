import React, { useState } from 'react';

const OrderForm = () => {
  const [activeTab, setActiveTab] = useState('limit');
  const [orderType, setOrderType] = useState('buy');
  const [limitPrice, setLimitPrice] = useState('26.74');
  const [quantity, setQuantity] = useState('9.30');

  const totalValue = (parseFloat(limitPrice) * parseFloat(quantity)).toFixed(2);

  return (
    <div className="bg-primary rounded-lg p-4">
      {/* Order Type Tabs */}
      <div className="flex space-x-2 mb-4">
        <button
          className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
            orderType === 'buy' ? 'bg-accent text-white' : 'bg-secondary text-gray-400'
          }`}
          onClick={() => setOrderType('buy')}
        >
          Buy
        </button>
        <button
          className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
            orderType === 'sell' ? 'bg-danger text-white' : 'bg-secondary text-gray-400'
          }`}
          onClick={() => setOrderType('sell')}
        >
          Sell
        </button>
      </div>

      {/* Limit/Stop Limit/Market Tabs */}
      <div className="flex space-x-2 mb-4 text-sm">
        <button
          className={`px-3 py-1.5 rounded ${
            activeTab === 'limit' ? 'bg-secondary text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('limit')}
        >
          Limit
        </button>
        <button
          className={`px-3 py-1.5 rounded ${
            activeTab === 'stop' ? 'bg-secondary text-white' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('stop')}
        >
          Stop Limit
        </button>
      </div>

      {/* Available Balance */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="text-gray-400">Available INR</div>
        <div className="text-white">999.21 ↓</div>
      </div>

      {/* Limit Price Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <label className="text-gray-400">Limit Price</label>
          <button className="text-accent text-xs">Get Lowest</button>
        </div>
        <div className="flex items-center bg-secondary rounded px-3 py-2">
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none"
          />
        </div>
      </div>

      {/* Quantity Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <label className="text-gray-400">Quantity</label>
          <span className="text-white">{quantity} LIGHT</span>
        </div>
        <div className="flex items-center bg-secondary rounded px-3 py-2">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none"
          />
        </div>

        {/* Percentage Buttons */}
        <div className="flex space-x-2 mt-3">
          <button className="text-xs text-gray-400 hover:text-white">Min 5.68 LIGHT</button>
          <button className="px-3 py-1 bg-secondary text-white text-xs rounded hover:bg-gray-700">25%</button>
          <button className="px-3 py-1 bg-secondary text-white text-xs rounded hover:bg-gray-700">50%</button>
          <button className="px-3 py-1 bg-secondary text-white text-xs rounded hover:bg-gray-700">100%</button>
        </div>
      </div>

      {/* Total Value */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="text-gray-400">Total INR Value</div>
        <div className="text-white font-medium">{totalValue} INR</div>
      </div>

      {/* Low Wallet Balance Warning */}
      <div className="flex items-center space-x-2 bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded px-3 py-2 mb-4">
        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="text-yellow-500 text-xs">Low Wallet Balance</div>
        <button className="ml-auto bg-yellow-600 text-white text-xs px-3 py-1 rounded hover:bg-yellow-700">
          Deposit
        </button>
      </div>

      {/* Place Order Button */}
      <button
        className={`w-full py-3 rounded font-medium transition-colors ${
          orderType === 'buy'
            ? 'bg-accent hover:bg-green-600 text-white'
            : 'bg-danger hover:bg-red-600 text-white'
        }`}
      >
        PLACE ORDER
      </button>

      {/* Fee Breakup Link */}
      <div className="text-center mt-3">
        <button className="text-accent text-sm hover:underline">Fee breakup</button>
      </div>
    </div>
  );
};

export default OrderForm;
