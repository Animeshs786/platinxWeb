// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { io } from "socket.io-client";

// // ─── CONFIG ──────────────────────────────────────────────────────────────────
// const BASE_URL   = "wss://ws.coinswitch.co";
// const NAMESPACE  = "/coinswitchx";
// const PAIR       = "BTC,INR";
// const EVT_BOOK   = "FETCH_ORDER_BOOK_CS_PRO";
// const EVT_TRADE  = "FETCH_TRADES_CS_PRO";
// const WS_PATH    = "/pro/realtime-rates-socket/spot/coinswitchx";
// const ROWS       = 10; // rows shown per side

// // ─── COLOR TOKENS ────────────────────────────────────────────────────────────
// const C = {
//   bg:       "#0b0e17",
//   bgDeep:   "#070a10",
//   border:   "rgba(255,255,255,0.06)",
//   accent:   "#f0b90b",
//   green:    "#0ecb81",
//   red:      "#f6465d",
//   greenDim: "rgba(14,203,129,0.15)",
//   redDim:   "rgba(246,70,93,0.15)",
//   label:    "#5a6478",
//   text:     "#c4cbd9",
//   textDim:  "#3d4659",
//   spreadBg: "#111827",
//   mono:     "'IBM Plex Mono','JetBrains Mono','Courier New',monospace",
// };

// // ─── HELPERS ─────────────────────────────────────────────────────────────────
// const fmtPrice = (n) =>
//   "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// const fmtQty = (n) => {
//   const v = Number(n);
//   if (v < 0.001) return v.toFixed(6);
//   if (v < 0.01)  return v.toFixed(5);
//   if (v < 1)     return v.toFixed(4);
//   return v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };

// /**
//  * Pick ROWS orders nearest to refPrice from the full book.
//  * asks  → sorted asc,  take lowest ROWS (nearest above price), then reverse for display
//  * bids  → sorted desc, take highest ROWS (nearest below price)
//  */
// const nearestOrders = (rawList, side, refPrice, rows = ROWS) => {
//   if (!rawList?.length) return [];
//   const parsed = rawList
//     .map(([p, q]) => ({ price: Number(p), qty: Number(q) }))
//     .filter((o) => o.qty > 0);

//   if (side === "ask") {
//     const above = refPrice > 0
//       ? parsed.filter((o) => o.price >= refPrice)
//       : parsed;
//     return above.sort((a, b) => a.price - b.price).slice(0, rows).reverse();
//     // reversed → furthest ask on top, nearest ask at bottom (closest to spread)
//   } else {
//     const below = refPrice > 0
//       ? parsed.filter((o) => o.price <= refPrice)
//       : parsed;
//     return below.sort((a, b) => b.price - a.price).slice(0, rows);
//     // nearest bid at top (closest to spread)
//   }
// };

// // ─── ORDER ROW ────────────────────────────────────────────────────────────────
// const OrderRow = React.memo(({ price, qty, side, maxQ, flash }) => {
//   const [hov, setHov] = useState(false);
//   const [lit, setLit] = useState(false);

//   useEffect(() => {
//     if (flash) {
//       setLit(true);
//       const t = setTimeout(() => setLit(false), 500);
//       return () => clearTimeout(t);
//     }
//   }, [flash]);

//   const color = side === "ask" ? C.red : C.green;
//   const pct   = maxQ > 0 ? (qty / maxQ) : 0;

//   const bg = lit
//     ? (side === "ask" ? "rgba(246,70,93,0.14)" : "rgba(14,203,129,0.14)")
//     : hov
//     ? (side === "ask" ? "rgba(246,70,93,0.05)" : "rgba(14,203,129,0.05)")
//     : "transparent";

