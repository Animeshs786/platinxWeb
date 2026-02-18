


import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CoinListPanel from "./components/CoinListPanel";
import TradingChart from "./components/TradingChart";
import MarketTicker from "./components/MarketTicker";
import OrderBookTrades from "./components/OrderBookTrades";
import OrderPlacement from "./components/OrderPlacement";
import OrdersPortfolioPage from "./Pages/OrdersPortfolioPage";

function App() {
  const [showCoinList, setShowCoinList] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const handleShowPanel = (show) => setShowCoinList(show);

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
    setShowCoinList(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060810",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Mono','JetBrains Mono',monospace",
      }}
    >
      {/* ── Top Navbar ── */}
      <Header />

      {/* ── Main Body ── */}
      <div style={{ flex: 1, display: "flex", position: "relative", minHeight: 0 }}>

        {/* ── Sidebar (always visible) ── */}
        <Sidebar
          onShowPanel={handleShowPanel}
          onSelectCoin={handleSelectCoin}
          selectedCoin={selectedCoin?.symbol || "BTC/INR"}
        />

        {/* ── CoinList Panel (overlay on hover) ── */}
        {showCoinList && (
          <div
            style={{
              position: "absolute",
              left: 52,           // sidebar width
              top: 0,
              height: "100%",
              zIndex: 50,
              boxShadow: "4px 0 24px rgba(0,0,0,0.6)",
            }}
            onMouseEnter={() => handleShowPanel(true)}
            onMouseLeave={() => handleShowPanel(false)}
          >
            <CoinListPanel
              isOpen={showCoinList}
              onSelectCoin={handleSelectCoin}
            />
          </div>
        )}

        {/* ── Trading Area ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* ── 3-Column Row: Chart | OrderBook | OrderForm ── */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "minmax(0, 55fr) minmax(220px, 22fr) minmax(220px, 23fr)",
              gap: 0,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              margin: "6px 0 0 6px",
              minHeight: 680,
              alignItems: "stretch",
            }}
          >
            {/* ── Column 1: Chart ── */}
            <div
              style={{
                borderRight: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <TradingChart selectedCoin={selectedCoin} />
            </div>

            {/* ── Column 2: Order Book / Last Trades ── */}
            <div
              style={{
                borderRight: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <OrderBookTrades selectedCoin={selectedCoin} />
            </div>

            {/* ── Column 3: Order Placement ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <OrderPlacement selectedCoin={selectedCoin} />
            </div>
          </div>

          {/* porfolio page */}
          <OrdersPortfolioPage />

          {/* ── Bottom Ticker ── */}
          <MarketTicker />
        </div>
      </div>
    </div>
  );
}

export default App;

















// import React, { useState } from "react";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
// import CoinListPanel from "./components/CoinListPanel";
// import TradingChart from "./components/TradingChart";
// import MarketTicker from "./components/MarketTicker";
// import OrderBookTrades from "./components/OrderBookTrades";
// import OrderPlacement from "./components/OrderPlacement";
// import SpotOrders from "./Pages/SportOrder";

// function App() {
//   const [showCoinList, setShowCoinList] = useState(false);
//   const [selectedCoin, setSelectedCoin] = useState(null);

//   const handleShowPanel = (show) => setShowCoinList(show);

//   const handleSelectCoin = (coin) => {
//     setSelectedCoin(coin);
//     setShowCoinList(false);
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#060810",
//         display: "flex",
//         flexDirection: "column",
//         fontFamily: "'DM Mono','JetBrains Mono',monospace",
//       }}
//     >
//       {/* ── Top Navbar ── */}
//       <Header />

//       {/* ── Main Body ── */}
//       <div style={{ flex: 1, display: "flex", position: "relative", minHeight: 0 }}>

//         {/* ── Sidebar (always visible) ── */}
//         <Sidebar
//           onShowPanel={handleShowPanel}
//           onSelectCoin={handleSelectCoin}
//           selectedCoin={selectedCoin?.symbol || "BTC/INR"}
//         />

//         {/* ── CoinList Panel (overlay on hover) ── */}
//         {showCoinList && (
//           <div
//             style={{
//               position: "absolute",
//               left: 52,           // sidebar width
//               top: 0,
//               height: "100%",
//               zIndex: 50,
//               boxShadow: "4px 0 24px rgba(0,0,0,0.6)",
//             }}
//             onMouseEnter={() => handleShowPanel(true)}
//             onMouseLeave={() => handleShowPanel(false)}
//           >
//             <CoinListPanel
//               isOpen={showCoinList}
//               onSelectCoin={handleSelectCoin}
//             />
//           </div>
//         )}

//         {/* ── Trading Area ── */}
//         <div>
//           <SpotOrders />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;









