// import React, { useState } from "react";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
// import CoinListPanel from "./components/CoinListPanel";
// import TradingChart from "./components/TradingChart";
// import OrderBook from "./components/OrderBook";
// import LastTrades from "./components/LastTrades";
// import OrderForm from "./components/OrderForm";
// import MarketTicker from "./components/MarketTicker";

// function App() {
//   const [showCoinList, setShowCoinList] = useState(false);
//   const [activeRightTab, setActiveRightTab] = useState("orderbook");

//   const handleShowPanel = (show) => {
//     setShowCoinList(show);
//   };

//   return (
//     <div className="min-h-screen bg-[#0f1419] flex flex-col">
//       <Header />

//       <div className="flex-1 flex relative overflow-hidden">
//         {!showCoinList && <Sidebar onShowPanel={handleShowPanel} />}

//         {showCoinList && (
//           <div className="absolute left-0 top-0 h-full z-50">
//             <CoinListPanel
//               isOpen={showCoinList}
//               onMouseEnter={() => handleShowPanel(true)}
//               onMouseLeave={() => handleShowPanel(false)}
//             />
//           </div>
//         )}

//         <div className="flex-1 flex flex-col">
//           {/* Main trading area - full height */}
//           <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
//             {/* Chart - takes most space */}
//             <div className="lg:col-span-7 xl:col-span-8">
//               <TradingChart />
//             </div>

//             {/* Order Book / Last Trades + Order Form - side by side */}
//             <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
//               {/* Toggle for Order Book ↔ Last Trades */}
//               <div className="flex rounded-t-lg overflow-hidden border border-gray-800 border-b-0">
//                 <button
//                   onClick={() => setActiveRightTab("orderbook")}
//                   className={`flex-1 py-3 text-sm font-medium transition-colors ${
//                     activeRightTab === "orderbook"
//                       ? "bg-[#1a2332] text-white border-b-2 border-yellow-500"
//                       : "bg-[#0a0e13] text-gray-400 hover:text-gray-200"
//                   }`}
//                 >
//                   ORDER BOOK
//                 </button>
//                 <button
//                   onClick={() => setActiveRightTab("lasttrades")}
//                   className={`flex-1 py-3 text-sm font-medium transition-colors ${
//                     activeRightTab === "lasttrades"
//                       ? "bg-[#1a2332] text-white border-b-2 border-yellow-500"
//                       : "bg-[#0a0e13] text-gray-400 hover:text-gray-200"
//                   }`}
//                 >
//                   LAST TRADES
//                 </button>
//               </div>

//               {/* Book or Trades - takes available height */}
//               <div className="flex-1 bg-[#0f1419] rounded-lg border border-gray-800 overflow-hidden min-h-[400px]">
//                 {activeRightTab === "orderbook" ? (
//                   <OrderBook />
//                 ) : (
//                   <LastTrades />
//                 )}
//               </div>
//             </div>

//             {/* Order Form - separate column on the right */}
//             <div className="lg:col-span-12 xl:col-span-12 lg:mt-0 mt-4">
//               <OrderForm />
//             </div>
//           </div>

//           {/* Bottom Ticker */}
//           <MarketTicker />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// import React, { useState } from "react";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
// import CoinListPanel from "./components/CoinListPanel";
// import TradingChart from "./components/TradingChart";
// import MarketTicker from "./components/MarketTicker";
// import OrderBookTrades from "./components/OrderBookTrades";
// import OrderPlacement from "./components/OrderPlacement";

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
//         height: "100vh",
//         background: "#060810",
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         fontFamily: "'DM Mono','JetBrains Mono',monospace",
//       }}
//     >
//       {/* ── Top Navbar ── */}
//       <Header />

//       {/* ── Main Body ── */}
//       <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", minHeight: 0 }}>

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
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//             minWidth: 0,
//             minHeight: 0,
//           }}
//         >
//           {/* ── 3-Column Row: Chart | OrderBook | OrderForm ── */}
//           <div
//             style={{
//               flex: 1,
//               display: "grid",
//               gridTemplateColumns: "minmax(0, 55fr) minmax(220px, 22fr) minmax(220px, 23fr)",
//               gap: 0,
//               overflow: "hidden",
//               borderTop: "1px solid rgba(255,255,255,0.05)",
//               margin: "6px 0 0 6px",
//               minHeight: 0,
//             }}
//           >
//             {/* ── Column 1: Chart ── */}
//             <div
//               style={{
//                 borderRight: "1px solid rgba(255,255,255,0.05)",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 minHeight: 0,
//                 height: "100%",
//               }}
//             >
//               <TradingChart selectedCoin={selectedCoin} />
//             </div>

//             {/* ── Column 2: Order Book / Last Trades ── */}
//             <div
//               style={{
//                 borderRight: "1px solid rgba(255,255,255,0.05)",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 minHeight: 0,
//                 height: "100%",
//               }}
//             >
//               <OrderBookTrades selectedCoin={selectedCoin} />
//             </div>

//             {/* ── Column 3: Order Placement ── */}
//             <div
//               style={{
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 minHeight: 0,
//                 height: "100%",
//               }}
//             >
//               <OrderPlacement selectedCoin={selectedCoin} />
//             </div>
//           </div>

//           {/* ── Bottom Ticker ── */}
//           <MarketTicker />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;





import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CoinListPanel from "./components/CoinListPanel";
import TradingChart from "./components/TradingChart";
import MarketTicker from "./components/MarketTicker";
import OrderBookTrades from "./components/OrderBookTrades";
import OrderPlacement from "./components/OrderPlacement";

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

          {/* ── Bottom Ticker ── */}
          <MarketTicker />
        </div>
      </div>
    </div>
  );
}

export default App;