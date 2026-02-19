import { TradingProvider } from "./context/TradingContext";
import Sportpage from "./Pages/SportPage";

function App() {
  return (
    <TradingProvider>
      <Sportpage />
    </TradingProvider>
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
// import SpotOrders from "./Pages/SportOrderPage";

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
