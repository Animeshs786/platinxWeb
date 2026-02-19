// import React, { useState, useCallback, useRef, useEffect } from "react";

// // ─── CONSTANTS ───────────────────────────────────────────────────────────────
// const PORTFOLIO_API_URL = "http://159.89.146.245:3535/api/coinswitch/spot/portfolio";
// const PLACE_ORDER_API_URL = "http://159.89.146.245:3535/api/coinswitch/spot/order"; // assumed endpoint - adjust if different

// const MIN_BTC = 0.000024;           // keep for reference, but we'll use LIGHT min later
// const FEE_RATE = 0.004;             // 0.4%
// const SYMBOL = "LIGHT/INR";
// const EXCHANGE = "coinswitchx";

// // ─── COLOR TOKENS ────────────────────────────────────────────────────────────
// const C = {
//   bg: "#0b0e17",
//   bgDeep: "#070a10",
//   bgInput: "#111827",
//   bgInputHov: "#151d2e",
//   border: "rgba(255,255,255,0.07)",
//   borderFocus: "rgba(240,185,11,0.35)",
//   accent: "#f0b90b",
//   accentDim: "rgba(240,185,11,0.12)",
//   green: "#0ecb81",
//   greenDim: "rgba(14,203,129,0.12)",
//   greenBorder: "rgba(14,203,129,0.35)",
//   red: "#f6465d",
//   redDim: "rgba(246,70,93,0.12)",
//   redBorder: "rgba(246,70,93,0.35)",
//   label: "#5a6478",
//   text: "#c4cbd9",
//   textDim: "#3d4659",
//   warnBg: "rgba(246,70,93,0.08)",
//   warnBorder: "rgba(246,70,93,0.25)",
//   tooltipBg: "#12192a",
//   mono: "'IBM Plex Mono', 'JetBrains Mono', monospace",
//   success: "#22c55e",
// };

// // ─── HELPERS ─────────────────────────────────────────────────────────────────
// const fmtINR = (n, decimals = 4) =>
//   "₹" +
//   Number(n).toLocaleString("en-IN", {
//     minimumFractionDigits: decimals,
//     maximumFractionDigits: decimals,
//   });

// const fmtINR0 = (n) =>
//   "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// // ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

// const InputGroup = ({
//   label,
//   value,
//   onChange,
//   placeholder,
//   unit,
//   hint,
//   badge,
//   onBadge,
//   noteText,
//   focusColor,
// }) => {
//   const [focused, setFocused] = useState(false);
//   return (
//     <div
//       style={{
//         background: focused ? C.bgInputHov : C.bgInput,
//         border: `1px solid ${focused ? focusColor || C.borderFocus : C.border}`,
//         borderRadius: 7,
//         padding: "10px 12px",
//         marginBottom: 8,
//         transition: "border-color 0.2s, background 0.2s",
//         width: "100%",
//       }}
//     >
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//         <div style={{ flex: 1 }}>
//           <div
//             style={{
//               fontSize: 10,
//               color: focused ? C.accent : C.label,
//               letterSpacing: "0.6px",
//               textTransform: "uppercase",
//               marginBottom: 5,
//               transition: "color 0.15s",
//             }}
//           >
//             {label}
//           </div>
//           <input
//             type="text"
//             value={value}
//             onChange={onChange}
//             placeholder={placeholder || "0.000000"}
//             onFocus={() => setFocused(true)}
//             onBlur={() => setFocused(false)}
//             style={{
//               background: "transparent",
//               border: "none",
//               outline: "none",
//               fontFamily: C.mono,
//               fontSize: 13,
//               fontWeight: 600,
//               color: C.text,
//               width: "100%",
//               fontVariantNumeric: "tabular-nums",
//             }}
//           />
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, flexShrink: 0 }}>
//           {badge && (
//             <span
//               onClick={onBadge}
//               style={{
//                 fontSize: 10,
//                 color: C.accent,
//                 fontWeight: 700,
//                 letterSpacing: "0.3px",
//                 padding: "2px 6px",
//                 background: C.accentDim,
//                 border: `1px solid rgba(240,185,11,0.2)`,
//                 borderRadius: 4,
//                 cursor: "pointer",
//               }}
//             >
//               {badge}
//             </span>
//           )}
//           {hint && <span style={{ fontSize: 9, color: C.label, letterSpacing: "0.3px" }}>{hint}</span>}
//           {unit && <span style={{ fontSize: 10, color: C.label, letterSpacing: "0.5px" }}>{unit}</span>}
//         </div>
//       </div>
//       {noteText && (
//         <div style={{ fontSize: 9, color: C.label, marginTop: 4, letterSpacing: "0.3px" }}>
//           {noteText}
//         </div>
//       )}
//     </div>
//   );
// };

