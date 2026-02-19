import React, { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useTradingContext } from "../context/TradingContext";

// ─── TIMEFRAMES & CHART TYPES ────────────────────────────────────────────────
const TIMEFRAMES = [
  { label: "1m", interval: "1" },
  { label: "5m", interval: "5" },
  { label: "15m", interval: "15" },
  { label: "30m", interval: "30" },
  { label: "1H", interval: "60" },
  { label: "4H", interval: "240" },
  { label: "1D", interval: "D" },
  { label: "1W", interval: "W" },
];

const CHART_TYPES = [
  { label: "Candles", style: "1" },
  { label: "Line", style: "2" },
  { label: "Area", style: "3" },
  { label: "Bars", style: "0" },
];

// ─── DYNAMIC TV SYMBOL MAPPING ───────────────────────────────────────────────
// Maps base coin → TradingView symbol (INR proxy via USDINR FX rate)
const TV_SYMBOL_MAP = {
  BTC: "BITSTAMP:BTCUSD * FX_IDC:USDINR",
  ETH: "BITSTAMP:ETHUSD * FX_IDC:USDINR",
  SOL: "COINBASE:SOLUSD * FX_IDC:USDINR",
  BNB: "BINANCE:BNBUSDT * FX_IDC:USDINR",
  XRP: "BITSTAMP:XRPUSD * FX_IDC:USDINR",
  ADA: "BINANCE:ADAUSDT * FX_IDC:USDINR",
  DOGE: "BINANCE:DOGEUSDT * FX_IDC:USDINR",
  MATIC: "BINANCE:MATICUSDT * FX_IDC:USDINR",
  DOT: "BINANCE:DOTUSDT * FX_IDC:USDINR",
  AVAX: "BINANCE:AVAXUSDT * FX_IDC:USDINR",
  SHIB: "BINANCE:SHIBUSDT * FX_IDC:USDINR",
  LTC: "BITSTAMP:LTCUSD * FX_IDC:USDINR",
  LINK: "BINANCE:LINKUSDT * FX_IDC:USDINR",
  UNI: "BINANCE:UNIUSDT * FX_IDC:USDINR",
  ATOM: "BINANCE:ATOMUSDT * FX_IDC:USDINR",
  TRX: "BINANCE:TRXUSDT * FX_IDC:USDINR",
  // For unknown pairs → fallback to BINANCE:{BASE}USDT * USDINR

  BAN: "BITGET:BANUSDT * FX_IDC:USDINR",
  LIGHT: "BITGET:LIGHTUSDT * FX_IDC:USDINR",
  USDT: "FX_IDC:USDINR",
};

