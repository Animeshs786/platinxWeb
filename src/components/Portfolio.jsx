

import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const PORTFOLIO_API_URL =
  "http://159.89.146.245:3535/api/coinswitch/spot/portfolio";
const BASE_URL = "wss://ws.coinswitch.co";
const NAMESPACE = "/coinswitchx";
const EVENT_NAME = "FETCH_TRADES_CS_PRO";

// ── Coin icon ─────────────────────────────────────────────────────────────────
const getCoinIcon = (pair) => {
  const base = pair.split("/")[0].toLowerCase();
  return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/${base}.png`;
};

const CoinIcon = ({ pair }) => {
  const [err, setErr] = useState(false);
  const base = pair.split("/")[0];
  if (!err) {
    return (
      <img
        src={getCoinIcon(pair)}
        alt={base}
        onError={() => setErr(true)}
        style={{ width: 24, height: 24, borderRadius: "50%" }}
      />
    );
  }
  const colors = ["#f97316", "#3b82f6", "#22c55e", "#eab308"];
  const bg = colors[base.charCodeAt(0) % colors.length];
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: bg,
        fontSize: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 800,
      }}
    >
      {base.slice(0, 2)}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Portfolio = () => {
  const socketRef = useRef(null);
  const [portfolioData, setPortfolioData] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await fetch(PORTFOLIO_API_URL);
      const json = await res.json();
      if (json.success) {
        setPortfolioData(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  useEffect(() => {
    if (!portfolioData) return;

    const holdings = portfolioData.filter((d) => d.currency !== "INR");
    const pairs = holdings.map((d) => `${d.currency.toUpperCase()},INR`);

    const socket = io(BASE_URL + NAMESPACE, {
      path: "/pro/realtime-rates-socket/spot/coinswitchx",
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 3000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      pairs.forEach((pair) => {
        socket.emit(EVENT_NAME, { event: "subscribe", pair });
      });
    });

    socket.on(EVENT_NAME, (data) => {
      if (pairs.includes(data?.s)) {
        fetchPortfolio();
      }
    });

    socket.on("connect_error", (e) => console.error("WS error:", e.message));

    return () => socket.disconnect();
  }, [portfolioData, fetchPortfolio]);

  if (!portfolioData) {
    return <div>Loading...</div>;
  }

  const inr = portfolioData.find((d) => d.currency === "INR");
  const holdings = portfolioData.filter((d) => d.currency !== "INR");

  const PORTFOLIO_STATS = {
    currentValue: parseFloat(inr.current_value),
    investedValue: parseFloat(inr.invested_value),
    gainLoss: parseFloat(inr.current_value) - parseFloat(inr.invested_value),
    gainLossPercent: (
      ((parseFloat(inr.current_value) - parseFloat(inr.invested_value)) /
        parseFloat(inr.invested_value)) *
      100
    ).toFixed(2),
  };

  const HOLDINGS = holdings.map((d) => ({
    pair: `${d.currency}/INR`,
    availableBal: parseFloat(d.main_balance),
    lockedBal: parseFloat(d.blocked_balance_order),
    totalHolding:
      parseFloat(d.main_balance) + parseFloat(d.blocked_balance_order),
    investedValue: parseFloat(d.invested_value),
    currentValue: parseFloat(d.current_value),
    gainLoss: parseFloat(d.current_value) - parseFloat(d.invested_value),
    gainLossPercent: (
      ((parseFloat(d.current_value) - parseFloat(d.invested_value)) /
        parseFloat(d.invested_value)) *
      100
    ).toFixed(2),
  }));

  const { currentValue, investedValue, gainLoss, gainLossPercent } =
    PORTFOLIO_STATS;
  const isNegative = gainLoss < 0;

  return (
    <div style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace" }}>
      {/* Stats + Table Row */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Left Stats Card */}
        <div
          style={{
            width: 200,
            background: "#0b0e17",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10,
            padding: "20px",
            flexShrink: 0,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>
              Current Value
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#e5e7eb" }}>
              ₹{currentValue.toFixed(2)}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>
              Invested Value
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#e5e7eb" }}>
              ₹{investedValue.toFixed(2)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>
              Gain/Loss
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: isNegative ? "#ef4444" : "#22c55e",
                display: "flex",
                alignItems: "baseline",
                gap: 4,
              }}
            >
              {isNegative ? "▼" : "▲"} ₹{Math.abs(gainLoss).toFixed(2)}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: isNegative ? "#ef4444" : "#22c55e",
                marginTop: 4,
              }}
            >
              {isNegative ? "▼" : "▲"} {Math.abs(gainLossPercent)}%
            </div>
          </div>
        </div>

        {/* Right Table */}
        <div
          style={{
            flex: 1,
            background: "#0b0e17",
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#080b12",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.5px",
                  }}
                >
                  Pair
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.5px",
                  }}
                >
                  Available Bal.
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.5px",
                  }}
                >
                  Locked Bal.
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total Holding
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.5px",
                  }}
                >
                  Invested Value
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.5px",
                  }}
                >
                  Current Value
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.5px",
                  }}
                >
                  Gain/Loss
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.5px",
                  }}
                >
                  Gain/Loss %
                </th>
              </tr>
            </thead>
            <tbody>
              {HOLDINGS.map((h, i) => {
                const neg = h.gainLoss < 0;
                return (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <CoinIcon pair={h.pair} />
                        <span
                          style={{
                            fontSize: 13,
                            color: "#e5e7eb",
                            fontWeight: 600,
                          }}
                        >
                          {h.pair}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 12,
                        color: "#d1d5db",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      {h.availableBal}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 12,
                        color: "#d1d5db",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      {h.lockedBal}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 12,
                        color: "#d1d5db",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      {h.totalHolding}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 12,
                        color: "#d1d5db",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      ₹{h.investedValue.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 12,
                        color: "#d1d5db",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      ₹{h.currentValue.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 12,
                        textAlign: "center",
                        fontWeight: 700,
                        color: neg ? "#ef4444" : "#22c55e",
                      }}
                    >
                      ₹{h.gainLoss.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 12,
                        textAlign: "center",
                        fontWeight: 700,
                        color: neg ? "#ef4444" : "#22c55e",
                      }}
                    >
                      {h.gainLossPercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
