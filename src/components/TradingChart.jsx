// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { io } from "socket.io-client";

// // ─── CONFIG ──────────────────────────────────────────────────────────────────
// const API_URL =
//   "http://localhost:3000/api/coinswitch/spot/ticker/single?symbol=BTC/INR&exchange=coinswitchx";
// const BASE_URL = "wss://ws.coinswitch.co";
// const NAMESPACE = "/coinswitchx";
// const PAIR = "BTC,INR";
// const EVENT_NAME = "FETCH_TRADES_CS_PRO";

// // Timeframe config: label → TradingView interval
// const TIMEFRAMES = [
//   { label: "1m",  interval: "1" },
//   { label: "5m",  interval: "5" },
//   { label: "15m", interval: "15" },
//   { label: "30m", interval: "30" },
//   { label: "1H",  interval: "60" },
//   { label: "4H",  interval: "240" },
//   { label: "1D",  interval: "D" },
//   { label: "1W",  interval: "W" },
// ];

// const CHART_TYPES = [
//   { label: "Candles", style: "1" },
//   { label: "Line",    style: "2" },
//   { label: "Area",    style: "3" },
//   { label: "Bars",    style: "0" },
// ];

// const TradingChart = () => {
//   const containerRef = useRef(null);
//   const widgetRef = useRef(null);
//   const socketRef = useRef(null);
//   const scriptLoadedRef = useRef(false);

//   const [currentPrice, setCurrentPrice] = useState("6700292");
//   const [prevPrice, setPrevPrice] = useState("6700292");
//   const [priceFlash, setPriceFlash] = useState(""); // "up" | "down" | ""
//   const [activeTimeframe, setActiveTimeframe] = useState("60");
//   const [activeStyle, setActiveStyle] = useState("1");
//   const [isConnected, setIsConnected] = useState(false);
//   const [tickerData, setTickerData] = useState({
//     percentageChange: "0.35",
//     highPrice: "6791000",
//     lowPrice: "6556987",
//     quoteVolume: "7672219",
//     baseVolume: "1.15",
//   });

//   // ── Fetch full ticker ──────────────────────────────────────────────────────
//   const fetchTicker = useCallback(async () => {
//     try {
//       const res = await fetch(API_URL);
//       const json = await res.json();
//       if (json.success) {
//         const d = json.data.data.coinswitchx;
//         setTickerData({
//           percentageChange: d.percentageChange,
//           highPrice:        d.highPrice,
//           lowPrice:         d.lowPrice,
//           quoteVolume:      d.quoteVolume,
//           baseVolume:       d.baseVolume,
//         });
//       }
//     } catch (e) {
//       console.error("Ticker fetch error:", e);
//     }
//   }, []);

//   // ── Handle live trade ──────────────────────────────────────────────────────
//   const handleTrade = useCallback(
//     (data) => {
//       if (data?.s === PAIR && data?.p) {
//         setPrevPrice((prev) => {
//           const dir = Number(data.p) >= Number(prev) ? "up" : "down";
//           setPriceFlash(dir);
//           setTimeout(() => setPriceFlash(""), 600);
//           return prev;
//         });
//         setCurrentPrice(data.p);
//         fetchTicker();
//       }
//     },
//     [fetchTicker]
//   );

//   // ── WebSocket setup ────────────────────────────────────────────────────────
//   useEffect(() => {
//     fetchTicker();

//     const socket = io(BASE_URL + NAMESPACE, {
//       path: "/pro/realtime-rates-socket/spot/coinswitchx",
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionDelay: 3000,
//     });
//     socketRef.current = socket;

//     socket.on("connect", () => {
//       setIsConnected(true);
//       socket.emit(EVENT_NAME, { event: "subscribe", pair: PAIR });
//     });
//     socket.on(EVENT_NAME, handleTrade);
//     socket.on("disconnect", () => setIsConnected(false));
//     socket.on("connect_error", (e) => console.error("WS error:", e.message));

//     return () => socket.disconnect();
//   }, [fetchTicker, handleTrade]);

