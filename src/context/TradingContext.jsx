import React, { createContext, useContext, useState } from 'react';

// ── Create Context ───────────────────────────────────────────────────────────
const TradingContext = createContext(null);

// ── Default Pair ─────────────────────────────────────────────────────────────
const DEFAULT_PAIR = {
  symbol: 'BTC/INR',
  exchange: 'coinswitchx',
};

// ── Provider Component ───────────────────────────────────────────────────────
export const TradingProvider = ({ children }) => {
  const [selectedPair, setSelectedPair] = useState(DEFAULT_PAIR);

  const updateSelectedPair = (coin) => {
    setSelectedPair({
      symbol: coin.symbol || DEFAULT_PAIR.symbol,
      exchange: coin.exchange || DEFAULT_PAIR.exchange,
    });
  };

  return (
    <TradingContext.Provider value={{ selectedPair, updateSelectedPair }}>
      {children}
    </TradingContext.Provider>
  );
};

// ── Custom Hook ──────────────────────────────────────────────────────────────
export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within TradingProvider');
  }
  return context;
};