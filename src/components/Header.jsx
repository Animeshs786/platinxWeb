// import React, { useState } from "react";
// import { Menu, Search, Bell, User, ChevronDown } from "lucide-react";

// const Header = () => {
//   const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);

//   // const navItems = ['Portfolio', 'Spot', 'Futures', 'Options', 'Wallet & Fees', 'API Trading', 'Crypto Deposit'];

//   const navItems = [];

//   return (
//     <header className="bg-secondary border-b border-gray-800 sticky top-0 z-50">
//       <div className="flex items-center justify-between px-4 py-2">
//         {/* Logo */}
//         <div className="flex items-center space-x-6">
//           <img
//             src="https://fusiongrid.dev/exc/derivative/images/logo/logo.png"
//             alt="Platinx"
//             className="h-8"
//           />
//           <nav className="hidden lg:flex items-center space-x-6">
//             {navItems.map((item, index) => (
//               <button
//                 key={index}
//                 className="text-gray-300 hover:text-white text-sm transition-colors"
//               >
//                 {item}
//               </button>
//             ))}

//             {/* Orders Dropdown */}
//             <div
//               className="relative"
//               onMouseEnter={() => setShowOrdersDropdown(true)}
//               onMouseLeave={() => setShowOrdersDropdown(false)}
//             >
//               {/* <button className="text-gray-300 hover:text-white text-sm transition-colors flex items-center space-x-1">
//                 <span>Orders</span>
//                 <ChevronDown
//                   size={14}
//                   className={`transition-transform ${showOrdersDropdown ? "rotate-180" : ""}`}
//                 />
//               </button> */}

//               {/* Dropdown Menu */}
//               {showOrdersDropdown && (
//                 <div className="absolute top-full left-0 mt-2 w-48 bg-secondary border border-gray-700 rounded-lg shadow-xl z-50">
//                   <button className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white text-sm transition-colors rounded-t-lg">
//                     Spot Orders
//                   </button>
//                   <button className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white text-sm transition-colors rounded-b-lg">
//                     Futures Orders
//                   </button>
//                 </div>
//               )}
//             </div>
//           </nav>
//         </div>

//         {/* Right Side */}
//         <div className="flex items-center space-x-4">
//           <button className="text-gray-400 hover:text-white">
//             <Search size={20} />
//           </button>
//           <button className="text-gray-400 hover:text-white">
//             <Bell size={20} />
//           </button>
//           <button className="bg-accent text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-600 transition-colors">
//             A
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;










import React, { useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Layers,
  Users,
  History,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",     icon: LayoutDashboard },
  { label: "Exchange",      icon: ArrowLeftRight  },
  { label: "Wallet",        icon: Wallet          },
  { label: "Staking",       icon: Layers          },
  { label: "Referral",      icon: Users           },
  { label: "Order History", icon: History         },
];

const REDIRECT_URL = "https://fusiongrid.dev/exc/derivative/future/BTCUSDT";

const NavBtn = ({ label, icon: Icon, active, onClick }) => {
  const [hov, setHov] = useState(false);
  const lit = active || hov;

  return (
    <button
      onClick={() => { onClick(); window.open(REDIRECT_URL, "_blank"); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           7,
        padding:       "0 14px",
        height:        52,
        background:    "transparent",
        border:        "none",
        borderBottom:  lit ? "2px solid #f0b90b" : "2px solid transparent",
        cursor:        "pointer",
        transition:    "all 0.15s",
        color:         lit ? "#f0b90b" : "#8899bb",
        fontSize:      11,
        fontWeight:    lit ? 700 : 500,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        fontFamily:    "'IBM Plex Mono', 'JetBrains Mono', monospace",
        whiteSpace:    "nowrap",
      }}
    >
      <Icon size={14} style={{ opacity: lit ? 1 : 0.65, flexShrink: 0 }} />
      {label}
    </button>
  );
};

const Header = () => {
  const [activeNav, setActiveNav] = useState("Exchange");

  return (
    <header
      style={{
        background:   "linear-gradient(180deg, #080c1a 0%, #0b0f1e 100%)",
        borderBottom: "1px solid rgba(240,185,11,0.12)",
        position:     "sticky",
        top:          0,
        zIndex:       50,
        boxShadow:    "0 2px 24px rgba(0,0,0,0.7)",
        height:       52,
      }}
    >
      <div
        style={{
          display:        "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems:     "center",
          height:         "100%",
          padding:        "0 20px",
        }}
      >
        {/* ── LEFT: Logo ── */}
        <img
          src="https://fusiongrid.dev/exc/derivative/images/logo/logo.png"
          alt="PlatinX Exchange"
          style={{ height: 34, display: "block" }}
        />

        {/* ── CENTER: Nav ── */}
        <nav
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            gap:            0,
            height:         "100%",
          }}
        >
          {NAV_ITEMS.map(({ label, icon }) => (
            <NavBtn
              key={label}
              label={label}
              icon={icon}
              active={activeNav === label}
              onClick={() => setActiveNav(label)}
            />
          ))}
        </nav>

        {/* ── RIGHT: User icon ── */}
        <button
          style={{
            width:          32,
            height:         32,
            borderRadius:   "50%",
            background:     "linear-gradient(135deg, #f0b90b, #c8950a)",
            border:         "none",
            cursor:         "pointer",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            color:          "#000",
            boxShadow:      "0 0 12px rgba(240,185,11,0.45)",
            flexShrink:     0,
          }}
        >
          <User size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;