//   // ── Build / Rebuild TradingView widget ─────────────────────────────────────
//   const buildWidget = useCallback((interval, style) => {
//     if (!containerRef.current || !window.TradingView) return;

//     // Destroy old widget
//     if (widgetRef.current && typeof widgetRef.current.remove === "function") {
//       widgetRef.current.remove();
//     }
//     widgetRef.current = null;

//     // Clear container
//     const container = document.getElementById("tradingview_chart_container");
//     if (container) container.innerHTML = "";

//     widgetRef.current = new window.TradingView.widget({
//       autosize: true,
//       symbol: "BITSTAMP:BTCUSD * FX_IDC:USDINR",
//       interval,
//       timezone: "Asia/Kolkata",
//       theme: "dark",
//       style,
//       locale: "en",
//       toolbar_bg: "#0b0e17",
//       enable_publishing: false,
//       hide_top_toolbar: true,      // we have our own toolbar
//       hide_legend: false,
//       save_image: false,
//       backgroundColor: "#0b0e17",
//       gridColor: "rgba(255,255,255,0.03)",
//       studies: [
//         "MAExp@tv-basicstudies",
//         "MASimple@tv-basicstudies",
//         "Volume@tv-basicstudies",
//       ],
//       studies_overrides: {
//         "moving average exponential.length": 9,
//         "moving average exponential.plot.color": "#a855f7",
//         "moving average exponential.plot.linewidth": 2,
//         "moving average simple.length": 30,
//         "moving average simple.plot.color": "#f59e0b",
//         "moving average simple.plot.linewidth": 2,
//       },
//       overrides: {
//         "mainSeriesProperties.candleStyle.upColor":           "#22c55e",
//         "mainSeriesProperties.candleStyle.downColor":         "#ef4444",
//         "mainSeriesProperties.candleStyle.borderUpColor":     "#22c55e",
//         "mainSeriesProperties.candleStyle.borderDownColor":   "#ef4444",
//         "mainSeriesProperties.candleStyle.wickUpColor":       "#22c55e",
//         "mainSeriesProperties.candleStyle.wickDownColor":     "#ef4444",
//         "paneProperties.background":                          "#0b0e17",
//         "paneProperties.backgroundType":                      "solid",
//         "paneProperties.vertGridProperties.color":            "rgba(255,255,255,0.03)",
//         "paneProperties.horzGridProperties.color":            "rgba(255,255,255,0.03)",
//         "scalesProperties.textColor":                         "#6b7280",
//         "scalesProperties.lineColor":                         "rgba(255,255,255,0.06)",
//       },
//       container_id: "tradingview_chart_container",
//       withdateranges: true,
//       allow_symbol_change: false,
//       details: false,
//       hotlist: false,
//       calendar: false,
//     });
//   }, []);

//   // ── Load TradingView script once ───────────────────────────────────────────
//   useEffect(() => {
//     if (scriptLoadedRef.current) {
//       buildWidget(activeTimeframe, activeStyle);
//       return;
//     }

//     const existing = document.getElementById("tv-script");
//     if (existing) existing.remove();

//     const script = document.createElement("script");
//     script.id = "tv-script";
//     script.src = "https://s3.tradingview.com/tv.js";
//     script.async = true;
//     script.onload = () => {
//       scriptLoadedRef.current = true;
//       buildWidget(activeTimeframe, activeStyle);
//     };
//     document.body.appendChild(script);

//     return () => {
//       if (script.parentNode) script.parentNode.removeChild(script);
//     };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Rebuild on timeframe / style change ────────────────────────────────────
//   useEffect(() => {
//     if (scriptLoadedRef.current) {
//       buildWidget(activeTimeframe, activeStyle);
//     }
//   }, [activeTimeframe, activeStyle, buildWidget]);

//   // ── Resize observer ────────────────────────────────────────────────────────
//   useEffect(() => {
//     const ro = new ResizeObserver(() => {
//       if (widgetRef.current?.activeChart) {
//         try { widgetRef.current.activeChart().resize(); } catch (_) {}
//       }
//     });
//     if (containerRef.current) ro.observe(containerRef.current);
//     return () => ro.disconnect();
//   }, []);