// const FeeTooltip = ({ price, qty, visible }) => {
//   const amount = price * qty;
//   const fee = amount * FEE_RATE;
//   const total = amount + fee;

//   return (
//     <div
//       style={{
//         position: "absolute",
//         bottom: "calc(100% + 10px)",
//         left: 0,
//         width: 240,
//         background: C.tooltipBg,
//         border: "1px solid rgba(255,255,255,0.1)",
//         borderRadius: 10,
//         padding: 16,
//         boxShadow: "0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(240,185,11,0.08)",
//         zIndex: 100,
//         opacity: visible ? 1 : 0,
//         pointerEvents: visible ? "all" : "none",
//         transform: visible ? "translateY(0)" : "translateY(6px)",
//         transition: "opacity 0.2s ease, transform 0.2s ease",
//       }}
//     >
//       <div
//         style={{
//           fontSize: 12,
//           fontWeight: 700,
//           color: C.text,
//           letterSpacing: "0.5px",
//           marginBottom: 12,
//           paddingBottom: 10,
//           borderBottom: `1px solid ${C.border}`,
//           textTransform: "uppercase",
//         }}
//       >
//         Trading Fee Breakup
//       </div>
//       {[
//         { key: "Price", val: fmtINR0(price) },
//         { key: "Quantity", val: `×${qty.toFixed(6)}` },
//         { key: "Amount", val: fmtINR(amount) },
//         { key: "Fee (0.4%)", val: `+${fmtINR(fee)}`, color: C.accent },
//       ].map(({ key, val, color }) => (
//         <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//           <span style={{ fontSize: 11, color: C.label }}>{key}</span>
//           <span style={{ fontSize: 11, color: color || C.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
//             {val}
//           </span>
//         </div>
//       ))}
//       <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <span style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>Total</span>
//         <span style={{ fontSize: 13, color: C.accent, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
//           {fmtINR(total)}
//         </span>
//       </div>
//       <div
//         style={{
//           position: "absolute",
//           bottom: -6,
//           left: 18,
//           width: 10,
//           height: 10,
//           background: C.tooltipBg,
//           borderRight: "1px solid rgba(255,255,255,0.1)",
//           borderBottom: "1px solid rgba(255,255,255,0.1)",
//           transform: "rotate(45deg)",
//         }}
//       />
//     </div>
//   );
// };

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// const OrderPlacement = () => {
//   const [side, setSide] = useState("buy");
//   const [orderType, setOrderType] = useState("limit");
//   const [limitPrice, setLimitPrice] = useState("22.52");
//   const [triggerPrice, setTriggerPrice] = useState("");
//   const [qty, setQty] = useState("");
//   const [sliderVal, setSliderVal] = useState(0);
//   const [activePct, setActivePct] = useState(null);
//   const [placing, setPlacing] = useState(false);
//   const [placed, setPlaced] = useState(false);
//   const [feeHover, setFeeHover] = useState(false);
//   const [availableINR, setAvailableINR] = useState(0);
//   const [loadingBalance, setLoadingBalance] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch wallet balance from portfolio API (INR last item)
//   const fetchBalance = useCallback(async () => {
//     try {
//       setLoadingBalance(true);
//       const res = await fetch(PORTFOLIO_API_URL);
//       const json = await res.json();
//       if (json.success && Array.isArray(json.data)) {
//         const inrItem = json.data.find(item => item.currency === "INR");
//         if (inrItem && inrItem.main_balance) {
//           setAvailableINR(parseFloat(inrItem.main_balance) || 0);
//         }
//       }
//     } catch (err) {
//       console.error("Failed to fetch balance:", err);
//       setError("Could not load wallet balance");
//     } finally {
//       setLoadingBalance(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchBalance();
//   }, [fetchBalance]);

//   const price = parseFloat(limitPrice.replace(/,/g, "")) || 0;
//   const qtyNum = parseFloat(qty) || 0;
//   const amount = price * qtyNum;
//   const fee = amount * FEE_RATE;
//   const totalCost = amount + fee; // for buy
//   const totalReceive = amount - fee; // for sell (approx)

//   const hasEnoughBalance = side === "buy" ? availableINR >= totalCost : true; // sell always possible if holding checked elsewhere