//   return (
//     <div
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       style={{
//         display: "flex", justifyContent: "space-between", alignItems: "center",
//         padding: "3px 12px", position: "relative", cursor: "pointer",
//         minHeight: 22, background: bg, transition: "background 0.3s",
//       }}
//     >
//       {/* Depth bar from right */}
//       <div style={{
//         position: "absolute", right: 0, top: 0, bottom: 0,
//         width: `${pct * 100}%`, background: color, opacity: 0.13,
//         pointerEvents: "none", transition: "width .2s",
//       }} />
//       <span style={{
//         fontSize: 12, fontWeight: 600, color, zIndex: 1,
//         letterSpacing: "0.3px", fontVariantNumeric: "tabular-nums",
//       }}>
//         {fmtPrice(price)}
//       </span>
//       <span style={{ fontSize: 11, color: C.text, zIndex: 1, fontVariantNumeric: "tabular-nums" }}>
//         {fmtQty(qty)}
//       </span>
//     </div>
//   );
// });

// // ─── TRADE ROW ────────────────────────────────────────────────────────────────
// const TradeRow = React.memo(({ price, qty, time, side, isNew }) => {
//   const color = side === "buy" ? C.green : C.red;
//   const [lit, setLit] = useState(isNew);

//   useEffect(() => {
//     if (isNew) {
//       setLit(true);
//       const t = setTimeout(() => setLit(false), 800);
//       return () => clearTimeout(t);
//     }
//   }, [isNew]);

//   return (
//     <div style={{
//       display: "flex", justifyContent: "space-between", alignItems: "center",
//       padding: "3px 12px", minHeight: 22,
//       background: lit
//         ? (side === "buy" ? "rgba(14,203,129,0.08)" : "rgba(246,70,93,0.08)")
//         : "transparent",
//       transition: "background 0.6s",
//     }}>
//       <span style={{
//         fontSize: 12, fontWeight: 600, color,
//         fontVariantNumeric: "tabular-nums", letterSpacing: "0.3px",
//       }}>
//         {fmtPrice(price)}
//       </span>
//       <span style={{ fontSize: 11, color: C.text, fontVariantNumeric: "tabular-nums" }}>
//         {fmtQty(qty)}
//       </span>
//       <span style={{ fontSize: 10, color: C.label, fontVariantNumeric: "tabular-nums" }}>
//         {time}
//       </span>
//     </div>
//   );
// });

// // ─── ICONS ───────────────────────────────────────────────────────────────────
// const SplitIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//     <rect x="1" y="1"   width="12" height="2.5" rx=".5" fill={C.red}   opacity=".9"/>
//     <rect x="1" y="4.5" width="12" height="2.5" rx=".5" fill={C.red}   opacity=".4"/>
//     <rect x="1" y="8"   width="12" height="2.5" rx=".5" fill={C.green} opacity=".9"/>
//     <rect x="1" y="11"  width="12" height="2.5" rx=".5" fill={C.green} opacity=".4"/>
//   </svg>
// );
// const AskIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//     <rect x="1" y="1"   width="12" height="2.5" rx=".5" fill={C.red} opacity=".9"/>
//     <rect x="1" y="4.5" width="12" height="2.5" rx=".5" fill={C.red} opacity=".5"/>
//     <rect x="1" y="8"   width="12" height="2.5" rx=".5" fill={C.red} opacity=".25"/>
//     <rect x="1" y="11"  width="12" height="2.5" rx=".5" fill={C.red} opacity=".1"/>
//   </svg>
// );
// const BidIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//     <rect x="1" y="1"   width="12" height="2.5" rx=".5" fill={C.green} opacity=".9"/>
//     <rect x="1" y="4.5" width="12" height="2.5" rx=".5" fill={C.green} opacity=".5"/>
//     <rect x="1" y="8"   width="12" height="2.5" rx=".5" fill={C.green} opacity=".25"/>
//     <rect x="1" y="11"  width="12" height="2.5" rx=".5" fill={C.green} opacity=".1"/>
//   </svg>
// );

// const ModeBtn = ({ active, onClick, title, children }) => (
//   <button onClick={onClick} title={title} style={{
//     width: 26, height: 22, borderRadius: 4, cursor: "pointer",
//     border: active ? `1px solid rgba(240,185,11,.3)` : "1px solid transparent",
//     background: active ? "rgba(240,185,11,.12)" : "transparent",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     padding: 0, transition: "all .15s",
//   }}>{children}</button>
// );

// const DepthToggle = ({ value, onChange }) => (
//   <div onClick={() => onChange(!value)}
//     style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", userSelect: "none" }}>
//     <span style={{ fontSize: 10, color: C.label, letterSpacing: ".5px" }}>DEPTH</span>
//     <div style={{
//       width: 30, height: 16, borderRadius: 8, position: "relative",
//       background: value ? C.accent : C.textDim, transition: "background .2s",
//     }}>
//       <div style={{
//         position: "absolute", top: 2, left: value ? 16 : 2,
//         width: 12, height: 12, borderRadius: "50%", background: "#fff",
//         transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.4)",
//       }} />
//     </div>
//   </div>
// );

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// const OrderBookTrades = () => {
//   const [activeTab,   setActiveTab]   = useState("orderbook");
//   const [viewMode,    setViewMode]    = useState("both");
//   const [depth,       setDepth]       = useState(true);
//   const [isConnected, setIsConnected] = useState(false);

//   // Displayed order book
//   const [asks, setAsks] = useState([]);
//   const [bids, setBids] = useState([]);

//   // Flash state for changed rows
//   const [flashAsks, setFlashAsks] = useState({});
//   const [flashBids, setFlashBids] = useState({});
//   const prevAsksRef = useRef({});
//   const prevBidsRef = useRef({});

//   // Full raw book from WS (up to 200 levels)
//   const rawBookRef    = useRef({ asks: [], bids: [] });

//   // Last trade price (used as refPrice for nearest filtering)
//   const lastPriceRef  = useRef(0);
//   const [lastPrice,   setLastPrice]   = useState(0);
//   const [priceDir,    setPriceDir]    = useState("up");

//   // Live trades list
//   const [trades, setTrades] = useState([]);

//   // ── Rebuild book from raw data + refPrice ────────────────────────────────
//   const rebuildBook = useCallback((refPrice) => {
//     const raw = rawBookRef.current;
//     if (!raw.asks.length && !raw.bids.length) return;

//     // Fallback mid if no trade price yet
//     const fallbackRef = refPrice > 0 ? refPrice : (() => {
//       const ba = Math.min(...raw.asks.map(([p]) => Number(p)).filter(Boolean));
//       const bb = Math.max(...raw.bids.map(([p]) => Number(p)).filter(Boolean));
//       return isFinite(ba) && isFinite(bb) ? (ba + bb) / 2 : 0;
//     })();

//     const newAsks = nearestOrders(raw.asks, "ask", fallbackRef, ROWS);
//     const newBids = nearestOrders(raw.bids, "bid", fallbackRef, ROWS);

//     // Flash detection
//     const fA = {}, fB = {};
//     newAsks.forEach((o) => {
//       if (prevAsksRef.current[o.price] !== undefined &&
//           prevAsksRef.current[o.price] !== o.qty) fA[o.price] = true;
//     });
//     newBids.forEach((o) => {
//       if (prevBidsRef.current[o.price] !== undefined &&
//           prevBidsRef.current[o.price] !== o.qty) fB[o.price] = true;
//     });

//     // Save prev snapshot
//     const snapA = {}; newAsks.forEach((o) => (snapA[o.price] = o.qty));
//     const snapB = {}; newBids.forEach((o) => (snapB[o.price] = o.qty));
//     prevAsksRef.current = snapA;
//     prevBidsRef.current = snapB;

//     setAsks(newAsks);
//     setBids(newBids);

//     if (Object.keys(fA).length) {
//       setFlashAsks(fA);
//       setTimeout(() => setFlashAsks({}), 550);
//     }
//     if (Object.keys(fB).length) {
//       setFlashBids(fB);
//       setTimeout(() => setFlashBids({}), 550);
//     }
//   }, []);

//   // ── WebSocket setup ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const socket = io(BASE_URL + NAMESPACE, {
//       path: WS_PATH,
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionDelay: 3000,
//     });

//     socket.on("connect", () => {
//       setIsConnected(true);
//       socket.emit(EVT_BOOK,  { event: "subscribe", pair: PAIR });
//       socket.emit(EVT_TRADE, { event: "subscribe", pair: PAIR });
//     });

//     // ── Order book updates ───────────────────────────────────────────────
//     socket.on(EVT_BOOK, (data) => {
//       if (!data) return;
//       rawBookRef.current = {
//         asks: data.asks?.length ? data.asks : rawBookRef.current.asks,
//         bids: data.bids?.length ? data.bids : rawBookRef.current.bids,
//       };
//       rebuildBook(lastPriceRef.current);
//     });

//     // ── Trade updates ────────────────────────────────────────────────────
//     socket.on(EVT_TRADE, (data) => {
//       if (!data?.p || data?.s !== PAIR) return;

//       const newPrice = Number(data.p);
//       const dir = newPrice >= (lastPriceRef.current || newPrice) ? "up" : "down";
//       lastPriceRef.current = newPrice;

//       setLastPrice(newPrice);
//       setPriceDir(dir);

//       // Rebuild book with new reference price
//       rebuildBook(newPrice);

//       const trade = {
//         price: newPrice,
//         qty:   Number(data.q || data.qty || 0),
//         time:  new Date(data.E || Date.now()).toLocaleTimeString("en-IN", {
//           hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
//         }),
//         // m = true → buyer is maker → sell aggression (red)
//         // m = false / undefined → buy aggression (green)
//         side:  data.m === true ? "sell" : "buy",
//         id:    data.t || Date.now(),
//       };

//       setTrades((prev) => [trade, ...prev].slice(0, 40));
//     });

//     socket.on("disconnect",    () => setIsConnected(false));
//     socket.on("connect_error", (e) => console.error("WS:", e.message));

//     return () => socket.disconnect();
//   }, [rebuildBook]);

//   // ─── Derived stats ───────────────────────────────────────────────────────
//   // Nearest ask = last element (bottom of asks, closest to mid)
//   // Nearest bid = first element (top of bids, closest to mid)
//   const nearestAsk = asks.length ? asks[asks.length - 1].price : 0;
//   const nearestBid = bids.length ? bids[0].price : 0;

//   const midPrice  = lastPrice > 0 ? lastPrice
//     : (nearestAsk > 0 && nearestBid > 0 ? (nearestAsk + nearestBid) / 2 : 0);

//   const spread    = nearestAsk > 0 && nearestBid > 0 ? nearestAsk - nearestBid : 0;
//   const spreadPct = nearestBid > 0 && spread > 0
//     ? ((spread / nearestBid) * 100).toFixed(2) : "—";

//   // Full book totals (all levels)
//   const bidTotal = rawBookRef.current.bids.reduce((s, [, q]) => s + Number(q), 0);
//   const askTotal = rawBookRef.current.asks.reduce((s, [, q]) => s + Number(q), 0);
//   const totalVol = bidTotal + askTotal;
//   const bidPct   = totalVol > 0 ? Math.round((bidTotal / totalVol) * 100) : 50;
//   const askPct   = 100 - bidPct;

//   const askMaxQ  = asks.length ? Math.max(...asks.map((o) => o.qty)) : 1;
//   const bidMaxQ  = bids.length ? Math.max(...bids.map((o) => o.qty)) : 1;

//   // Trade buy/sell % (last 40 trades)
//   const tBuyVol  = trades.filter((t) => t.side === "buy").reduce((a, t) => a + t.qty, 0);
//   const tSellVol = trades.filter((t) => t.side === "sell").reduce((a, t) => a + t.qty, 0);
//   const tTotal   = tBuyVol + tSellVol;
//   const tBuyPct  = tTotal > 0 ? Math.round((tBuyVol / tTotal) * 100) : 50;
//   const tSellPct = 100 - tBuyPct;

//   // ─── Common styles ───────────────────────────────────────────────────────
//   const colLbl = { fontSize: 10, color: C.label, letterSpacing: "0.8px", textTransform: "uppercase", fontWeight: 600 };
//   const scrollBox = {
//     flex: 1, overflowY: "auto", display: "flex", flexDirection: "column",
//     scrollbarWidth: "thin", scrollbarColor: `${C.textDim} transparent`,
//   };

//   return (
//     <div style={{
//       width: "100%", height: "100%",
//       display: "flex", flexDirection: "column",
//       background: C.bg, border: `1px solid ${C.border}`,
//       borderRadius: 10, overflow: "hidden",
//       fontFamily: C.mono, boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
//     }}>

//       {/* ── TABS + LIVE DOT ── */}
//       <div style={{
//         display: "flex", alignItems: "center",
//         borderBottom: `1px solid ${C.border}`,
//         background: C.bgDeep, padding: "0 4px", flexShrink: 0,
//       }}>
//         {[["orderbook", "Order Book"], ["trades", "Last Trades"]].map(([id, lbl]) => (
//           <button key={id} onClick={() => setActiveTab(id)} style={{
//             padding: "10px 16px", fontSize: 12, fontWeight: 700,
//             letterSpacing: "0.6px", fontFamily: "inherit",
//             border: "none", cursor: "pointer", background: "transparent",
//             color: activeTab === id ? C.accent : C.label,
//             borderBottom: `2px solid ${activeTab === id ? C.accent : "transparent"}`,
//             transition: "all .18s", textTransform: "uppercase", marginBottom: -1,
//           }}>{lbl}</button>
//         ))}
//         <div style={{ marginLeft: "auto", marginRight: 10, display: "flex", alignItems: "center", gap: 5 }}>
//           <div style={{
//             width: 6, height: 6, borderRadius: "50%",
//             background: isConnected ? C.green : C.textDim,
//             boxShadow: isConnected ? `0 0 5px ${C.green}` : "none",
//             transition: "all .3s",
//           }} />
//           <span style={{ fontSize: 9, color: isConnected ? C.green : C.textDim, letterSpacing: ".5px" }}>
//             {isConnected ? "LIVE" : "CONNECTING"}
//           </span>
//         </div>
//       </div>

//       {/* ════════ ORDER BOOK ════════ */}
//       {activeTab === "orderbook" && (
//         <>
//           {/* Sub-toolbar */}
//           <div style={{
//             display: "flex", alignItems: "center", justifyContent: "space-between",
//             padding: "6px 12px", background: C.bgDeep,
//             borderBottom: `1px solid ${C.border}`, flexShrink: 0, gap: 8,
//           }}>
//             <div style={{ display: "flex", gap: 4 }}>
//               <ModeBtn active={viewMode === "both"} onClick={() => setViewMode("both")} title="Both"><SplitIcon /></ModeBtn>
//               <ModeBtn active={viewMode === "asks"} onClick={() => setViewMode("asks")} title="Asks only"><AskIcon /></ModeBtn>
//               <ModeBtn active={viewMode === "bids"} onClick={() => setViewMode("bids")} title="Bids only"><BidIcon /></ModeBtn>
//             </div>
//             {depth && (
//               <span style={{ fontSize: 9, color: C.label }}>
//                 <span style={{ color: C.red }}>█</span> ASK &nbsp;
//                 <span style={{ color: C.green }}>█</span> BID
//               </span>
//             )}
//             <DepthToggle value={depth} onChange={setDepth} />
//           </div>

//           {/* Col headers */}
//           <div style={{ display: "flex", justifyContent: "space-between",
//             padding: "5px 12px", background: C.bgDeep,
//             borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
//             <span style={colLbl}>Price (INR)</span>
//             <span style={colLbl}>Quantity</span>
//           </div>

//           {/* Book body */}
//           <div style={scrollBox}>

//             {/* ASKS — highest at top, nearest to spread at bottom */}
//             {(viewMode === "both" || viewMode === "asks") && (
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 {asks.map((row) => (
//                   <OrderRow
//                     key={row.price}
//                     {...row} side="ask" maxQ={depth ? askMaxQ : 1}
//                     flash={!!flashAsks[row.price]}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* SPREAD ROW — shows live last trade price */}
//             {viewMode === "both" && (
//               <div style={{
//                 display: "flex", alignItems: "center", justifyContent: "space-between",
//                 padding: "7px 12px", background: C.spreadBg, flexShrink: 0,
//                 borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
//               }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//                   <span style={{
//                     fontSize: 17, fontWeight: 700,
//                     color: priceDir === "up" ? C.green : C.red,
//                     letterSpacing: "-0.3px", fontVariantNumeric: "tabular-nums",
//                     transition: "color .3s",
//                   }}>
//                     {midPrice > 0 ? fmtPrice(midPrice) : "—"}
//                   </span>
//                   <span style={{ fontSize: 13, color: priceDir === "up" ? C.green : C.red }}>
//                     {priceDir === "up" ? "↑" : "↓"}
//                   </span>
//                 </div>
//                 <span style={{ fontSize: 10, color: C.label, letterSpacing: ".4px" }}>
//                   Spread <span style={{ color: C.text, fontWeight: 600 }}>{spreadPct}%</span>
//                 </span>
//               </div>
//             )}

//             {/* BIDS — nearest at top, furthest at bottom */}
//             {(viewMode === "both" || viewMode === "bids") && (
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 {bids.map((row) => (
//                   <OrderRow
//                     key={row.price}
//                     {...row} side="bid" maxQ={depth ? bidMaxQ : 1}
//                     flash={!!flashBids[row.price]}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Empty state */}
//             {asks.length === 0 && bids.length === 0 && (
//               <div style={{ flex: 1, display: "flex", alignItems: "center",
//                 justifyContent: "center", color: C.label, fontSize: 12 }}>
//                 Connecting to order book…
//               </div>
//             )}
//           </div>

//           {/* Footer — totals + ratio bar */}
//           <div style={{
//             padding: "7px 12px", borderTop: `1px solid ${C.border}`,
//             background: C.bgDeep, flexShrink: 0,
//           }}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
//               <div>
//                 <div style={{ fontSize: 9, color: C.label, marginBottom: 2, letterSpacing: ".4px" }}>BID TOTAL</div>
//                 <div style={{ fontSize: 11, color: C.green, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
//                   {bidTotal > 0 ? bidTotal.toFixed(4) : "—"} BTC
//                 </div>
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <div style={{ fontSize: 9, color: C.label, marginBottom: 2, letterSpacing: ".4px" }}>ASK TOTAL</div>
//                 <div style={{ fontSize: 11, color: C.red, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
//                   {askTotal > 0 ? askTotal.toFixed(4) : "—"} BTC
//                 </div>
//               </div>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <span style={{ fontSize: 10, color: C.green, fontWeight: 700, minWidth: 28 }}>{bidPct}%</span>
//               <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.redDim, overflow: "hidden" }}>
//                 <div style={{
//                   height: "100%", width: `${bidPct}%`, background: C.green,
//                   borderRadius: 2, transition: "width .5s ease",
//                 }} />
//               </div>
//               <span style={{ fontSize: 10, color: C.red, fontWeight: 700, minWidth: 28, textAlign: "right" }}>
//                 {askPct}%
//               </span>
//             </div>
//           </div>
//         </>
//       )}

//       {/* ════════ LAST TRADES ════════ */}
//       {activeTab === "trades" && (
//         <>
//           <div style={{ display: "flex", justifyContent: "space-between",
//             padding: "7px 12px", background: C.bgDeep,
//             borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
//             <span style={colLbl}>Price (INR)</span>
//             <span style={colLbl}>Qty</span>
//             <span style={colLbl}>Time</span>
//           </div>

//           <div style={scrollBox}>
//             {trades.map((t, i) => (
//               <TradeRow key={`${t.id}-${i}`} {...t} isNew={i === 0} />
//             ))}
//             {trades.length === 0 && (
//               <div style={{ flex: 1, display: "flex", alignItems: "center",
//                 justifyContent: "center", color: C.label, fontSize: 12 }}>
//                 Waiting for trades…
//               </div>
//             )}
//           </div>

//           {/* Trade buy/sell summary */}
//           <div style={{
//             padding: "7px 12px", borderTop: `1px solid ${C.border}`,
//             background: C.bgDeep, flexShrink: 0,
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <div>
//                 <div style={{ fontSize: 9, color: C.label, marginBottom: 2 }}>BUY</div>
//                 <div style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>{tBuyPct}%</div>
//               </div>
//               <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.redDim, overflow: "hidden" }}>
//                 <div style={{
//                   height: "100%", width: `${tBuyPct}%`, background: C.green,
//                   borderRadius: 2, transition: "width .5s ease",
//                 }} />
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <div style={{ fontSize: 9, color: C.label, marginBottom: 2 }}>SELL</div>
//                 <div style={{ fontSize: 11, color: C.red, fontWeight: 700 }}>{tSellPct}%</div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default OrderBookTrades;






























import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const BASE_URL   = "wss://ws.coinswitch.co";
const NAMESPACE  = "/coinswitchx";
const PAIR       = "BTC,INR";
const EVT_BOOK   = "FETCH_ORDER_BOOK_CS_PRO";
const EVT_TRADE  = "FETCH_TRADES_CS_PRO";
const WS_PATH    = "/pro/realtime-rates-socket/spot/coinswitchx";
const ROWS_BOTH  = 10;  // rows per side when showing both
const ROWS_SINGLE = 100; // rows when showing only asks or only bids

// ─── COLOR TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:       "#0b0e17",
  bgDeep:   "#070a10",
  border:   "rgba(255,255,255,0.06)",
  accent:   "#f0b90b",
  green:    "#0ecb81",
  red:      "#f6465d",
  greenDim: "rgba(14,203,129,0.15)",
  redDim:   "rgba(246,70,93,0.15)",
  label:    "#5a6478",
  text:     "#c4cbd9",
  textDim:  "#3d4659",
  spreadBg: "#111827",
  mono:     "'IBM Plex Mono','JetBrains Mono','Courier New',monospace",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtPrice = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const fmtQty = (n) => {
  const v = Number(n);
  if (v < 0.001) return v.toFixed(6);
  if (v < 0.01)  return v.toFixed(5);
  if (v < 1)     return v.toFixed(4);
  return v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const nearestOrders = (rawList, side, refPrice, rows) => {
  if (!rawList?.length) return [];
  const parsed = rawList
    .map(([p, q]) => ({ price: Number(p), qty: Number(q) }))
    .filter((o) => o.qty > 0);

  if (side === "ask") {
    const above = refPrice > 0
      ? parsed.filter((o) => o.price >= refPrice)
      : parsed;
    return above.sort((a, b) => a.price - b.price).slice(0, rows).reverse();
  } else {
    const below = refPrice > 0
      ? parsed.filter((o) => o.price <= refPrice)
      : parsed;
    return below.sort((a, b) => b.price - a.price).slice(0, rows);
  }
};

// ─── ORDER ROW ────────────────────────────────────────────────────────────────
const OrderRow = React.memo(({ price, qty, side, maxQ, flash }) => {
  const [hov, setHov] = useState(false);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    if (flash) {
      setLit(true);
      const t = setTimeout(() => setLit(false), 500);
      return () => clearTimeout(t);
    }
  }, [flash]);

  const color = side === "ask" ? C.red : C.green;
  const pct   = maxQ > 0 ? (qty / maxQ) : 0;

  const bg = lit
    ? (side === "ask" ? "rgba(246,70,93,0.14)" : "rgba(14,203,129,0.14)")
    : hov
    ? (side === "ask" ? "rgba(246,70,93,0.05)" : "rgba(14,203,129,0.05)")
    : "transparent";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "3px 12px", position: "relative", cursor: "pointer",
        minHeight: 22, background: bg, transition: "background 0.3s",
      }}
    >
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0,
        width: `${pct * 100}%`, background: color, opacity: 0.13,
        pointerEvents: "none", transition: "width .2s",
      }} />
      <span style={{
        fontSize: 12, fontWeight: 600, color, zIndex: 1,
        letterSpacing: "0.3px", fontVariantNumeric: "tabular-nums",
      }}>
        {fmtPrice(price)}
      </span>
      <span style={{ fontSize: 11, color: C.text, zIndex: 1, fontVariantNumeric: "tabular-nums" }}>
        {fmtQty(qty)}
      </span>
    </div>
  );
});

// ─── TRADE ROW ────────────────────────────────────────────────────────────────
const TradeRow = React.memo(({ price, qty, time, side, isNew }) => {
  const color = side === "buy" ? C.green : C.red;
  const [lit, setLit] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      setLit(true);
      const t = setTimeout(() => setLit(false), 800);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "3px 12px", minHeight: 22,
      background: lit
        ? (side === "buy" ? "rgba(14,203,129,0.08)" : "rgba(246,70,93,0.08)")
        : "transparent",
      transition: "background 0.6s",
    }}>
      <span style={{
        fontSize: 12, fontWeight: 600, color,
        fontVariantNumeric: "tabular-nums", letterSpacing: "0.3px",
      }}>
        {fmtPrice(price)}
      </span>
      <span style={{ fontSize: 11, color: C.text, fontVariantNumeric: "tabular-nums" }}>
        {fmtQty(qty)}
      </span>
      <span style={{ fontSize: 10, color: C.label, fontVariantNumeric: "tabular-nums" }}>
        {time}
      </span>
    </div>
  );
});