//   // ── Helpers ────────────────────────────────────────────────────────────────
//   const fmt   = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
//   const fmtVol = (n) => Number(n).toLocaleString("en-IN");
//   const isUp  = Number(tickerData.percentageChange) >= 0;

//   const priceColor =
//     priceFlash === "up"   ? "#22c55e"
//     : priceFlash === "down" ? "#ef4444"
//     : "white";

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         background: "#0b0e17",
//         border: "1px solid rgba(255,255,255,0.07)",
//         borderRadius: "12px",
//         overflow: "hidden",
//         height: "100%",
//         fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//         boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
//         maxWidth:"750px",
//         width: "100%",
//       }}
//     >
//       {/* ── TOP HEADER ───────────────────────────────────────────────────── */}
//       <div
//         style={{
//           padding: "10px 16px",
//           borderBottom: "1px solid rgba(255,255,255,0.06)",
//           background: "#080b12",
//           display: "flex",
//           alignItems: "center",
//           flexWrap: "wrap",
//           gap: "16px",
//         }}
//       >
//         {/* Coin identity */}
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <div
//             style={{
//               width: 34, height: 34,
//               background: "linear-gradient(135deg,#f7931a,#e07b10)",
//               borderRadius: "50%",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: 16, fontWeight: 700, color: "#fff",
//               boxShadow: "0 0 12px rgba(247,147,26,0.35)",
//             }}
//           >
//             ₿
//           </div>
//           <div>
//             <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.5px" }}>
//               BTC / INR
//               <span style={{ marginLeft: 6, color: "#f59e0b", fontSize: 13 }}>★</span>
//             </div>
//             <div style={{ color: "#4b5563", fontSize: 11, marginTop: 1 }}>CoinSwitchX · Spot</div>
//           </div>
//         </div>

//         {/* Live price */}
//         <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
//           <span
//             style={{
//               fontSize: 22,
//               fontWeight: 700,
//               color: priceColor,
//               transition: "color 0.3s ease",
//               letterSpacing: "-0.5px",
//             }}
//           >
//             {fmt(currentPrice)}
//           </span>
//           <span
//             style={{
//               fontSize: 13,
//               fontWeight: 600,
//               color: isUp ? "#22c55e" : "#ef4444",
//               background: isUp ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
//               padding: "2px 7px",
//               borderRadius: 5,
//               border: `1px solid ${isUp ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
//             }}
//           >
//             {isUp ? "▲" : "▼"} {Math.abs(tickerData.percentageChange)}%
//           </span>
//         </div>

//         {/* Stats row */}
//         <div style={{ display: "flex", gap: 20, marginLeft: "auto", flexWrap: "wrap" }}>
//           {[
//             { label: "24H High", value: fmt(tickerData.highPrice), color: "#22c55e" },
//             { label: "24H Low",  value: fmt(tickerData.lowPrice),  color: "#ef4444" },
//             { label: "Vol (INR)",value: fmtVol(tickerData.quoteVolume), color: "#9ca3af" },
//             { label: "Vol (BTC)",value: fmtVol(tickerData.baseVolume),  color: "#9ca3af" },
//           ].map(({ label, value, color }) => (
//             <div key={label} style={{ textAlign: "right" }}>
//               <div style={{ fontSize: 10, color: "#4b5563", marginBottom: 2 }}>{label}</div>
//               <div style={{ fontSize: 12, color, fontWeight: 600 }}>{value}</div>
//             </div>
//           ))}
//         </div>

//         {/* WS status dot */}
//         <div
//           title={isConnected ? "Live" : "Reconnecting…"}
//           style={{
//             width: 8, height: 8, borderRadius: "50%",
//             background: isConnected ? "#22c55e" : "#6b7280",
//             boxShadow: isConnected ? "0 0 6px #22c55e" : "none",
//             flexShrink: 0,
//           }}
//         />
//       </div>