const getTVSymbol = (symbol) => {
  const base = symbol?.split("/")[0]?.toUpperCase() || "BTC";
  return TV_SYMBOL_MAP[base] || `BINANCE:${base}USDT * FX_IDC:USDINR`;
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const TradingChart = () => {
  const { selectedPair } = useTradingContext();

  const SYMBOL = selectedPair?.symbol || "BTC/INR";
  const EXCHANGE = selectedPair?.exchange || "coinswitchx";
  const BASE_PAIR = SYMBOL.replace("/", ",");

  const TICKER_API = `http://159.89.146.245:3535/api/coinswitch/spot/ticker/single?symbol=${SYMBOL}&exchange=${EXCHANGE}`;

  const containerRef = useRef(null);
  const widgetRef = useRef(null);
  const socketRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  // Track previous SYMBOL to detect changes
  const prevSymbolRef = useRef(SYMBOL);

  const [currentPrice, setCurrentPrice] = useState("0");
  const [prevPrice, setPrevPrice] = useState("0");
  const [priceFlash, setPriceFlash] = useState("");
  const [activeTimeframe, setActiveTimeframe] = useState("60");
  const [activeStyle, setActiveStyle] = useState("1");
  const [isConnected, setIsConnected] = useState(false);
  const [tickerData, setTickerData] = useState({
    percentageChange: "0.00",
    highPrice: "0",
    lowPrice: "0",
    quoteVolume: "0",
    baseVolume: "0",
  });

  // ── Fetch ticker ───────────────────────────────────────────────────────────
  const fetchTicker = useCallback(async () => {
    try {
      const res = await fetch(TICKER_API);
      const json = await res.json();
      if (json.success && json.data?.data?.[EXCHANGE]) {
        const d = json.data.data[EXCHANGE];
        setTickerData({
          percentageChange: d.percentageChange || "0.00",
          highPrice: d.highPrice || "0",
          lowPrice: d.lowPrice || "0",
          quoteVolume: d.quoteVolume || "0",
          baseVolume: d.baseVolume || "0",
        });
        if (d.lastPrice) {
          setCurrentPrice(d.lastPrice);
          setPrevPrice(d.lastPrice);
        }
      }
    } catch (e) {
      console.error("Ticker fetch error:", e);
    }
  }, [TICKER_API, EXCHANGE]);

  // ── Handle live trade ──────────────────────────────────────────────────────
  const handleTrade = useCallback(
    (data) => {
      if (data?.s === BASE_PAIR && data?.p) {
        setPrevPrice((prev) => {
          const dir = Number(data.p) >= Number(prev) ? "up" : "down";
          setPriceFlash(dir);
          setTimeout(() => setPriceFlash(""), 600);
          return data.p;
        });
        setCurrentPrice(data.p);
        fetchTicker();
      }
    },
    [BASE_PAIR, fetchTicker],
  );

  // ── WebSocket ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // Reset price state when pair changes
    setCurrentPrice("0");
    setPrevPrice("0");
    setPriceFlash("");
    fetchTicker();

    const socket = io("wss://ws.coinswitch.co" + "/coinswitchx", {
      path: "/pro/realtime-rates-socket/spot/coinswitchx",
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 3000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("FETCH_TRADES_CS_PRO", {
        event: "subscribe",
        pair: BASE_PAIR,
      });
    });

    socket.on("FETCH_TRADES_CS_PRO", handleTrade);
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", (e) => console.error("WS error:", e.message));

    return () => {
      socket.disconnect();
    };
  }, [BASE_PAIR, fetchTicker, handleTrade]);

  // ── TradingView widget builder ─────────────────────────────────────────────
  // NOTE: SYMBOL is now in the dependency array so widget rebuilds on pair change
  const buildWidget = useCallback(
    (interval, style) => {
      if (!containerRef.current || !window.TradingView) return;

      // Destroy previous widget
      if (widgetRef.current?.remove) widgetRef.current.remove();
      widgetRef.current = null;

      const container = document.getElementById("tradingview_chart_container");
      if (container) container.innerHTML = "";

      // ← KEY FIX: derive symbol dynamically from current SYMBOL
      const tvSymbol = getTVSymbol(SYMBOL);

      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol: tvSymbol, // ← was hardcoded before
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
        studies: [
          "MAExp@tv-basicstudies",
          "MASimple@tv-basicstudies",
          "Volume@tv-basicstudies",
        ],
        studies_overrides: {
          "moving average exponential.length": 9,
          "moving average exponential.plot.color": "#a855f7",
          "moving average exponential.plot.linewidth": 2,
          "moving average simple.length": 30,
          "moving average simple.plot.color": "#f59e0b",
          "moving average simple.plot.linewidth": 2,
        },
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#22c55e",
          "mainSeriesProperties.candleStyle.downColor": "#ef4444",
          "mainSeriesProperties.candleStyle.borderUpColor": "#22c55e",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
          "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
          "paneProperties.background": "#0b0e17",
          "paneProperties.backgroundType": "solid",
          "paneProperties.vertGridProperties.color": "rgba(255,255,255,0.03)",
          "paneProperties.horzGridProperties.color": "rgba(255,255,255,0.03)",
          "scalesProperties.textColor": "#6b7280",
          "scalesProperties.lineColor": "rgba(255,255,255,0.06)",
        },
        container_id: "tradingview_chart_container",
        withdateranges: true,
        allow_symbol_change: false,
        details: false,
        hotlist: false,
        calendar: false,
      });
    },
    [SYMBOL], // ← SYMBOL dependency added here
  );

  // ── Load TradingView script once ───────────────────────────────────────────
  useEffect(() => {
    if (scriptLoadedRef.current) {
      buildWidget(activeTimeframe, activeStyle);
      return;
    }

    const existing = document.getElementById("tv-script");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "tv-script";
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      buildWidget(activeTimeframe, activeStyle);
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [buildWidget]);

  // ── Rebuild on timeframe / style change ───────────────────────────────────
  useEffect(() => {
    if (scriptLoadedRef.current) buildWidget(activeTimeframe, activeStyle);
  }, [activeTimeframe, activeStyle, buildWidget]);

  // ── KEY FIX: Rebuild chart when selected pair (SYMBOL) changes ─────────────
  useEffect(() => {
    if (prevSymbolRef.current !== SYMBOL) {
      prevSymbolRef.current = SYMBOL;
      if (scriptLoadedRef.current) {
        buildWidget(activeTimeframe, activeStyle);
      }
    }
  }, [SYMBOL, activeTimeframe, activeStyle, buildWidget]);

  // ── ResizeObserver ─────────────────────────────────────────────────────────
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (widgetRef.current?.activeChart) {
        try {
          widgetRef.current.activeChart().resize();
        } catch (_) {}
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Format helpers ─────────────────────────────────────────────────────────
  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  const fmtVol = (n) => Number(n || 0).toLocaleString("en-IN");
  const isUp = Number(tickerData.percentageChange) >= 0;
  const priceColor =
    priceFlash === "up"
      ? "#22c55e"
      : priceFlash === "down"
        ? "#ef4444"
        : "#ffffff";

  const baseCoin = SYMBOL.split("/")[0];
  const coinIconBg =
    baseCoin === "BTC"
      ? "linear-gradient(135deg,#f7931a,#e07b10)"
      : baseCoin === "ETH"
        ? "linear-gradient(135deg,#627eea,#3c5bbf)"
        : baseCoin === "SOL"
          ? "linear-gradient(135deg,#9945ff,#14f195)"
          : baseCoin === "BNB"
            ? "linear-gradient(135deg,#f3ba2f,#d4a017)"
            : "#a855f7";

  const S = {
    bg: "#0b0e17",
    bgBar: "#080b12",
    border: "1px solid rgba(255,255,255,0.06)",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: S.bg,
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        overflow: "hidden",
        height: "100%",
        fontFamily: S.mono,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        width: "100%",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "10px 14px 8px",
          background: S.bgBar,
          borderBottom: S.border,
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "nowrap",
          minWidth: 0,
        }}
      >
        {/* Coin icon + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              flexShrink: 0,
              background: coinIconBg,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              boxShadow: "0 0 10px rgba(247,147,26,0.35)",
            }}
          >
            {baseCoin.slice(0, 1)}
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.4px",
                whiteSpace: "nowrap",
              }}
            >
              {SYMBOL}
              <span style={{ marginLeft: 5, color: "#f59e0b", fontSize: 12 }}>
                ★
              </span>
            </div>
            <div style={{ color: "#4b5563", fontSize: 10, marginTop: 1 }}>
              {EXCHANGE.toUpperCase()} · Spot
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 28,
            background: "rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}
        />

        {/* Live price */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 7,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: priceColor,
              transition: "color 0.3s ease",
              letterSpacing: "-0.5px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmt(currentPrice)}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: isUp ? "#22c55e" : "#ef4444",
              background: isUp ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              padding: "2px 7px",
              borderRadius: 5,
              border: `1px solid ${isUp ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
              whiteSpace: "nowrap",
            }}
          >
            {isUp ? "▲" : "▼"}{" "}
            {Math.abs(Number(tickerData.percentageChange)).toFixed(2)}%
          </span>
        </div>

        {/* 24H Stats */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 0,
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              minWidth: 0,
              paddingLeft: 4,
            }}
          >
            {[
              {
                label: "24H High",
                value: fmt(tickerData.highPrice),
                color: "#22c55e",
              },
              {
                label: "24H Low",
                value: fmt(tickerData.lowPrice),
                color: "#ef4444",
              },
              {
                label: "Vol INR",
                value: fmtVol(tickerData.quoteVolume),
                color: "#9ca3af",
              },
              {
                label: "Vol Base",
                value: fmtVol(tickerData.baseVolume),
                color: "#9ca3af",
              },
            ].map(({ label, value, color }, i, arr) => (
              <React.Fragment key={label}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "0 10px",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: "#4b5563",
                      marginBottom: 2,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {value}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      height: 22,
                      background: "rgba(255,255,255,0.06)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* WS dot */}
        <div
          title={isConnected ? "Live" : "Reconnecting…"}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            flexShrink: 0,
            background: isConnected ? "#22c55e" : "#6b7280",
            boxShadow: isConnected ? "0 0 6px #22c55e" : "none",
          }}
        />
      </div>

      {/* TOOLBAR */}
      <div
        style={{
          padding: "5px 14px",
          borderBottom: S.border,
          background: S.bgBar,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.interval}
            onClick={() => setActiveTimeframe(tf.interval)}
            style={{
              padding: "4px 9px",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              borderRadius: 5,
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s",
              background:
                activeTimeframe === tf.interval
                  ? "rgba(245,158,11,0.18)"
                  : "transparent",
              color: activeTimeframe === tf.interval ? "#f59e0b" : "#6b7280",
              outline:
                activeTimeframe === tf.interval
                  ? "1px solid rgba(245,158,11,0.35)"
                  : "none",
            }}
          >
            {tf.label}
          </button>
        ))}

        <div
          style={{
            width: 1,
            height: 16,
            background: "rgba(255,255,255,0.08)",
            margin: "0 4px",
          }}
        />

        {CHART_TYPES.map((ct) => (
          <button
            key={ct.style}
            onClick={() => setActiveStyle(ct.style)}
            style={{
              padding: "4px 9px",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              borderRadius: 5,
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s",
              background:
                activeStyle === ct.style
                  ? "rgba(168,85,247,0.18)"
                  : "transparent",
              color: activeStyle === ct.style ? "#a855f7" : "#6b7280",
              outline:
                activeStyle === ct.style
                  ? "1px solid rgba(168,85,247,0.35)"
                  : "none",
            }}
          >
            {ct.label}
          </button>
        ))}

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: 10, color: "#6b7280", whiteSpace: "nowrap" }}
          >
            MA 30 <span style={{ color: "#f59e0b", fontWeight: 700 }}>—</span>
          </span>
          <span
            style={{ fontSize: 10, color: "#6b7280", whiteSpace: "nowrap" }}
          >
            EMA 9 <span style={{ color: "#a855f7", fontWeight: 700 }}>—</span>
          </span>
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
        <div
          id="tradingview_chart_container"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "5px 14px",
          borderTop: S.border,
          background: S.bgBar,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#374151",
          flexWrap: "nowrap",
          gap: 8,
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Powered by TradingView · {SYMBOL} via {EXCHANGE.toUpperCase()}
        </span>
        <span style={{ flexShrink: 0 }}>
          {isConnected ? (
            <span style={{ color: "#22c55e" }}>● LIVE</span>
          ) : (
            <span style={{ color: "#6b7280" }}>○ Reconnecting…</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default TradingChart;