// ─── ICONS ───────────────────────────────────────────────────────────────────
const SplitIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1"   width="12" height="2.5" rx=".5" fill={C.red}   opacity=".9"/>
    <rect x="1" y="4.5" width="12" height="2.5" rx=".5" fill={C.red}   opacity=".4"/>
    <rect x="1" y="8"   width="12" height="2.5" rx=".5" fill={C.green} opacity=".9"/>
    <rect x="1" y="11"  width="12" height="2.5" rx=".5" fill={C.green} opacity=".4"/>
  </svg>
);
const AskIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1"   width="12" height="2.5" rx=".5" fill={C.red} opacity=".9"/>
    <rect x="1" y="4.5" width="12" height="2.5" rx=".5" fill={C.red} opacity=".5"/>
    <rect x="1" y="8"   width="12" height="2.5" rx=".5" fill={C.red} opacity=".25"/>
    <rect x="1" y="11"  width="12" height="2.5" rx=".5" fill={C.red} opacity=".1"/>
  </svg>
);
const BidIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1"   width="12" height="2.5" rx=".5" fill={C.green} opacity=".9"/>
    <rect x="1" y="4.5" width="12" height="2.5" rx=".5" fill={C.green} opacity=".5"/>
    <rect x="1" y="8"   width="12" height="2.5" rx=".5" fill={C.green} opacity=".25"/>
    <rect x="1" y="11"  width="12" height="2.5" rx=".5" fill={C.green} opacity=".1"/>
  </svg>
);