//       {/* ── TOOLBAR ──────────────────────────────────────────────────────── */}
//       <div
//         style={{
//           padding: "6px 16px",
//           borderBottom: "1px solid rgba(255,255,255,0.05)",
//           background: "#080b12",
//           display: "flex",
//           alignItems: "center",
//           gap: 4,
//           flexWrap: "wrap",
//         }}
//       >
//         {/* Timeframe buttons */}
//         {TIMEFRAMES.map((tf) => (
//           <button
//             key={tf.interval}
//             onClick={() => setActiveTimeframe(tf.interval)}
//             style={{
//               padding: "4px 10px",
//               fontSize: 12,
//               fontWeight: 600,
//               fontFamily: "inherit",
//               borderRadius: 6,
//               border: "none",
//               cursor: "pointer",
//               transition: "all 0.15s ease",
//               background:
//                 activeTimeframe === tf.interval
//                   ? "rgba(245,158,11,0.18)"
//                   : "transparent",
//               color:
//                 activeTimeframe === tf.interval
//                   ? "#f59e0b"
//                   : "#6b7280",
//               outline:
//                 activeTimeframe === tf.interval
//                   ? "1px solid rgba(245,158,11,0.4)"
//                   : "none",
//             }}
//           >
//             {tf.label}
//           </button>
//         ))}

//         {/* Divider */}
//         <div
//           style={{
//             width: 1, height: 18,
//             background: "rgba(255,255,255,0.08)",
//             margin: "0 6px",
//           }}
//         />

//         {/* Chart type buttons */}
//         {CHART_TYPES.map((ct) => (
//           <button
//             key={ct.style}
//             onClick={() => setActiveStyle(ct.style)}
//             style={{
//               padding: "4px 10px",
//               fontSize: 12,
//               fontWeight: 600,
//               fontFamily: "inherit",
//               borderRadius: 6,
//               border: "none",
//               cursor: "pointer",
//               transition: "all 0.15s ease",
//               background:
//                 activeStyle === ct.style
//                   ? "rgba(168,85,247,0.18)"
//                   : "transparent",
//               color:
//                 activeStyle === ct.style
//                   ? "#a855f7"
//                   : "#6b7280",
//               outline:
//                 activeStyle === ct.style
//                   ? "1px solid rgba(168,85,247,0.4)"
//                   : "none",
//             }}
//           >
//             {ct.label}
//           </button>
//         ))}

//         {/* MA legend (right-aligned) */}
//         <div style={{ marginLeft: "auto", display: "flex", gap: 14, alignItems: "center" }}>
//           <span style={{ fontSize: 11, color: "#6b7280" }}>
//             MA 30 <span style={{ color: "#f59e0b", fontWeight: 600 }}>—</span>
//           </span>
//           <span style={{ fontSize: 11, color: "#6b7280" }}>
//             EMA 9 <span style={{ color: "#a855f7", fontWeight: 600 }}>—</span>
//           </span>
//         </div>
//       </div>

//       {/* ── CHART ─────────────────────────────────────────────────────────── */}
//       <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
//         <div
//           id="tradingview_chart_container"
//           style={{ width: "100%", height: "100%" }}
//         />
//       </div>

//       {/* ── FOOTER ────────────────────────────────────────────────────────── */}
//       <div
//         style={{
//           padding: "6px 16px",
//           borderTop: "1px solid rgba(255,255,255,0.05)",
//           background: "#080b12",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           fontSize: 11,
//           color: "#374151",
//         }}
//       >
//         <span>Powered by TradingView · BTC/INR via CoinSwitchX</span>
//         <span>
//           {isConnected ? (
//             <span style={{ color: "#22c55e" }}>● LIVE</span>
//           ) : (
//             <span style={{ color: "#6b7280" }}>○ Reconnecting…</span>
//           )}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default TradingChart;