//   const handleSetPct = useCallback(
//     (p) => {
//       setActivePct(p);
//       if (p === "min") {
//         setQty("1"); // minimal quantity example for LIGHT - adjust as needed
//         setSliderVal(0);
//       } else {
//         const budget = availableINR * (p / 100);
//         const q = budget / (price || 1);
//         setQty(q.toFixed(4)); // LIGHT likely has 4 decimals
//         setSliderVal(p);
//       }
//     },
//     [price, availableINR],
//   );

//   const handleSlider = useCallback(
//     (v) => {
//       setSliderVal(v);
//       setActivePct(null);
//       if (v === 0) {
//         setQty("");
//         return;
//       }
//       const budget = availableINR * (v / 100);
//       const q = budget / (price || 1);
//       setQty(q.toFixed(4));
//     },
//     [price, availableINR],
//   );

//   const handlePlaceOrder = async () => {
//     if (placing || placed) return;

//     if (side === "buy" && !hasEnoughBalance) {
//       setError("Insufficient balance to place this order");
//       return;
//     }

//     setPlacing(true);
//     setError(null);

//     const payload = {
//       side,
//       symbol: SYMBOL,
//       type: orderType,
//       price: parseFloat(limitPrice),
//       quantity: qtyNum,
//       exchange: EXCHANGE,
//       ...(orderType === "stoplimit" && triggerPrice && { triggerPrice: parseFloat(triggerPrice) }),
//     };

//     try {
//       const res = await fetch(PLACE_ORDER_API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok && data.success) {
//         setPlaced(true);
//         setTimeout(() => setPlaced(false), 3000);
//         fetchBalance(); // refresh balance after successful order
//       } else {
//         setError(data.message || "Failed to place order");
//       }
//     } catch (err) {
//       setError("Network error while placing order");
//       console.error(err);
//     } finally {
//       setPlacing(false);
//     }
//   };

//   const handleSide = (s) => {
//     setSide(s);
//     setActivePct(null);
//     setLimitPrice(s === "buy" ? "22.52" : "22.56"); // current sell/buy rates from earlier data
//   };

//   const handleType = (t) => {
//     setOrderType(t);
//     setLimitPrice(t === "stoplimit" ? "22.00" : side === "buy" ? "22.52" : "22.56");
//     setTriggerPrice("");
//     setQty("");
//     setSliderVal(0);
//     setActivePct(null);
//   };

//   const isGreen = side === "buy";
//   const btnColor = isGreen ? C.green : C.red;
//   const btnTextCol = isGreen ? "#000" : "#fff";

//   const pctClass = (p) => {
//     if (activePct !== p) return {};
//     return {
//       background: isGreen ? C.greenDim : C.redDim,
//       color: isGreen ? C.green : C.red,
//       borderColor: isGreen ? C.greenBorder : C.redBorder,
//     };
//   };

//   const placeBtnLabel = placing
//     ? "Processing…"
//     : placed
//       ? "✓ Order Placed"
//       : `Place ${side === "buy" ? "Buy" : "Sell"} Order`;

//   return (
//     <div
//       style={{
//         width: 300,
//         background: C.bg,
//         border: `1px solid ${C.border}`,
//         borderRadius: 12,
//         overflow: "visible",
//         boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
//         fontFamily: C.mono,
//         position: "relative",
//         minHeight: "623px",
//       }}
//     >
//       {/* BUY / SELL TABS */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           background: C.bgDeep,
//           borderRadius: "12px 12px 0 0",
//           overflow: "hidden",
//         }}
//       >
//         {["buy", "sell"].map((s) => (
//           <button
//             key={s}
//             onClick={() => handleSide(s)}
//             style={{
//               padding: "13px 0",
//               fontFamily: C.mono,
//               fontSize: 13,
//               fontWeight: 700,
//               letterSpacing: "0.8px",
//               textTransform: "uppercase",
//               border: "none",
//               cursor: "pointer",
//               background: side === s ? (s === "buy" ? C.green : C.red) : "transparent",
//               color: side === s ? (s === "buy" ? "#000" : "#fff") : s === "buy" ? C.green : C.red,
//             }}
//           >
//             {s.toUpperCase()}
//           </button>
//         ))}
//       </div>

//       {/* ORDER TYPE */}
//       <div style={{ display: "flex", padding: "12px 14px 0", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
//         {["limit", "stoplimit"].map((t) => (
//           <button
//             key={t}
//             onClick={() => handleType(t)}
//             style={{
//               padding: "8px 14px",
//               fontSize: 12,
//               fontWeight: 600,
//               border: "none",
//               background: "transparent",
//               color: orderType === t ? C.accent : C.label,
//               borderBottom: `2px solid ${orderType === t ? C.accent : "transparent"}`,
//               marginBottom: -1,
//             }}
//           >
//             {t === "limit" ? "Limit" : "Stop Limit"}
//           </button>
//         ))}
//       </div>

//       {/* BODY */}
//       <div style={{ padding: 14 }}>
//         {/* Available Balance */}
//         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
//           <span style={{ fontSize: 10, color: C.label, textTransform: "uppercase" }}>Available INR</span>
//           {loadingBalance ? (
//             <span style={{ fontSize: 12, color: C.label }}>Loading...</span>
//           ) : (
//             <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
//               {fmtINR(availableINR, 2)}
//             </span>
//           )}
//         </div>

//         {error && (
//           <div style={{ color: C.red, fontSize: 11, marginBottom: 10, textAlign: "center" }}>
//             {error}
//           </div>
//         )}

//         {/* Trigger Price */}
//         {orderType === "stoplimit" && (
//           <InputGroup
//             label="Trigger Price"
//             value={triggerPrice}
//             onChange={(e) => setTriggerPrice(e.target.value)}
//             placeholder="Market trigger price"
//             unit="INR"
//           />
//         )}

//         {/* Limit Price */}
//         <InputGroup
//           label="Limit Price"
//           value={limitPrice}
//           onChange={(e) => setLimitPrice(e.target.value)}
//           unit="INR"
//           badge={side === "buy" ? "Best Ask" : "Best Bid"}
//           onBadge={() => setLimitPrice(side === "buy" ? "22.56" : "22.52")}
//         />

//         {/* Quantity */}
//         <InputGroup
//           label="Quantity"
//           value={qty}
//           onChange={(e) => setQty(e.target.value)}
//           placeholder="0.00"
//           unit="LIGHT"
//           hint="Min quantity usually low for altcoins"
//         />

//         {/* Total */}
//         <div style={{ background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px", marginBottom: 8 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <div>
//               <div style={{ fontSize: 10, color: C.label, textTransform: "uppercase", marginBottom: 5 }}>
//                 {side === "buy" ? "Total Cost" : "You Receive ≈"}
//               </div>
//               <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
//                 {side === "buy" ? fmtINR(totalCost, 2) : fmtINR(totalReceive, 2)}
//               </div>
//             </div>
//             <span style={{ fontSize: 9, color: C.label }}>Fee 0.4%</span>
//           </div>
//         </div>

//         {/* Percentage Buttons */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
//           {[
//             { label: "Min", key: "min" },
//             { label: "25%", key: 25 },
//             { label: "50%", key: 50 },
//             { label: "100%", key: 100 },
//           ].map(({ label, key }) => (
//             <button
//               key={key}
//               onClick={() => handleSetPct(key)}
//               style={{
//                 padding: "6px 0",
//                 fontSize: 10,
//                 fontWeight: 600,
//                 borderRadius: 5,
//                 border: `1px solid ${C.border}`,
//                 background: C.bgInput,
//                 color: C.label,
//                 ...pctClass(key),
//               }}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* Slider */}
//         <div style={{ padding: "25px 0 14px" }}>
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={sliderVal}
//             onChange={(e) => handleSlider(Number(e.target.value))}
//             style={{ width: "100%", accentColor: C.accent }}
//           />
//           <div style={{ textAlign: "right", fontSize: 10, color: C.accent, marginTop: 2 }}>
//             {sliderVal}%
//           </div>
//         </div>

//         {/* Place Button */}
//         <button
//           onClick={handlePlaceOrder}
//           disabled={placing || !qtyNum || (side === "buy" && !hasEnoughBalance)}
//           style={{
//             width: "100%",
//             padding: 14,
//             fontSize: 13,
//             fontWeight: 700,
//             textTransform: "uppercase",
//             border: "none",
//             borderRadius: 7,
//             background: placed ? C.success : btnColor,
//             color: btnTextCol,
//             cursor: placing || !qtyNum ? "not-allowed" : "pointer",
//             opacity: placing || !qtyNum ? 0.6 : 1,
//           }}
//         >
//           {placeBtnLabel}
//         </button>

//         {/* Fee Info */}
//         <div
//           style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 20, position: "relative" }}
//           onMouseEnter={() => setFeeHover(true)}
//           onMouseLeave={() => setFeeHover(false)}
//         >
//           <span style={{ fontSize: 11, color: feeHover ? C.accent : C.label, cursor: "pointer" }}>
//             Fee breakup (0.4%)
//           </span>
//           <FeeTooltip price={price} qty={qtyNum} visible={feeHover} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderPlacement;






































import React, { useState, useCallback, useRef, useEffect } from "react";
import { useTradingContext } from "../context/TradingContext";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PORTFOLIO_API_URL  = "http://159.89.146.245:3535/api/coinswitch/spot/portfolio";
const PLACE_ORDER_API_URL = "http://159.89.146.245:3535/api/coinswitch/spot/order";
const TICKER_API_BASE    = "http://159.89.146.245:3535/api/coinswitch/spot/ticker/single";

const FEE_RATE = 0.004; // 0.4%

// ─── COLOR TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:          "#0b0e17",
  bgDeep:      "#070a10",
  bgInput:     "#111827",
  bgInputHov:  "#151d2e",
  border:      "rgba(255,255,255,0.07)",
  borderFocus: "rgba(240,185,11,0.35)",
  accent:      "#f0b90b",
  accentDim:   "rgba(240,185,11,0.12)",
  green:       "#0ecb81",
  greenDim:    "rgba(14,203,129,0.12)",
  greenBorder: "rgba(14,203,129,0.35)",
  red:         "#f6465d",
  redDim:      "rgba(246,70,93,0.12)",
  redBorder:   "rgba(246,70,93,0.35)",
  label:       "#5a6478",
  text:        "#c4cbd9",
  textDim:     "#3d4659",
  warnBg:      "rgba(246,70,93,0.08)",
  warnBorder:  "rgba(246,70,93,0.25)",
  tooltipBg:   "#12192a",
  mono:        "'IBM Plex Mono', 'JetBrains Mono', monospace",
  success:     "#22c55e",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtINR = (n, decimals = 4) =>
  "₹" + Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const fmtINR0 = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
const InputGroup = ({
  label, value, onChange, placeholder, unit,
  hint, badge, onBadge, noteText, focusColor,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        background:   focused ? C.bgInputHov : C.bgInput,
        border:       `1px solid ${focused ? focusColor || C.borderFocus : C.border}`,
        borderRadius: 7,
        padding:      "10px 12px",
        marginBottom: 8,
        transition:   "border-color 0.2s, background 0.2s",
        width:        "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize:      10,
              color:         focused ? C.accent : C.label,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              marginBottom:  5,
              transition:    "color 0.15s",
            }}
          >
            {label}
          </div>
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder || "0.000000"}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              background:         "transparent",
              border:             "none",
              outline:            "none",
              fontFamily:         C.mono,
              fontSize:           13,
              fontWeight:         600,
              color:              C.text,
              width:              "100%",
              fontVariantNumeric: "tabular-nums",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, flexShrink: 0 }}>
          {badge && (
            <span
              onClick={onBadge}
              style={{
                fontSize:     10,
                color:        C.accent,
                fontWeight:   700,
                letterSpacing:"0.3px",
                padding:      "2px 6px",
                background:   C.accentDim,
                border:       `1px solid rgba(240,185,11,0.2)`,
                borderRadius: 4,
                cursor:       "pointer",
              }}
            >
              {badge}
            </span>
          )}
          {hint && <span style={{ fontSize: 9, color: C.label, letterSpacing: "0.3px" }}>{hint}</span>}
          {unit && <span style={{ fontSize: 10, color: C.label, letterSpacing: "0.5px" }}>{unit}</span>}
        </div>
      </div>
      {noteText && (
        <div style={{ fontSize: 9, color: C.label, marginTop: 4, letterSpacing: "0.3px" }}>
          {noteText}
        </div>
      )}
    </div>
  );
};

const FeeTooltip = ({ price, qty, visible }) => {
  const amount = price * qty;
  const fee    = amount * FEE_RATE;
  const total  = amount + fee;

  return (
    <div
      style={{
        position:      "absolute",
        bottom:        "calc(100% + 10px)",
        left:          0,
        width:         240,
        background:    C.tooltipBg,
        border:        "1px solid rgba(255,255,255,0.1)",
        borderRadius:  10,
        padding:       16,
        boxShadow:     "0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(240,185,11,0.08)",
        zIndex:        100,
        opacity:       visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
        transform:     visible ? "translateY(0)" : "translateY(6px)",
        transition:    "opacity 0.2s ease, transform 0.2s ease",
      }}
    >
      <div
        style={{
          fontSize:      12,
          fontWeight:    700,
          color:         C.text,
          letterSpacing: "0.5px",
          marginBottom:  12,
          paddingBottom: 10,
          borderBottom:  `1px solid ${C.border}`,
          textTransform: "uppercase",
        }}
      >
        Trading Fee Breakup
      </div>
      {[
        { key: "Price",     val: fmtINR0(price) },
        { key: "Quantity",  val: `×${qty.toFixed(6)}` },
        { key: "Amount",    val: fmtINR(amount) },
        { key: "Fee (0.4%)", val: `+${fmtINR(fee)}`, color: C.accent },
      ].map(({ key, val, color }) => (
        <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: C.label }}>{key}</span>
          <span style={{ fontSize: 11, color: color || C.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
            {val}
          </span>
        </div>
      ))}
      <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>Total</span>
        <span style={{ fontSize: 13, color: C.accent, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
          {fmtINR(total)}
        </span>
      </div>
      <div
        style={{
          position:   "absolute",
          bottom:     -6,
          left:       18,
          width:      10,
          height:     10,
          background: C.tooltipBg,
          borderRight:  "1px solid rgba(255,255,255,0.1)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          transform:  "rotate(45deg)",
        }}
      />
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const OrderPlacement = () => {
  // ── Pull dynamic pair from context ────────────────────────────────────────
  const { selectedPair } = useTradingContext();

  const SYMBOL   = selectedPair?.symbol   || "LIGHT/INR";
  const EXCHANGE = selectedPair?.exchange || "coinswitchx";
  const baseCoin  = SYMBOL.split("/")[0];  // e.g. "LIGHT"
  const quoteCoin = SYMBOL.split("/")[1] || "INR"; // e.g. "INR"

  // Ticker API for this pair
  const TICKER_API = `${TICKER_API_BASE}?symbol=${SYMBOL}&exchange=${EXCHANGE}`;

  // ── State ─────────────────────────────────────────────────────────────────
  const [side,          setSide]          = useState("buy");
  const [orderType,     setOrderType]     = useState("limit");
  const [limitPrice,    setLimitPrice]    = useState("");       // filled by ticker
  const [triggerPrice,  setTriggerPrice]  = useState("");
  const [qty,           setQty]           = useState("");
  const [sliderVal,     setSliderVal]     = useState(0);
  const [activePct,     setActivePct]     = useState(null);
  const [placing,       setPlacing]       = useState(false);
  const [placed,        setPlaced]        = useState(false);
  const [feeHover,      setFeeHover]      = useState(false);
  const [availableINR,  setAvailableINR]  = useState(0);
  const [loadingBalance,setLoadingBalance]= useState(true);
  const [loadingTicker, setLoadingTicker] = useState(true);
  const [error,         setError]         = useState(null);

  // Store best ask/bid from ticker for "Best Ask / Best Bid" badge
  const [bestAsk, setBestAsk] = useState("");
  const [bestBid, setBestBid] = useState("");

  // ── Fetch ticker to get lastPrice (24H last price) ─────────────────────────
  const fetchTicker = useCallback(async () => {
    try {
      setLoadingTicker(true);
      const res  = await fetch(TICKER_API);
      const json = await res.json();
      if (json.success && json.data?.data?.[EXCHANGE]) {
        const d = json.data.data[EXCHANGE];

        const last = d.lastPrice   ? String(d.lastPrice)   : "";
        const ask  = d.askPrice    ? String(d.askPrice)    : last;
        const bid  = d.bidPrice    ? String(d.bidPrice)    : last;

        // Set limit price to lastPrice (24H last price) on load
        if (last) setLimitPrice(last);

        setBestAsk(ask || last);
        setBestBid(bid || last);
      }
    } catch (err) {
      console.error("Ticker fetch error:", err);
    } finally {
      setLoadingTicker(false);
    }
  }, [TICKER_API, EXCHANGE]);

  // ── Fetch wallet balance ───────────────────────────────────────────────────
  const fetchBalance = useCallback(async () => {
    try {
      setLoadingBalance(true);
      const res  = await fetch(PORTFOLIO_API_URL);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const inrItem = json.data.find((item) => item.currency === "INR");
        if (inrItem?.main_balance) {
          setAvailableINR(parseFloat(inrItem.main_balance) || 0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch balance:", err);
      setError("Could not load wallet balance");
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  // ── On pair change: reset form + refetch ticker ───────────────────────────
  useEffect(() => {
    setLimitPrice("");
    setTriggerPrice("");
    setQty("");
    setSliderVal(0);
    setActivePct(null);
    setError(null);
    setBestAsk("");
    setBestBid("");
    fetchTicker();
  }, [SYMBOL, fetchTicker]);

  // ── Initial balance fetch ──────────────────────────────────────────────────
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // ── Derived values ────────────────────────────────────────────────────────
  const price         = parseFloat(limitPrice.replace(/,/g, "")) || 0;
  const qtyNum        = parseFloat(qty) || 0;
  const amount        = price * qtyNum;
  const fee           = amount * FEE_RATE;
  const totalCost     = amount + fee;
  const totalReceive  = amount - fee;
  const hasEnoughBalance = side === "buy" ? availableINR >= totalCost : true;

  // ── Percentage / slider handlers ──────────────────────────────────────────
  const handleSetPct = useCallback(
    (p) => {
      setActivePct(p);
      if (p === "min") {
        setQty("1");
        setSliderVal(0);
      } else {
        const budget = availableINR * (p / 100);
        const q = budget / (price || 1);
        setQty(q.toFixed(4));
        setSliderVal(p);
      }
    },
    [price, availableINR],
  );

  const handleSlider = useCallback(
    (v) => {
      setSliderVal(v);
      setActivePct(null);
      if (v === 0) { setQty(""); return; }
      const budget = availableINR * (v / 100);
      const q = budget / (price || 1);
      setQty(q.toFixed(4));
    },
    [price, availableINR],
  );

  // ── Place order ───────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (placing || placed) return;
    if (side === "buy" && !hasEnoughBalance) {
      setError("Insufficient balance to place this order");
      return;
    }

    setPlacing(true);
    setError(null);

    const payload = {
      side,
      symbol:   SYMBOL,
      type:     orderType,
      price:    parseFloat(limitPrice),
      quantity: qtyNum,
      exchange: EXCHANGE,
      ...(orderType === "stoplimit" && triggerPrice && {
        triggerPrice: parseFloat(triggerPrice),
      }),
    };

    try {
      const res  = await fetch(PLACE_ORDER_API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPlaced(true);
        setTimeout(() => setPlaced(false), 3000);
        fetchBalance();
      } else {
        setError(data.message || "Failed to place order");
      }
    } catch (err) {
      setError("Network error while placing order");
      console.error(err);
    } finally {
      setPlacing(false);
    }
  };

  // ── Side / Type change ────────────────────────────────────────────────────
  const handleSide = (s) => {
    setSide(s);
    setActivePct(null);
    // Set limit price to best ask (buy) or best bid (sell)
    if (s === "buy"  && bestAsk) setLimitPrice(bestAsk);
    if (s === "sell" && bestBid) setLimitPrice(bestBid);
  };

  const handleType = (t) => {
    setOrderType(t);
    setTriggerPrice("");
    setQty("");
    setSliderVal(0);
    setActivePct(null);
  };

  const isGreen      = side === "buy";
  const btnColor     = isGreen ? C.green : C.red;
  const btnTextCol   = isGreen ? "#000"  : "#fff";

  const pctClass = (p) => {
    if (activePct !== p) return {};
    return {
      background:  isGreen ? C.greenDim  : C.redDim,
      color:       isGreen ? C.green     : C.red,
      borderColor: isGreen ? C.greenBorder : C.redBorder,
    };
  };

  const placeBtnLabel = placing
    ? "Processing…"
    : placed
    ? "✓ Order Placed"
    : `Place ${side === "buy" ? "Buy" : "Sell"} Order`;

  return (
    <div
      style={{
        width:      300,
        background: C.bg,
        border:     `1px solid ${C.border}`,
        borderRadius: 12,
        overflow:   "visible",
        boxShadow:  "0 20px 60px rgba(0,0,0,0.7)",
        fontFamily: C.mono,
        position:   "relative",
        minHeight:  "623px",
      }}
    >
      {/* ── PAIR LABEL ── */}
      {/* <div
        style={{
          padding:        "8px 14px 0",
          background:     C.bgDeep,
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: "0.5px" }}>
          {SYMBOL}
        </span>
        <span style={{ fontSize: 10, color: C.label }}>
          {EXCHANGE.toUpperCase()} · Spot
        </span>
      </div> */}

      {/* ── BUY / SELL TABS ── */}
      <div
        style={{
          display:      "grid",
          gridTemplateColumns: "1fr 1fr",
          background:   C.bgDeep,
          overflow:     "hidden",
        }}
      >
        {["buy", "sell"].map((s) => (
          <button
            key={s}
            onClick={() => handleSide(s)}
            style={{
              padding:       "13px 0",
              fontFamily:    C.mono,
              fontSize:      13,
              fontWeight:    700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              border:        "none",
              cursor:        "pointer",
              background:    side === s ? (s === "buy" ? C.green : C.red) : "transparent",
              color:         side === s ? (s === "buy" ? "#000" : "#fff") : s === "buy" ? C.green : C.red,
              transition:    "background 0.2s",
            }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── ORDER TYPE ── */}
      <div
        style={{
          display:      "flex",
          padding:      "12px 14px 0",
          borderBottom: `1px solid ${C.border}`,
          background:   C.bg,
        }}
      >
        {["limit", "stoplimit"].map((t) => (
          <button
            key={t}
            onClick={() => handleType(t)}
            style={{
              padding:     "8px 14px",
              fontSize:    12,
              fontWeight:  600,
              border:      "none",
              background:  "transparent",
              color:       orderType === t ? C.accent : C.label,
              borderBottom:`2px solid ${orderType === t ? C.accent : "transparent"}`,
              marginBottom: -1,
              cursor:      "pointer",
              fontFamily:  C.mono,
            }}
          >
            {t === "limit" ? "Limit" : "Stop Limit"}
          </button>
        ))}
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: 14 }}>

        {/* Available Balance */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 10, color: C.label, textTransform: "uppercase" }}>
            Available {quoteCoin}
          </span>
          {loadingBalance ? (
            <span style={{ fontSize: 12, color: C.label }}>Loading...</span>
          ) : (
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
              {fmtINR(availableINR, 2)}
            </span>
          )}
        </div>

        {error && (
          <div style={{ color: C.red, fontSize: 11, marginBottom: 10, textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Trigger Price (stop-limit only) */}
        {orderType === "stoplimit" && (
          <InputGroup
            label="Trigger Price"
            value={triggerPrice}
            onChange={(e) => setTriggerPrice(e.target.value)}
            placeholder="Market trigger price"
            unit={quoteCoin}
          />
        )}

        {/* Limit Price — pre-filled with lastPrice from ticker */}
        <InputGroup
          label={loadingTicker ? "Limit Price (Loading…)" : "Limit Price"}
          value={limitPrice}
          onChange={(e) => setLimitPrice(e.target.value)}
          unit={quoteCoin}
          badge={side === "buy" ? "Best Ask" : "Best Bid"}
          onBadge={() => setLimitPrice(side === "buy" ? bestAsk : bestBid)}
        />

        {/* Quantity */}
        <InputGroup
          label="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="0.00"
          unit={baseCoin}
        />

        {/* Total */}
        <div
          style={{
            background:   C.bgInput,
            border:       `1px solid ${C.border}`,
            borderRadius: 7,
            padding:      "10px 12px",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, color: C.label, textTransform: "uppercase", marginBottom: 5 }}>
                {side === "buy" ? "Total Cost" : "You Receive ≈"}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
                {side === "buy" ? fmtINR(totalCost, 2) : fmtINR(totalReceive, 2)}
              </div>
            </div>
            <span style={{ fontSize: 9, color: C.label }}>Fee 0.4%</span>
          </div>
        </div>

        {/* Percentage Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
          {[
            { label: "Min", key: "min" },
            { label: "25%", key: 25   },
            { label: "50%", key: 50   },
            { label: "100%",key: 100  },
          ].map(({ label, key }) => (
            <button
              key={key}
              onClick={() => handleSetPct(key)}
              style={{
                padding:      "6px 0",
                fontSize:     10,
                fontWeight:   600,
                borderRadius: 5,
                border:       `1px solid ${C.border}`,
                background:   C.bgInput,
                color:        C.label,
                cursor:       "pointer",
                fontFamily:   C.mono,
                ...pctClass(key),
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div style={{ padding: "25px 0 14px" }}>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={(e) => handleSlider(Number(e.target.value))}
            style={{ width: "100%", accentColor: C.accent }}
          />
          <div style={{ textAlign: "right", fontSize: 10, color: C.accent, marginTop: 2 }}>
            {sliderVal}%
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={placing || !qtyNum || (side === "buy" && !hasEnoughBalance)}
          style={{
            width:         "100%",
            padding:       14,
            fontSize:      13,
            fontWeight:    700,
            textTransform: "uppercase",
            border:        "none",
            borderRadius:  7,
            background:    placed ? C.success : btnColor,
            color:         btnTextCol,
            cursor:        placing || !qtyNum ? "not-allowed" : "pointer",
            opacity:       placing || !qtyNum ? 0.6 : 1,
            fontFamily:    C.mono,
            transition:    "background 0.3s",
          }}
        >
          {placeBtnLabel}
        </button>

        {/* Fee Info */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 20, position: "relative" }}
          onMouseEnter={() => setFeeHover(true)}
          onMouseLeave={() => setFeeHover(false)}
        >
          <span style={{ fontSize: 11, color: feeHover ? C.accent : C.label, cursor: "pointer" }}>
            Fee breakup (0.4%)
          </span>
          <FeeTooltip price={price} qty={qtyNum} visible={feeHover} />
        </div>
      </div>
    </div>
  );
};

export default OrderPlacement;