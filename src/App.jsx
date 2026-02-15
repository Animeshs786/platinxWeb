import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CoinListPanel from "./components/CoinListPanel";
import TradingChart from "./components/TradingChart";
import OrderBook from "./components/OrderBook";
import OrderForm from "./components/OrderForm";
import MarketTicker from "./components/MarketTicker";

function App() {
  const [showCoinList, setShowCoinList] = useState(false);

  const handleShowPanel = (show) => {
    setShowCoinList(show);
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex flex-col">
      <Header />

      <div className="flex-1 flex relative overflow-hidden">
        {!showCoinList && <Sidebar onShowPanel={handleShowPanel} />}

        {showCoinList && (
          <div className="absolute left-0 top-0 h-full z-50">
            <CoinListPanel
              isOpen={showCoinList}
              onMouseEnter={() => handleShowPanel(true)}
              onMouseLeave={() => handleShowPanel(false)}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
            {/* Left Side - Chart */}
            <div className="lg:col-span-8">
              <TradingChart />
            </div>

            {/* Right Side - Order Book and Order Form */}
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              <OrderBook />
              <OrderForm />
            </div>
          </div>

          {/* Bottom Ticker */}
          <MarketTicker />
        </div>
      </div>
    </div>
  );
}

export default App;