import React, { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API_URL =
  "http://localhost:3000/api/coinswitch/spot/ticker/single?symbol=BTC/INR&exchange=coinswitchx";
const BASE_URL = "wss://ws.coinswitch.co";
const NAMESPACE = "/coinswitchx";
const PAIR = "BTC,INR";
const EVENT_NAME = "FETCH_TRADES_CS_PRO";

const TIMEFRAMES = [
  { label: "1m",  interval: "1" },
  { label: "5m",  interval: "5" },
  { label: "15m", interval: "15" },
  { label: "30m", interval: "30" },
  { label: "1H",  interval: "60" },
  { label: "4H",  interval: "240" },
  { label: "1D",  interval: "D" },
  { label: "1W",  interval: "W" },
];

const CHART_TYPES = [
  { label: "Candles", style: "1" },
  { label: "Line",    style: "2" },
  { label: "Area",    style: "3" },
  { label: "Bars",    style: "0" },
];

const TradingChart = () => {
  const containerRef   = useRef(null);
  const widgetRef      = useRef(null);
  const socketRef      = useRef(null);
  const scriptLoadedRef = useRef(false);

  const [currentPrice, setCurrentPrice] = useState("6700292");
  const [prevPrice,    setPrevPrice]    = useState("6700292");
  const [priceFlash,   setPriceFlash]   = useState("");
  const [activeTimeframe, setActiveTimeframe] = useState("60");
  const [activeStyle,     setActiveStyle]     = useState("1");
  const [isConnected,     setIsConnected]     = useState(false);
  const [tickerData, setTickerData] = useState({
    percentageChange: "0.35",
    highPrice:   "6791000",
    lowPrice:    "6556987",
    quoteVolume: "7672219",
    baseVolume:  "1.15",
  });

  // ── Fetch ticker ──────────────────────────────────────────────────────────
  const fetchTicker = useCallback(async () => {
    try {
      const res  = await fetch(API_URL);
      const json = await res.json();
      if (json.success) {
        const d = json.data.data.coinswitchx;
        setTickerData({
          percentageChange: d.percentageChange,
          highPrice:   d.highPrice,
          lowPrice:    d.lowPrice,
          quoteVolume: d.quoteVolume,
          baseVolume:  d.baseVolume,
        });
      }
    } catch (e) {
      console.error("Ticker fetch error:", e);
    }
  }, []);

  // ── Handle live trade ─────────────────────────────────────────────────────
  const handleTrade = useCallback(
    (data) => {
      if (data?.s === PAIR && data?.p) {
        setPrevPrice((prev) => {
          const dir = Number(data.p) >= Number(prev) ? "up" : "down";
          setPriceFlash(dir);
          setTimeout(() => setPriceFlash(""), 600);
          return prev;
        });
        setCurrentPrice(data.p);
        fetchTicker();
      }
    },
    [fetchTicker]
  );

  // ── WebSocket ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchTicker();
    const socket = io(BASE_URL + NAMESPACE, {
      path: "/pro/realtime-rates-socket/spot/coinswitchx",
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 3000,
    });
    socketRef.current = socket;
    socket.on("connect",       () => { setIsConnected(true); socket.emit(EVENT_NAME, { event: "subscribe", pair: PAIR }); });
    socket.on(EVENT_NAME,      handleTrade);
    socket.on("disconnect",    () => setIsConnected(false));
    socket.on("connect_error", (e) => console.error("WS error:", e.message));
    return () => socket.disconnect();
  }, [fetchTicker, handleTrade]);

  // ── Build widget ──────────────────────────────────────────────────────────
  const buildWidget = useCallback((interval, style) => {
    if (!containerRef.current || !window.TradingView) return;
    if (widgetRef.current?.remove) widgetRef.current.remove();
    widgetRef.current = null;
    const container = document.getElementById("tradingview_chart_container");
    if (container) container.innerHTML = "";

    widgetRef.current = new window.TradingView.widget({
      autosize: true,
      symbol: "BITSTAMP:BTCUSD * FX_IDC:USDINR",
      interval,
      timezone: "Asia/Kolkata",
      theme: "dark",
      style,
      locale: "en",
      toolbar_bg: "#0b0e17",
      enable_publishing: false,
      hide_top_toolbar: true,
      hide_legend: false,
      save_image: false,
      backgroundColor: "#0b0e17",
      gridColor: "rgba(255,255,255,0.03)",
      studies: ["MAExp@tv-basicstudies", "MASimple@tv-basicstudies", "Volume@tv-basicstudies"],
      studies_overrides: {
        "moving average exponential.length": 9,
        "moving average exponential.plot.color": "#a855f7",
        "moving average exponential.plot.linewidth": 2,
        "moving average simple.length": 30,
        "moving average simple.plot.color": "#f59e0b",
        "moving average simple.plot.linewidth": 2,
      },
      overrides: {
        "mainSeriesProperties.candleStyle.upColor":         "#22c55e",
        "mainSeriesProperties.candleStyle.downColor":       "#ef4444",
        "mainSeriesProperties.candleStyle.borderUpColor":   "#22c55e",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
        "mainSeriesProperties.candleStyle.wickUpColor":     "#22c55e",
        "mainSeriesProperties.candleStyle.wickDownColor":   "#ef4444",
        "paneProperties.background":                        "#0b0e17",
        "paneProperties.backgroundType":                    "solid",
        "paneProperties.vertGridProperties.color":          "rgba(255,255,255,0.03)",
        "paneProperties.horzGridProperties.color":          "rgba(255,255,255,0.03)",
        "scalesProperties.textColor":                       "#6b7280",
        "scalesProperties.lineColor":                       "rgba(255,255,255,0.06)",
      },
      container_id: "tradingview_chart_container",
      withdateranges: true,
      allow_symbol_change: false,
      details: false,
      hotlist: false,
      calendar: false,
    });
  }, []);

  // ── Script load ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (scriptLoadedRef.current) { buildWidget(activeTimeframe, activeStyle); return; }
    const existing = document.getElementById("tv-script");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id  = "tv-script";
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => { scriptLoadedRef.current = true; buildWidget(activeTimeframe, activeStyle); };
    document.body.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (scriptLoadedRef.current) buildWidget(activeTimeframe, activeStyle); }, [activeTimeframe, activeStyle, buildWidget]);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (widgetRef.current?.activeChart) { try { widgetRef.current.activeChart().resize(); } catch (_) {} }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const fmt    = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const fmtVol = (n) => Number(n).toLocaleString("en-IN");
  const isUp   = Number(tickerData.percentageChange) >= 0;
  const priceColor = priceFlash === "up" ? "#22c55e" : priceFlash === "down" ? "#ef4444" : "#ffffff";

  // ── Shared style tokens ───────────────────────────────────────────────────
  const S = {
    bg:     "#0b0e17",
    bgBar:  "#080b12",
    border: "1px solid rgba(255,255,255,0.06)",
    mono:   "'JetBrains Mono', 'Fira Code', monospace",
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      background: S.bg, border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12, overflow: "hidden", height: "100%",
      fontFamily: S.mono, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      width: "100%",
    }}>

      {/* ══ HEADER — ROW 1: identity + price + dot ══ */}
      <div style={{
        padding: "10px 14px 8px",
        background: S.bgBar,
        borderBottom: S.border,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "nowrap",
        minWidth: 0,
      }}>

        {/* Coin icon + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, flexShrink: 0,
            background: "linear-gradient(135deg,#f7931a,#e07b10)",
            borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 15, fontWeight: 700,
            color: "#fff", boxShadow: "0 0 10px rgba(247,147,26,0.35)",
          }}>₿</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "0.4px", whiteSpace: "nowrap" }}>
              BTC / INR
              <span style={{ marginLeft: 5, color: "#f59e0b", fontSize: 12 }}>★</span>
            </div>
            <div style={{ color: "#4b5563", fontSize: 10, marginTop: 1 }}>CoinSwitchX · Spot</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

        {/* Live price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 7, flexShrink: 0 }}>
          <span style={{
            fontSize: 20, fontWeight: 700, color: priceColor,
            transition: "color 0.3s ease", letterSpacing: "-0.5px",
            fontVariantNumeric: "tabular-nums",
          }}>
            {fmt(currentPrice)}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: isUp ? "#22c55e" : "#ef4444",
            background: isUp ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            padding: "2px 7px", borderRadius: 5,
            border: `1px solid ${isUp ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
            whiteSpace: "nowrap",
          }}>
            {isUp ? "▲" : "▼"} {Math.abs(tickerData.percentageChange)}%
          </span>
        </div>

        {/* ── 24H STATS — horizontally scrollable strip on smaller widths ── */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 0,
          overflow: "hidden",
          minWidth: 0,
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            minWidth: 0,
            paddingLeft: 4,
          }}>
            {[
              { label: "24H High", value: fmt(tickerData.highPrice),    color: "#22c55e" },
              { label: "24H Low",  value: fmt(tickerData.lowPrice),     color: "#ef4444" },
              { label: "Vol INR",  value: fmtVol(tickerData.quoteVolume), color: "#9ca3af" },
              { label: "Vol BTC",  value: fmtVol(tickerData.baseVolume),  color: "#9ca3af" },
            ].map(({ label, value, color }, i, arr) => (
              <React.Fragment key={label}>
                <div style={{ textAlign: "center", padding: "0 10px", flexShrink: 0 }}>
                  <div style={{ fontSize: 9, color: "#4b5563", marginBottom: 2, letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 11, color, fontWeight: 600, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                    {value}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* WS dot */}
        <div
          title={isConnected ? "Live" : "Reconnecting…"}
          style={{
            width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
            background: isConnected ? "#22c55e" : "#6b7280",
            boxShadow: isConnected ? "0 0 6px #22c55e" : "none",
          }}
        />
      </div>

      {/* ══ TOOLBAR ══ */}
      <div style={{
        padding: "5px 14px",
        borderBottom: S.border,
        background: S.bgBar,
        display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
      }}>
        {/* Timeframe buttons */}
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.interval}
            onClick={() => setActiveTimeframe(tf.interval)}
            style={{
              padding: "4px 9px", fontSize: 11, fontWeight: 600, fontFamily: "inherit",
              borderRadius: 5, border: "none", cursor: "pointer", transition: "all 0.15s",
              background: activeTimeframe === tf.interval ? "rgba(245,158,11,0.18)" : "transparent",
              color:      activeTimeframe === tf.interval ? "#f59e0b" : "#6b7280",
              outline:    activeTimeframe === tf.interval ? "1px solid rgba(245,158,11,0.35)" : "none",
            }}
          >{tf.label}</button>
        ))}

        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

        {/* Chart type buttons */}
        {CHART_TYPES.map((ct) => (
          <button
            key={ct.style}
            onClick={() => setActiveStyle(ct.style)}
            style={{
              padding: "4px 9px", fontSize: 11, fontWeight: 600, fontFamily: "inherit",
              borderRadius: 5, border: "none", cursor: "pointer", transition: "all 0.15s",
              background: activeStyle === ct.style ? "rgba(168,85,247,0.18)" : "transparent",
              color:      activeStyle === ct.style ? "#a855f7" : "#6b7280",
              outline:    activeStyle === ct.style ? "1px solid rgba(168,85,247,0.35)" : "none",
            }}
          >{ct.label}</button>
        ))}

        {/* MA legend */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#6b7280", whiteSpace: "nowrap" }}>
            MA 30 <span style={{ color: "#f59e0b", fontWeight: 700 }}>—</span>
          </span>
          <span style={{ fontSize: 10, color: "#6b7280", whiteSpace: "nowrap" }}>
            EMA 9 <span style={{ color: "#a855f7", fontWeight: 700 }}>—</span>
          </span>
        </div>
      </div>

      {/* ══ CHART ══ */}
      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
        <div id="tradingview_chart_container" style={{ width: "100%", height: "100%" }} />
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{
        padding: "5px 14px",
        borderTop: S.border,
        background: S.bgBar,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontSize: 10, color: "#374151",
        flexWrap: "nowrap", gap: 8,
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Powered by TradingView · BTC/INR via CoinSwitchX
        </span>
        <span style={{ flexShrink: 0 }}>
          {isConnected
            ? <span style={{ color: "#22c55e" }}>● LIVE</span>
            : <span style={{ color: "#6b7280" }}>○ Reconnecting…</span>}
        </span>
      </div>
    </div>
  );
};

export default TradingChart;