const ModeBtn = ({ active, onClick, title, children }) => (
  <button onClick={onClick} title={title} style={{
    width: 26, height: 22, borderRadius: 4, cursor: "pointer",
    border: active ? `1px solid rgba(240,185,11,.3)` : "1px solid transparent",
    background: active ? "rgba(240,185,11,.12)" : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 0, transition: "all .15s",
  }}>{children}</button>
);

const DepthToggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)}
    style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", userSelect: "none" }}>
    <span style={{ fontSize: 10, color: C.label, letterSpacing: ".5px" }}>DEPTH</span>
    <div style={{
      width: 30, height: 16, borderRadius: 8, position: "relative",
      background: value ? C.accent : C.textDim, transition: "background .2s",
    }}>
      <div style={{
        position: "absolute", top: 2, left: value ? 16 : 2,
        width: 12, height: 12, borderRadius: "50%", background: "#fff",
        transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.4)",
      }} />
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const OrderBookTrades = () => {
  const [activeTab,   setActiveTab]   = useState("orderbook");
  const [viewMode,    setViewMode]    = useState("both");
  const [depth,       setDepth]       = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);

  const [flashAsks, setFlashAsks] = useState({});
  const [flashBids, setFlashBids] = useState({});
  const prevAsksRef = useRef({});
  const prevBidsRef = useRef({});

  const rawBookRef    = useRef({ asks: [], bids: [] });

  const lastPriceRef  = useRef(0);
  const [lastPrice,   setLastPrice]   = useState(0);
  const [priceDir,    setPriceDir]    = useState("up");

  const [trades, setTrades] = useState([]);

  // ── Rebuild book ──────────────────────────────────────────────────────────
  const rebuildBook = useCallback((refPrice) => {
    const raw = rawBookRef.current;
    if (!raw.asks.length && !raw.bids.length) return;

    const fallbackRef = refPrice > 0 ? refPrice : (() => {
      const ba = Math.min(...raw.asks.map(([p]) => Number(p)).filter(Boolean));
      const bb = Math.max(...raw.bids.map(([p]) => Number(p)).filter(Boolean));
      return isFinite(ba) && isFinite(bb) ? (ba + bb) / 2 : 0;
    })();

    // Determine row count based on view mode
    const rowCount = viewMode === "both" ? ROWS_BOTH : ROWS_SINGLE;

    const newAsks = nearestOrders(raw.asks, "ask", fallbackRef, rowCount);
    const newBids = nearestOrders(raw.bids, "bid", fallbackRef, rowCount);

    const fA = {}, fB = {};
    newAsks.forEach((o) => {
      if (prevAsksRef.current[o.price] !== undefined &&
          prevAsksRef.current[o.price] !== o.qty) fA[o.price] = true;
    });
    newBids.forEach((o) => {
      if (prevBidsRef.current[o.price] !== undefined &&
          prevBidsRef.current[o.price] !== o.qty) fB[o.price] = true;
    });

    const snapA = {}; newAsks.forEach((o) => (snapA[o.price] = o.qty));
    const snapB = {}; newBids.forEach((o) => (snapB[o.price] = o.qty));
    prevAsksRef.current = snapA;
    prevBidsRef.current = snapB;

    setAsks(newAsks);
    setBids(newBids);

    if (Object.keys(fA).length) {
      setFlashAsks(fA);
      setTimeout(() => setFlashAsks({}), 550);
    }
    if (Object.keys(fB).length) {
      setFlashBids(fB);
      setTimeout(() => setFlashBids({}), 550);
    }
  }, [viewMode]);

  // ── Rebuild when viewMode changes ─────────────────────────────────────────
  useEffect(() => {
    rebuildBook(lastPriceRef.current);
  }, [viewMode, rebuildBook]);

  // ── WebSocket setup ──────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(BASE_URL + NAMESPACE, {
      path: WS_PATH,
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 3000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit(EVT_BOOK,  { event: "subscribe", pair: PAIR });
      socket.emit(EVT_TRADE, { event: "subscribe", pair: PAIR });
    });

    socket.on(EVT_BOOK, (data) => {
      if (!data) return;
      rawBookRef.current = {
        asks: data.asks?.length ? data.asks : rawBookRef.current.asks,
        bids: data.bids?.length ? data.bids : rawBookRef.current.bids,
      };
      rebuildBook(lastPriceRef.current);
    });

    socket.on(EVT_TRADE, (data) => {
      if (!data?.p || data?.s !== PAIR) return;

      const newPrice = Number(data.p);
      const dir = newPrice >= (lastPriceRef.current || newPrice) ? "up" : "down";
      lastPriceRef.current = newPrice;

      setLastPrice(newPrice);
      setPriceDir(dir);

      rebuildBook(newPrice);

      const trade = {
        price: newPrice,
        qty:   Number(data.q || data.qty || 0),
        time:  new Date(data.E || Date.now()).toLocaleTimeString("en-IN", {
          hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
        }),
        side:  data.m === true ? "sell" : "buy",
        id:    data.t || Date.now(),
      };

      setTrades((prev) => [trade, ...prev].slice(0, 40));
    });

    socket.on("disconnect",    () => setIsConnected(false));
    socket.on("connect_error", (e) => console.error("WS:", e.message));

    return () => socket.disconnect();
  }, [rebuildBook]);

  // ─── Derived stats ───────────────────────────────────────────────────────
  const nearestAsk = asks.length ? asks[asks.length - 1].price : 0;
  const nearestBid = bids.length ? bids[0].price : 0;

  const midPrice  = lastPrice > 0 ? lastPrice
    : (nearestAsk > 0 && nearestBid > 0 ? (nearestAsk + nearestBid) / 2 : 0);

  const spread    = nearestAsk > 0 && nearestBid > 0 ? nearestAsk - nearestBid : 0;
  const spreadPct = nearestBid > 0 && spread > 0
    ? ((spread / nearestBid) * 100).toFixed(2) : "—";

  const bidTotal = rawBookRef.current.bids.reduce((s, [, q]) => s + Number(q), 0);
  const askTotal = rawBookRef.current.asks.reduce((s, [, q]) => s + Number(q), 0);
  const totalVol = bidTotal + askTotal;
  const bidPct   = totalVol > 0 ? Math.round((bidTotal / totalVol) * 100) : 50;
  const askPct   = 100 - bidPct;

  const askMaxQ  = asks.length ? Math.max(...asks.map((o) => o.qty)) : 1;
  const bidMaxQ  = bids.length ? Math.max(...bids.map((o) => o.qty)) : 1;

  const tBuyVol  = trades.filter((t) => t.side === "buy").reduce((a, t) => a + t.qty, 0);
  const tSellVol = trades.filter((t) => t.side === "sell").reduce((a, t) => a + t.qty, 0);
  const tTotal   = tBuyVol + tSellVol;
  const tBuyPct  = tTotal > 0 ? Math.round((tBuyVol / tTotal) * 100) : 50;
  const tSellPct = 100 - tBuyPct;

  // ─── Common styles ───────────────────────────────────────────────────────
  const colLbl = { fontSize: 10, color: C.label, letterSpacing: "0.8px", textTransform: "uppercase", fontWeight: 600 };
  const scrollBox = {
    overflowY: "auto", display: "flex", flexDirection: "column",
    scrollbarWidth: "thin", scrollbarColor: `${C.textDim} transparent`,
  };

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      background: C.bg, border: `1px solid ${C.border}`,
      borderRadius: 10, overflow: "hidden",
      fontFamily: C.mono, boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
    }}>

      {/* ── TABS + LIVE DOT ── */}
      <div style={{
        display: "flex", alignItems: "center",
        borderBottom: `1px solid ${C.border}`,
        background: C.bgDeep, padding: "0 4px", flexShrink: 0,
      }}>
        {[["orderbook", "Order Book"], ["trades", "Last Trades"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: "10px 16px", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.6px", fontFamily: "inherit",
            border: "none", cursor: "pointer", background: "transparent",
            color: activeTab === id ? C.accent : C.label,
            borderBottom: `2px solid ${activeTab === id ? C.accent : "transparent"}`,
            transition: "all .18s", textTransform: "uppercase", marginBottom: -1,
          }}>{lbl}</button>
        ))}
        <div style={{ marginLeft: "auto", marginRight: 10, display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: isConnected ? C.green : C.textDim,
            boxShadow: isConnected ? `0 0 5px ${C.green}` : "none",
            transition: "all .3s",
          }} />
          <span style={{ fontSize: 9, color: isConnected ? C.green : C.textDim, letterSpacing: ".5px" }}>
            {isConnected ? "LIVE" : "CONNECTING"}
          </span>
        </div>
      </div>

      {/* ════════ ORDER BOOK ════════ */}
      {activeTab === "orderbook" && (
        <>
          {/* Sub-toolbar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 12px", background: C.bgDeep,
            borderBottom: `1px solid ${C.border}`, flexShrink: 0, gap: 8,
          }}>
            <div style={{ display: "flex", gap: 4 }}>
              <ModeBtn active={viewMode === "both"} onClick={() => setViewMode("both")} title="Both"><SplitIcon /></ModeBtn>
              <ModeBtn active={viewMode === "asks"} onClick={() => setViewMode("asks")} title="Asks only"><AskIcon /></ModeBtn>
              <ModeBtn active={viewMode === "bids"} onClick={() => setViewMode("bids")} title="Bids only"><BidIcon /></ModeBtn>
            </div>
            {depth && (
              <span style={{ fontSize: 9, color: C.label }}>
                <span style={{ color: C.red }}>█</span> ASK &nbsp;
                <span style={{ color: C.green }}>█</span> BID
              </span>
            )}
            <DepthToggle value={depth} onChange={setDepth} />
          </div>

          {/* Col headers */}
          <div style={{ display: "flex", justifyContent: "space-between",
            padding: "5px 12px", background: C.bgDeep,
            borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            <span style={colLbl}>Price (INR)</span>
            <span style={colLbl}>Quantity</span>
          </div>

          {/* Book body - fixed height with scroll */}
          <div style={{
            ...scrollBox,
            maxHeight: viewMode === "both" ? 450 : 480,
            minHeight: viewMode === "both" ? 450 : 480,
          }}>

            {/* ASKS */}
            {(viewMode === "both" || viewMode === "asks") && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {asks.map((row) => (
                  <OrderRow
                    key={row.price}
                    {...row} side="ask" maxQ={depth ? askMaxQ : 1}
                    flash={!!flashAsks[row.price]}
                  />
                ))}
              </div>
            )}

            {/* SPREAD ROW */}
            {viewMode === "both" && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "7px 12px", background: C.spreadBg, flexShrink: 0,
                borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{
                    fontSize: 17, fontWeight: 700,
                    color: priceDir === "up" ? C.green : C.red,
                    letterSpacing: "-0.3px", fontVariantNumeric: "tabular-nums",
                    transition: "color .3s",
                  }}>
                    {midPrice > 0 ? fmtPrice(midPrice) : "—"}
                  </span>
                  <span style={{ fontSize: 13, color: priceDir === "up" ? C.green : C.red }}>
                    {priceDir === "up" ? "↑" : "↓"}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: C.label, letterSpacing: ".4px" }}>
                  Spread <span style={{ color: C.text, fontWeight: 600 }}>{spreadPct}%</span>
                </span>
              </div>
            )}

            {/* BIDS */}
            {(viewMode === "both" || viewMode === "bids") && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {bids.map((row) => (
                  <OrderRow
                    key={row.price}
                    {...row} side="bid" maxQ={depth ? bidMaxQ : 1}
                    flash={!!flashBids[row.price]}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {asks.length === 0 && bids.length === 0 && (
              <div style={{ flex: 1, display: "flex", alignItems: "center",
                justifyContent: "center", color: C.label, fontSize: 12 }}>
                Connecting to order book…
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: "7px 12px", borderTop: `1px solid ${C.border}`,
            background: C.bgDeep, flexShrink: 0,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <div>
                <div style={{ fontSize: 9, color: C.label, marginBottom: 2, letterSpacing: ".4px" }}>BID TOTAL</div>
                <div style={{ fontSize: 11, color: C.green, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {bidTotal > 0 ? bidTotal.toFixed(4) : "—"} BTC
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: C.label, marginBottom: 2, letterSpacing: ".4px" }}>ASK TOTAL</div>
                <div style={{ fontSize: 11, color: C.red, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {askTotal > 0 ? askTotal.toFixed(4) : "—"} BTC
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: C.green, fontWeight: 700, minWidth: 28 }}>{bidPct}%</span>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.redDim, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${bidPct}%`, background: C.green,
                  borderRadius: 2, transition: "width .5s ease",
                }} />
              </div>
              <span style={{ fontSize: 10, color: C.red, fontWeight: 700, minWidth: 28, textAlign: "right" }}>
                {askPct}%
              </span>
            </div>
          </div>
        </>
      )}

      {/* ════════ LAST TRADES ════════ */}
      {activeTab === "trades" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between",
            padding: "7px 12px", background: C.bgDeep,
            borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            <span style={colLbl}>Price (INR)</span>
            <span style={colLbl}>Qty</span>
            <span style={colLbl}>Time</span>
          </div>

          <div style={{
            ...scrollBox,
            maxHeight: 450,
            minHeight: 450,
          }}>
            {trades.map((t, i) => (
              <TradeRow key={`${t.id}-${i}`} {...t} isNew={i === 0} />
            ))}
            {trades.length === 0 && (
              <div style={{ flex: 1, display: "flex", alignItems: "center",
                justifyContent: "center", color: C.label, fontSize: 12 }}>
                Waiting for trades…
              </div>
            )}
          </div>

          {/* Trade buy/sell summary */}
          <div style={{
            padding: "7px 12px", borderTop: `1px solid ${C.border}`,
            background: C.bgDeep, flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: C.label, marginBottom: 2 }}>BUY</div>
                <div style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>{tBuyPct}%</div>
              </div>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.redDim, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${tBuyPct}%`, background: C.green,
                  borderRadius: 2, transition: "width .5s ease",
                }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: C.label, marginBottom: 2 }}>SELL</div>
                <div style={{ fontSize: 11, color: C.red, fontWeight: 700 }}>{tSellPct}%</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderBookTrades;