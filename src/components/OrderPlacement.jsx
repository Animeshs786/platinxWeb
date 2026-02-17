// import React, { useState, useCallback, useRef } from "react";

// // ─── CONSTANTS ───────────────────────────────────────────────────────────────
// const AVAILABLE_INR = 841.05;
// const MIN_BTC = 0.000024;
// const FEE_RATE = 0.004;

// // ─── COLOR TOKENS ────────────────────────────────────────────────────────────
// const C = {
//   bg:         "#0b0e17",
//   bgDeep:     "#070a10",
//   bgInput:    "#111827",
//   bgInputHov: "#151d2e",
//   border:     "rgba(255,255,255,0.07)",
//   borderFocus:"rgba(240,185,11,0.35)",
//   accent:     "#f0b90b",
//   accentDim:  "rgba(240,185,11,0.12)",
//   green:      "#0ecb81",
//   greenDim:   "rgba(14,203,129,0.12)",
//   greenBorder:"rgba(14,203,129,0.35)",
//   red:        "#f6465d",
//   redDim:     "rgba(246,70,93,0.12)",
//   redBorder:  "rgba(246,70,93,0.35)",
//   label:      "#5a6478",
//   text:       "#c4cbd9",
//   textDim:    "#3d4659",
//   warnBg:     "rgba(246,70,93,0.08)",
//   warnBorder: "rgba(246,70,93,0.25)",
//   tooltipBg:  "#12192a",
//   mono:       "'IBM Plex Mono', 'JetBrains Mono', monospace",
// };

// // ─── HELPERS ─────────────────────────────────────────────────────────────────
// const fmtINR = (n, decimals = 4) =>
//   "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// const fmtINR0 = (n) =>
//   "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// // ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

// const InputGroup = ({ label, value, onChange, placeholder, unit, hint, badge, onBadge, noteText, focusColor }) => {
//   const [focused, setFocused] = useState(false);
//   return (
//     <div
//       style={{
//         background: focused ? C.bgInputHov : C.bgInput,
//         border: `1px solid ${focused ? (focusColor || C.borderFocus) : C.border}`,
//         borderRadius: 7,
//         padding: "10px 12px",
//         marginBottom: 8,
//         transition: "border-color 0.2s, background 0.2s",
//         width: "100%",
       
//       }}
//     >
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: 10, color: focused ? C.accent : C.label, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 5, transition: "color 0.15s" }}>
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
//               background: "transparent", border: "none", outline: "none",
//               fontFamily: C.mono, fontSize: 13, fontWeight: 600,
//               color: C.text, width: "100%",
//               fontVariantNumeric: "tabular-nums",
//             }}
//           />
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, flexShrink: 0 }}>
//           {badge && (
//             <span
//               onClick={onBadge}
//               style={{
//                 fontSize: 10, color: C.accent, fontWeight: 700, letterSpacing: "0.3px",
//                 padding: "2px 6px", background: C.accentDim,
//                 border: `1px solid rgba(240,185,11,0.2)`, borderRadius: 4, cursor: "pointer",
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
//         <div style={{ fontSize: 9, color: C.label, marginTop: 4, letterSpacing: "0.3px" }}>{noteText}</div>
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
//       <div style={{ fontSize: 12, fontWeight: 700, color: C.text, letterSpacing: "0.5px", marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${C.border}`, textTransform: "uppercase" }}>
//         Trading Fee Breakup
//       </div>
//       {[
//         { key: "Buy Price",  val: fmtINR0(price) },
//         { key: "Quantity",   val: `×${qty.toFixed(6)}` },
//         { key: "Amount",     val: fmtINR(amount) },
//         { key: "Fee (0.4%)", val: `+${fmtINR(fee)}`, color: C.accent },
//       ].map(({ key, val, color }) => (
//         <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//           <span style={{ fontSize: 11, color: C.label }}>{key}</span>
//           <span style={{ fontSize: 11, color: color || C.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{val}</span>
//         </div>
//       ))}
//       <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <span style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>Total</span>
//         <span style={{ fontSize: 13, color: C.accent, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmtINR(total)}</span>
//       </div>
//       {/* Arrow */}
//       <div style={{
//         position: "absolute", bottom: -6, left: 18,
//         width: 10, height: 10,
//         background: C.tooltipBg,
//         borderRight: "1px solid rgba(255,255,255,0.1)",
//         borderBottom: "1px solid rgba(255,255,255,0.1)",
//         transform: "rotate(45deg)",
//       }} />
//     </div>
//   );
// };

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// const OrderPlacement = () => {
//   const [side, setSide]         = useState("buy");      // "buy" | "sell"
//   const [orderType, setOrderType] = useState("limit");  // "limit" | "stoplimit"
//   const [limitPrice, setLimitPrice] = useState("6443615");
//   const [triggerPrice, setTriggerPrice] = useState("");
//   const [qty, setQty]           = useState("");
//   const [sliderVal, setSliderVal] = useState(0);
//   const [activePct, setActivePct] = useState(null);
//   const [placing, setPlacing]   = useState(false);
//   const [placed, setPlaced]     = useState(false);
//   const [feeHover, setFeeHover] = useState(false);

//   const price  = parseFloat(limitPrice.replace(/,/g, "")) || 0;
//   const qtyNum = parseFloat(qty) || 0;
//   const amount = price * qtyNum;
//   const fee    = amount * FEE_RATE;
//   const total  = amount + fee;

//   const handleSetPct = useCallback((p) => {
//     setActivePct(p);
//     if (p === "min") {
//       setQty(MIN_BTC.toFixed(6));
//       const pctN = Math.round((MIN_BTC * price / AVAILABLE_INR) * 100);
//       setSliderVal(Math.min(pctN, 100));
//     } else {
//       const budget = AVAILABLE_INR * (p / 100);
//       const q = Math.max(budget / (price || 1), MIN_BTC);
//       setQty(q.toFixed(6));
//       setSliderVal(p);
//     }
//   }, [price]);

//   const handleSlider = useCallback((v) => {
//     setSliderVal(v);
//     setActivePct(null);
//     if (v === 0) { setQty(""); return; }
//     const budget = AVAILABLE_INR * (v / 100);
//     const q = Math.max(budget / (price || 1), MIN_BTC);
//     setQty(q.toFixed(6));
//   }, [price]);

//   const handlePlaceOrder = () => {
//     if (placing || placed) return;
//     setPlacing(true);
//     setTimeout(() => {
//       setPlacing(false);
//       setPlaced(true);
//       setTimeout(() => setPlaced(false), 2000);
//     }, 800);
//   };

//   const handleSide = (s) => {
//     setSide(s);
//     setActivePct(null);
//     setLimitPrice(s === "buy" ? "6443615" : "6450000");
//   };

//   const handleType = (t) => {
//     setOrderType(t);
//     setLimitPrice(t === "stoplimit" ? "6440055" : "6443615");
//     setTriggerPrice("");
//     setQty("");
//     setSliderVal(0);
//     setActivePct(null);
//   };

//   const isGreen = side === "buy";
//   const btnColor   = isGreen ? C.green : C.red;
//   const btnTextCol = isGreen ? "#000"  : "#fff";

//   const pctClass = (p) => {
//     if (activePct !== p) return {};
//     return {
//       background:   isGreen ? C.greenDim : C.redDim,
//       color:        isGreen ? C.green    : C.red,
//       borderColor:  isGreen ? C.greenBorder : C.redBorder,
//     };
//   };

//   const placeBtnLabel = placing ? "Processing…"
//     : placed ? "✓ Order Placed"
//     : `Place ${side === "buy" ? "Buy" : "Sell"} Order`;

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
//       }}
//     >
//       {/* ── BUY / SELL ── */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: C.bgDeep, borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
//         {["buy", "sell"].map((s) => (
//           <button
//             key={s}
//             onClick={() => handleSide(s)}
//             style={{
//               padding: "13px 0",
//               fontFamily: C.mono,
//               fontSize: 13, fontWeight: 700, letterSpacing: "0.8px",
//               textTransform: "uppercase",
//               border: "none", cursor: "pointer",
//               transition: "all 0.2s ease",
//               background: side === s ? (s === "buy" ? C.green : C.red) : "transparent",
//               color: side === s ? (s === "buy" ? "#000" : "#fff") : (s === "buy" ? C.green : C.red),
//             }}
//           >
//             {s === "buy" ? "Buy" : "Sell"}
//           </button>
//         ))}
//       </div>

//       {/* ── ORDER TYPE TABS ── */}
//       <div style={{ display: "flex", padding: "12px 14px 0", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
//         {["limit", "stoplimit"].map((t) => (
//           <button
//             key={t}
//             onClick={() => handleType(t)}
//             style={{
//               padding: "8px 14px", fontFamily: C.mono,
//               fontSize: 12, fontWeight: 600, letterSpacing: "0.4px",
//               border: "none", cursor: "pointer", background: "transparent",
//               color: orderType === t ? C.accent : C.label,
//               borderBottom: `2px solid ${orderType === t ? C.accent : "transparent"}`,
//               marginBottom: -1,
//               transition: "all 0.18s",
//             }}
//           >
//             {t === "limit" ? "Limit" : "Stop Limit"}
//           </button>
//         ))}
//       </div>

//       {/* ── BODY ── */}
//       <div style={{ padding: 14 }}>

//         {/* Available */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
//           <span style={{ fontSize: 10, color: C.label, letterSpacing: "0.6px", textTransform: "uppercase" }}>Available INR</span>
//           <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: C.text }}>
//             {AVAILABLE_INR.toFixed(2)}
//             <span style={{ width: 16, height: 16, background: C.accentDim, border: "1px solid rgba(240,185,11,.25)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: C.accent, cursor: "pointer" }}>↙</span>
//           </span>
//         </div>

//         {/* Trigger Price (Stop Limit only) */}
//         {orderType === "stoplimit" && (
//           <InputGroup
//             label="Trigger Price"
//             value={triggerPrice}
//             onChange={e => setTriggerPrice(e.target.value)}
//             placeholder="--"
//             unit="INR"
//             noteText="Order executes when market hits trigger"
//           />
//         )}

//         {/* Limit Price */}
//         <InputGroup
//           label="Limit Price"
//           value={limitPrice}
//           onChange={e => setLimitPrice(e.target.value)}
//           unit="INR"
//           badge={side === "buy" ? "Get Lowest" : "Get Highest"}
//           onBadge={() => setLimitPrice(side === "buy" ? "6443615" : "6450000")}
//         />

//         {/* Quantity */}
//         <InputGroup
//           label="Quantity"
//           value={qty}
//           onChange={e => setQty(e.target.value)}
//           placeholder="0.000000"
//           unit="BTC"
//           hint="Min : 0.000024"
//         />

//         {/* Total */}
//         <div style={{ background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px", marginBottom: 8 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <div>
//               <div style={{ fontSize: 10, color: C.label, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 5 }}>Total INR Value</div>
//               <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
//                 <span style={{ fontSize: 15, fontWeight: 700, color: C.text, fontVariantNumeric: "tabular-nums" }}>
//                   {total > 0 ? total.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0"}
//                 </span>
//                 <span style={{ fontSize: 10, color: C.label }}>INR</span>
//               </div>
//             </div>
//             <span style={{ fontSize: 9, color: C.label, letterSpacing: "0.3px" }}>FEE 0.4%</span>
//           </div>
//         </div>

//         {/* Quick % buttons */}
//         <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
//           {[
//             { label: "Min 0.000024 BTC", key: "min" },
//             { label: "25%",  key: 25 },
//             { label: "50%",  key: 50 },
//             { label: "100%", key: 100 },
//           ].map(({ label: lb, key }) => (
//             <button
//               key={key}
//               onClick={() => handleSetPct(key)}
//               style={{
//                 padding: "6px 0",
//                 fontFamily: C.mono, fontSize: 10, fontWeight: 600, letterSpacing: "0.3px",
//                 borderRadius: 5, cursor: "pointer", textAlign: "center",
//                 transition: "all 0.15s",
//                 border: `1px solid ${C.border}`,
//                 background: C.bgInput,
//                 color: C.label,
//                 ...pctClass(key),
//               }}
//             >
//               {lb}
//             </button>
//           ))}
//         </div>

//         {/* Slider */}
//         <div style={{ padding: "2px 0 8px" }}>
//           <input
//             type="range" min="0" max="100" value={sliderVal}
//             onChange={e => handleSlider(Number(e.target.value))}
//             style={{ width: "100%", accentColor: C.accent, cursor: "pointer" }}
//           />
//           <div style={{ textAlign: "right", fontSize: 10, color: C.accent, fontWeight: 600, marginTop: 2, letterSpacing: "0.3px" }}>
//             {sliderVal}%
//           </div>
//         </div>

//         {/* Low Balance Warning */}
//         <div style={{
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           background: "rgba(246,70,93,0.08)", border: `1px solid rgba(246,70,93,0.25)`,
//           borderRadius: 7, padding: "9px 12px", marginBottom: 12,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//             <span style={{ fontSize: 13, color: C.red }}>⚠</span>
//             <span style={{ fontSize: 11, fontWeight: 600, color: C.red, letterSpacing: "0.3px" }}>Low Wallet Balance</span>
//           </div>
//           <button
//             style={{
//               fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
//               background: C.accent, color: "#000", border: "none", borderRadius: 5,
//               padding: "6px 10px", cursor: "pointer", whiteSpace: "nowrap",
//             }}
//           >
//             Deposit ↙
//           </button>
//         </div>

//         {/* Place Order */}
//         <button
//           onClick={handlePlaceOrder}
//           disabled={placing}
//           style={{
//             width: "100%", padding: 14,
//             fontFamily: C.mono, fontSize: 13, fontWeight: 700, letterSpacing: "0.8px",
//             textTransform: "uppercase", border: "none", borderRadius: 7, cursor: "pointer",
//             transition: "all 0.2s",
//             background: placed ? (isGreen ? "#0aab6a" : "#cc3347") : btnColor,
//             color: btnTextCol,
//             marginBottom: 12,
//             opacity: placing ? 0.7 : 1,
//             boxShadow: `0 4px 20px ${isGreen ? "rgba(14,203,129,0.2)" : "rgba(246,70,93,0.2)"}`,
//           }}
//         >
//           {placeBtnLabel}
//         </button>

//         {/* Fee Breakup */}
//         <div
//           style={{ display: "flex", alignItems: "center", gap: 6, position: "relative", paddingBottom: 4 }}
//           onMouseEnter={() => setFeeHover(true)}
//           onMouseLeave={() => setFeeHover(false)}
//         >
//           <span style={{
//             fontSize: 11, color: feeHover ? C.accent : C.label,
//             borderBottom: `1px dashed ${feeHover ? C.accent : C.textDim}`,
//             letterSpacing: "0.3px", cursor: "pointer",
//             transition: "color 0.15s, border-color 0.15s",
//             userSelect: "none",
//           }}>
//             Fee breakup
//           </span>
//           <span style={{ fontSize: 10, color: C.label }}>ⓘ</span>

//           <FeeTooltip price={price} qty={qtyNum} visible={feeHover} />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default OrderPlacement;



import React, { useState, useCallback, useRef } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const AVAILABLE_INR = 841.05;
const MIN_BTC = 0.000024;
const FEE_RATE = 0.004;

// ─── COLOR TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:         "#0b0e17",
  bgDeep:     "#070a10",
  bgInput:    "#111827",
  bgInputHov: "#151d2e",
  border:     "rgba(255,255,255,0.07)",
  borderFocus:"rgba(240,185,11,0.35)",
  accent:     "#f0b90b",
  accentDim:  "rgba(240,185,11,0.12)",
  green:      "#0ecb81",
  greenDim:   "rgba(14,203,129,0.12)",
  greenBorder:"rgba(14,203,129,0.35)",
  red:        "#f6465d",
  redDim:     "rgba(246,70,93,0.12)",
  redBorder:  "rgba(246,70,93,0.35)",
  label:      "#5a6478",
  text:       "#c4cbd9",
  textDim:    "#3d4659",
  warnBg:     "rgba(246,70,93,0.08)",
  warnBorder: "rgba(246,70,93,0.25)",
  tooltipBg:  "#12192a",
  mono:       "'IBM Plex Mono', 'JetBrains Mono', monospace",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtINR = (n, decimals = 4) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const fmtINR0 = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const InputGroup = ({ label, value, onChange, placeholder, unit, hint, badge, onBadge, noteText, focusColor }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        background: focused ? C.bgInputHov : C.bgInput,
        border: `1px solid ${focused ? (focusColor || C.borderFocus) : C.border}`,
        borderRadius: 7,
        padding: "9px 12px",                    // ← reduced from 10px
        marginBottom: 7,                        // ← reduced from 8
        transition: "border-color 0.2s, background 0.2s",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: focused ? C.accent : C.label, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 4, transition: "color 0.15s" }}>
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
              background: "transparent", border: "none", outline: "none",
              fontFamily: C.mono, fontSize: 13, fontWeight: 600,
              color: C.text, width: "100%",
              fontVariantNumeric: "tabular-nums",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, flexShrink: 0 }}>
          {badge && (
            <span
              onClick={onBadge}
              style={{
                fontSize: 10, color: C.accent, fontWeight: 700, letterSpacing: "0.3px",
                padding: "2px 6px", background: C.accentDim,
                border: `1px solid rgba(240,185,11,0.2)`, borderRadius: 4, cursor: "pointer",
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
        <div style={{ fontSize: 9, color: C.label, marginTop: 3, letterSpacing: "0.3px" }}>{noteText}</div>
      )}
    </div>
  );
};

const FeeTooltip = ({ price, qty, visible }) => {
  const amount = price * qty;
  const fee = amount * FEE_RATE;
  const total = amount + fee;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(100% + 10px)",
        left: 0,
        width: 240,
        background: C.tooltipBg,
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(240,185,11,0.08)",
        zIndex: 100,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: C.text, letterSpacing: "0.5px", marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${C.border}`, textTransform: "uppercase" }}>
        Trading Fee Breakup
      </div>
      {[
        { key: "Buy Price",  val: fmtINR0(price) },
        { key: "Quantity",   val: `×${qty.toFixed(6)}` },
        { key: "Amount",     val: fmtINR(amount) },
        { key: "Fee (0.4%)", val: `+${fmtINR(fee)}`, color: C.accent },
      ].map(({ key, val, color }) => (
        <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: C.label }}>{key}</span>
          <span style={{ fontSize: 11, color: color || C.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{val}</span>
        </div>
      ))}
      <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>Total</span>
        <span style={{ fontSize: 13, color: C.accent, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmtINR(total)}</span>
      </div>
      {/* Arrow */}
      <div style={{
        position: "absolute", bottom: -6, left: 18,
        width: 10, height: 10,
        background: C.tooltipBg,
        borderRight: "1px solid rgba(255,255,255,0.1)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        transform: "rotate(45deg)",
      }} />
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const OrderPlacement = () => {
  const [side, setSide]         = useState("buy");
  const [orderType, setOrderType] = useState("limit");
  const [limitPrice, setLimitPrice] = useState("6443615");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [qty, setQty]           = useState("");
  const [sliderVal, setSliderVal] = useState(0);
  const [activePct, setActivePct] = useState(null);
  const [placing, setPlacing]   = useState(false);
  const [placed, setPlaced]     = useState(false);
  const [feeHover, setFeeHover] = useState(false);

  const price  = parseFloat(limitPrice.replace(/,/g, "")) || 0;
  const qtyNum = parseFloat(qty) || 0;
  const amount = price * qtyNum;
  const fee    = amount * FEE_RATE;
  const total  = amount + fee;

  const handleSetPct = useCallback((p) => {
    setActivePct(p);
    if (p === "min") {
      setQty(MIN_BTC.toFixed(6));
      const pctN = Math.round((MIN_BTC * price / AVAILABLE_INR) * 100);
      setSliderVal(Math.min(pctN, 100));
    } else {
      const budget = AVAILABLE_INR * (p / 100);
      const q = Math.max(budget / (price || 1), MIN_BTC);
      setQty(q.toFixed(6));
      setSliderVal(p);
    }
  }, [price]);

  const handleSlider = useCallback((v) => {
    setSliderVal(v);
    setActivePct(null);
    if (v === 0) { setQty(""); return; }
    const budget = AVAILABLE_INR * (v / 100);
    const q = Math.max(budget / (price || 1), MIN_BTC);
    setQty(q.toFixed(6));
  }, [price]);

  const handlePlaceOrder = () => {
    if (placing || placed) return;
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setPlaced(true);
      setTimeout(() => setPlaced(false), 2000);
    }, 800);
  };

  const handleSide = (s) => {
    setSide(s);
    setActivePct(null);
    setLimitPrice(s === "buy" ? "6443615" : "6450000");
  };

  const handleType = (t) => {
    setOrderType(t);
    setLimitPrice(t === "stoplimit" ? "6440055" : "6443615");
    setTriggerPrice("");
    setQty("");
    setSliderVal(0);
    setActivePct(null);
  };

  const isGreen = side === "buy";
  const btnColor   = isGreen ? C.green : C.red;
  const btnTextCol = isGreen ? "#000"  : "#fff";

  const pctClass = (p) => {
    if (activePct !== p) return {};
    return {
      background:   isGreen ? C.greenDim : C.redDim,
      color:        isGreen ? C.green    : C.red,
      borderColor:  isGreen ? C.greenBorder : C.redBorder,
    };
  };

  const placeBtnLabel = placing ? "Processing…"
    : placed ? "✓ Order Placed"
    : `Place ${side === "buy" ? "Buy" : "Sell"} Order`;

  return (
    <div
      style={{
        width: 300,
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: "visible",
        boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
        fontFamily: C.mono,
        position: "relative",
      }}
    >
      {/* ── BUY / SELL ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: C.bgDeep, borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
        {["buy", "sell"].map((s) => (
          <button
            key={s}
            onClick={() => handleSide(s)}
            style={{
              padding: "10px 0",                    // ← was 13px
              fontFamily: C.mono,
              fontSize: 13, fontWeight: 700, letterSpacing: "0.8px",
              textTransform: "uppercase",
              border: "none", cursor: "pointer",
              transition: "all 0.2s ease",
              background: side === s ? (s === "buy" ? C.green : C.red) : "transparent",
              color: side === s ? (s === "buy" ? "#000" : "#fff") : (s === "buy" ? C.green : C.red),
            }}
          >
            {s === "buy" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>

      {/* ── ORDER TYPE TABS ── */}
      <div style={{ display: "flex", padding: "8px 14px 0", borderBottom: `1px solid ${C.border}`, background: C.bg }}> {/* ← was 12px */}
        {["limit", "stoplimit"].map((t) => (
          <button
            key={t}
            onClick={() => handleType(t)}
            style={{
              padding: "8px 14px", fontFamily: C.mono,
              fontSize: 12, fontWeight: 600, letterSpacing: "0.4px",
              border: "none", cursor: "pointer", background: "transparent",
              color: orderType === t ? C.accent : C.label,
              borderBottom: `2px solid ${orderType === t ? C.accent : "transparent"}`,
              marginBottom: -1,
              transition: "all 0.18s",
            }}
          >
            {t === "limit" ? "Limit" : "Stop Limit"}
          </button>
        ))}
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "10px 14px" }}>   {/* ← was 14 all around */}

        {/* Available */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}> {/* ← was 14 */}
          <span style={{ fontSize: 10, color: C.label, letterSpacing: "0.6px", textTransform: "uppercase" }}>Available INR</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: C.text }}>
            {AVAILABLE_INR.toFixed(2)}
            <span style={{ width: 16, height: 16, background: C.accentDim, border: "1px solid rgba(240,185,11,.25)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: C.accent, cursor: "pointer" }}>↙</span>
          </span>
        </div>

        {/* Trigger Price (Stop Limit only) */}
        {orderType === "stoplimit" && (
          <InputGroup
            label="Trigger Price"
            value={triggerPrice}
            onChange={e => setTriggerPrice(e.target.value)}
            placeholder="--"
            unit="INR"
            noteText="Order executes when market hits trigger"
          />
        )}

        {/* Limit Price */}
        <InputGroup
          label="Limit Price"
          value={limitPrice}
          onChange={e => setLimitPrice(e.target.value)}
          unit="INR"
          badge={side === "buy" ? "Get Lowest" : "Get Highest"}
          onBadge={() => setLimitPrice(side === "buy" ? "6443615" : "6450000")}
        />

        {/* Quantity */}
        <InputGroup
          label="Quantity"
          value={qty}
          onChange={e => setQty(e.target.value)}
          placeholder="0.000000"
          unit="BTC"
          hint="Min : 0.000024"
        />

        {/* Total */}
        <div style={{ background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: 7, padding: "9px 12px", marginBottom: 8 }}> {/* ← padding 10→9 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, color: C.label, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 5 }}>Total INR Value</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.text, fontVariantNumeric: "tabular-nums" }}>
                  {total > 0 ? total.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0"}
                </span>
                <span style={{ fontSize: 10, color: C.label }}>INR</span>
              </div>
            </div>
            <span style={{ fontSize: 9, color: C.label, letterSpacing: "0.3px" }}>FEE 0.4%</span>
          </div>
        </div>

        {/* Quick % buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 5, marginBottom: 8 }}> {/* ← gap 6→5, mb 10→8 */}
          {[
            { label: "Min 0.000024 BTC", key: "min" },
            { label: "25%",  key: 25 },
            { label: "50%",  key: 50 },
            { label: "100%", key: 100 },
          ].map(({ label: lb, key }) => (
            <button
              key={key}
              onClick={() => handleSetPct(key)}
              style={{
                padding: "6px 0",
                fontFamily: C.mono, fontSize: 10, fontWeight: 600, letterSpacing: "0.3px",
                borderRadius: 5, cursor: "pointer", textAlign: "center",
                transition: "all 0.15s",
                border: `1px solid ${C.border}`,
                background: C.bgInput,
                color: C.label,
                ...pctClass(key),
              }}
            >
              {lb}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div style={{ padding: "2px 0 5px" }}>  {/* ← bottom was 8 → 5 */}
          <input
            type="range" min="0" max="100" value={sliderVal}
            onChange={e => handleSlider(Number(e.target.value))}
            style={{ width: "100%", accentColor: C.accent, cursor: "pointer" }}
          />
          <div style={{ textAlign: "right", fontSize: 10, color: C.accent, fontWeight: 600, marginTop: 2, letterSpacing: "0.3px" }}>
            {sliderVal}%
          </div>
        </div>

        {/* Low Balance Warning */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(246,70,93,0.08)", border: `1px solid rgba(246,70,93,0.25)`,
          borderRadius: 7, padding: "9px 12px", marginBottom: 9,           // ← mb was 12 → 9
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: C.red }}>⚠</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.red, letterSpacing: "0.3px" }}>Low Wallet Balance</span>
          </div>
          <button
            style={{
              fontFamily: C.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
              background: C.accent, color: "#000", border: "none", borderRadius: 5,
              padding: "6px 10px", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Deposit ↙
          </button>
        </div>

        {/* Place Order */}
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          style={{
            width: "100%", padding: "12px",               // ← was 14 → 12
            fontFamily: C.mono, fontSize: 13, fontWeight: 700, letterSpacing: "0.8px",
            textTransform: "uppercase", border: "none", borderRadius: 7, cursor: "pointer",
            transition: "all 0.2s",
            background: placed ? (isGreen ? "#0aab6a" : "#cc3347") : btnColor,
            color: btnTextCol,
            marginBottom: 9,                              // ← was 12 → 9
            opacity: placing ? 0.7 : 1,
            boxShadow: `0 4px 20px ${isGreen ? "rgba(14,203,129,0.2)" : "rgba(246,70,93,0.2)"}`,
          }}
        >
          {placeBtnLabel}
        </button>

        {/* Fee Breakup */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 6, position: "relative", paddingBottom: 4 }}
          onMouseEnter={() => setFeeHover(true)}
          onMouseLeave={() => setFeeHover(false)}
        >
          <span style={{
            fontSize: 11, color: feeHover ? C.accent : C.label,
            borderBottom: `1px dashed ${feeHover ? C.accent : C.textDim}`,
            letterSpacing: "0.3px", cursor: "pointer",
            transition: "color 0.15s, border-color 0.15s",
            userSelect: "none",
          }}>
            Fee breakup
          </span>
          <span style={{ fontSize: 10, color: C.label }}>ⓘ</span>

          <FeeTooltip price={price} qty={qtyNum} visible={feeHover} />
        </div>

      </div>
    </div>
  );
};

export default OrderPlacement;