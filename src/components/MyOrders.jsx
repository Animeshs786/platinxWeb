

// import React, { useState, useMemo } from "react";

// // ── Mock data ─────────────────────────────────────────────────────────────────
// const ALL_ORDERS = [
//   {
//     id: 1,
//     pair: "OM/INR",
//     side: "Buy",
//     type: "Limit",
//     exchange: "CoinSwitchX",
//     quantity: 33.2,
//     amount: 199.2,
//     limitPrice: 6.0,
//     lastPrice: 3.56,
//     status: "Filled",
//     progress: "100%",
//     createdAt: "11:34:24",
//   },
//   {
//     id: 2,
//     pair: "LIGHT/INR",
//     side: "Buy",
//     type: "Limit",
//     exchange: "CoinSwitchX",
//     quantity: 8.93,
//     amount: 199.14,
//     limitPrice: 22.3,
//     lastPrice: 22.28,
//     status: "Open",
//     progress: "0%",
//     createdAt: "11:28:37",
//   },
//   {
//     id: 3,
//     pair: "LIGHT/INR",
//     side: "Buy",
//     type: "Limit",
//     exchange: "CoinSwitchX",
//     quantity: 8.94,
//     amount: 199.18,
//     limitPrice: 22.28,
//     lastPrice: 22.28,
//     status: "Cancelled",
//     progress: "--",
//     createdAt: "11:25:16",
//   },
//   {
//     id: 4,
//     pair: "USDT/INR",
//     side: "Sell",
//     type: "Limit",
//     exchange: "CoinSwitchX",
//     quantity: 5.0,
//     amount: 474.0,
//     limitPrice: 94.8,
//     lastPrice: 94.36,
//     status: "Filled",
//     progress: "100%",
//     createdAt: "13:52:45",
//   },
//   {
//     id: 5,
//     pair: "USDT/INR",
//     side: "Buy",
//     type: "Limit",
//     exchange: "CoinSwitchX",
//     quantity: 5.0,
//     amount: 473.95,
//     limitPrice: 94.79,
//     lastPrice: 94.36,
//     status: "Filled",
//     progress: "100%",
//     createdAt: "13:20:37",
//   },
//   {
//     id: 6,
//     pair: "OM/INR",
//     side: "Buy",
//     type: "Limit",
//     exchange: "CoinSwitchX",
//     quantity: 30.0,
//     amount: 150.0,
//     limitPrice: 5.0,
//     lastPrice: 5.56,
//     status: "Open",
//     progress: "0.00%",
//     createdAt: "13:28:24",
//   },
//   {
//     id: 7,
//     pair: "OM/INR",
//     side: "Buy",
//     type: "Limit",
//     exchange: "CoinSwitchX",
//     quantity: 30.0,
//     amount: 150.0,
//     limitPrice: 5.0,
//     lastPrice: 5.56,
//     status: "Cancelled",
//     progress: "--",
//     createdAt: "12:09:33",
//   },
// ];

// // ── Coin icon ─────────────────────────────────────────────────────────────────
// const getCoinIcon = (pair) => {
//   const base = pair.split("/")[0].toLowerCase();
//   return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/${base}.png`;
// };

// const CoinIcon = ({ pair }) => {
//   const [err, setErr] = useState(false);
//   const base = pair.split("/")[0];
//   if (!err) {
//     return (
//       <img
//         src={getCoinIcon(pair)}
//         alt={base}
//         onError={() => setErr(true)}
//         style={{ width: 20, height: 20, borderRadius: "50%" }}
//       />
//     );
//   }
//   const colors = ["#f97316", "#3b82f6", "#22c55e", "#eab308"];
//   const bg = colors[base.charCodeAt(0) % colors.length];
//   return (
//     <div
//       style={{
//         width: 20,
//         height: 20,
//         borderRadius: "50%",
//         background: bg,
//         fontSize: 8,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         color: "#fff",
//         fontWeight: 800,
//       }}
//     >
//       {base.slice(0, 2)}
//     </div>
//   );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const MyOrders = ({ openOnly = false }) => {
//   const filtered = useMemo(() => {
//     let data = [...ALL_ORDERS];
//     if (openOnly) data = data.filter((o) => o.status === "Open");
//     return data;
//   }, [openOnly]);

//   const handleClose = (id) => {
//     console.log("Close order:", id);
//   };

//   return (
//     <div style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace" }}>
//       {/* Table */}
//       <div
//         style={{
//           background: "#0b0e17",
//           borderRadius: 8,
//           overflow: "hidden",
//           border: "1px solid rgba(255,255,255,0.06)",
//         }}
//       >
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr
//               style={{
//                 background: "#080b12",
//                 borderBottom: "1px solid rgba(255,255,255,0.05)",
//               }}
//             >
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "left",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Pair
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "left",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Buy/Sell
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "left",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Order Type
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "left",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Exchange
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "right",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Quantity
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "right",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Amount
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "right",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Limit Price
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "right",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Last Price
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "left",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Status
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "center",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Progress
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "right",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Created at
//               </th>
//               <th
//                 style={{
//                   padding: "12px 16px",
//                   textAlign: "center",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   letterSpacing: "0.5px",
//                 }}
//               ></th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={12}
//                   style={{
//                     padding: "40px",
//                     textAlign: "center",
//                     color: "#4b5563",
//                     fontSize: 13,
//                   }}
//                 >
//                   No orders found
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((order) => (
//                 <tr
//                   key={order.id}
//                   style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
//                 >
//                   <td style={{ padding: "12px 16px" }}>
//                     <div
//                       style={{ display: "flex", alignItems: "center", gap: 8 }}
//                     >
//                       <CoinIcon pair={order.pair} />
//                       <span
//                         style={{
//                           fontSize: 13,
//                           color: "#e5e7eb",
//                           fontWeight: 600,
//                         }}
//                       >
//                         {order.pair}
//                       </span>
//                     </div>
//                   </td>
//                   <td style={{ padding: "12px 16px" }}>
//                     <span
//                       style={{
//                         fontSize: 12,
//                         fontWeight: 700,
//                         color: order.side === "Buy" ? "#22c55e" : "#ef4444",
//                       }}
//                     >
//                       {order.side}
//                     </span>
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px 16px",
//                       fontSize: 12,
//                       color: "#9ca3af",
//                     }}
//                   >
//                     {order.type}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px 16px",
//                       fontSize: 12,
//                       color: "#9ca3af",
//                     }}
//                   >
//                     {order.exchange}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px 16px",
//                       fontSize: 12,
//                       color: "#d1d5db",
//                       textAlign: "right",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {order.quantity}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px 16px",
//                       fontSize: 12,
//                       color: "#d1d5db",
//                       textAlign: "right",
//                       fontWeight: 600,
//                     }}
//                   >
//                     ₹{order.amount.toFixed(2)}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px 16px",
//                       fontSize: 12,
//                       color: "#9ca3af",
//                       textAlign: "right",
//                     }}
//                   >
//                     ₹{order.limitPrice}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px 16px",
//                       fontSize: 12,
//                       color: "#9ca3af",
//                       textAlign: "right",
//                     }}
//                   >
//                     ₹{order.lastPrice}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px 16px",
//                       fontSize: 12,
//                       color:
//                         order.status === "Filled"
//                           ? "#22c55e"
//                           : order.status === "Open"
//                             ? "#3b82f6"
//                             : "#6b7280",
//                     }}
//                   >
//                     {order.status}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px 16px",
//                       fontSize: 12,
//                       color: "#d1d5db",
//                       textAlign: "center",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {order.progress}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px 16px",
//                       fontSize: 11,
//                       color: "#6b7280",
//                       textAlign: "right",
//                     }}
//                   >
//                     {order.createdAt}
//                   </td>
//                   <td style={{ padding: "12px 16px", textAlign: "center" }}>
//                     {order.status === "Open" && (
//                       <button
//                         onClick={() => handleClose(order.id)}
//                         style={{
//                           background: "transparent",
//                           border: "none",
//                           color: "#3b82f6",
//                           cursor: "pointer",
//                           fontSize: 11,
//                           fontWeight: 600,
//                           textDecoration: "underline",
//                         }}
//                       >
//                         Close
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MyOrders;







































import React, { useState, useEffect, useCallback, useRef } from 'react';
import { io } from "socket.io-client";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const OPEN_ORDERS_URL = "http://159.89.146.245:3535/api/coinswitch/spot/orders/open";
const CLOSED_ORDERS_URL = "http://159.89.146.245:3535/api/coinswitch/spot/orders/closed";
const BASE_URL = "wss://ws.coinswitch.co";
const NAMESPACE = "/coinswitchx";
const EVENT_NAME = "FETCH_TRADES_CS_PRO";
const PAIRS = ["LIGHT,INR"]; // Hardcoded based on sample, can make dynamic

// ── Coin icon ─────────────────────────────────────────────────────────────────
const getCoinIcon = (pair) => {
  const base = pair.split('/')[0].toLowerCase();
  return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/${base}.png`;
};

const CoinIcon = ({ pair }) => {
  const [err, setErr] = useState(false);
  const base = pair.split('/')[0];
  if (!err) {
    return <img src={getCoinIcon(pair)} alt={base} onError={() => setErr(true)} style={{ width: 20, height: 20, borderRadius: '50%' }} />;
  }
  const colors = ['#f97316', '#3b82f6', '#22c55e', '#eab308'];
  const bg = colors[base.charCodeAt(0) % colors.length];
  return <div style={{ width: 20, height: 20, borderRadius: '50%', background: bg, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>{base.slice(0,2)}</div>;
};

// ── Main Component ────────────────────────────────────────────────────────────
const MyOrders = ({ openOnly, onRefresh }) => {
  const socketRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      let allOrders = [];

      const openRes = await fetch(OPEN_ORDERS_URL);
      const openJson = await openRes.json();
      if (openJson.success) {
        allOrders = allOrders.concat(openJson.data.data.orders.map(o => ({ ...o, status: 'OPEN' }))); // Ensure status
      }

      if (!openOnly) {
        const closedRes = await fetch(CLOSED_ORDERS_URL);
        const closedJson = await closedRes.json();
        if (closedJson.success) {
          allOrders = allOrders.concat(closedJson.data.data.orders);
        }
      }

      // Sort by created_time desc
      allOrders.sort((a, b) => b.created_time - a.created_time);

      setOrders(allOrders);
    } catch (e) {
      console.error("Orders fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [openOnly]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const socket = io(BASE_URL + NAMESPACE, {
      path: "/pro/realtime-rates-socket/spot/coinswitchx",
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 3000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      PAIRS.forEach(pair => {
        socket.emit(EVENT_NAME, { event: "subscribe", pair });
      });
    });

    socket.on(EVENT_NAME, (data) => {
      if (PAIRS.includes(data?.s)) {
        fetchOrders();
      }
    });

    return () => socket.disconnect();
  }, [fetchOrders]);

  const handleClose = (id) => {
    setSelectedOrderId(id);
    setShowModal(true);
  };

  const confirmClose = async () => {
    if (!selectedOrderId) return;

    try {
      const res = await fetch(`http://159.89.146.245:3535/api/coinswitch/spot/orders/${selectedOrderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchOrders();
      } else {
        console.error("Failed to cancel order");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setShowModal(false);
      setSelectedOrderId(null);
    }
  };

  if (loading) {
    return <div style={{ color: '#e5e7eb', padding: '20px', textAlign: 'center' }}>Loading orders...</div>;
  }

  return (
    <div style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace" }}>
      {/* Table */}
      <div style={{ background: '#0b0e17', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#080b12', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Pair</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Buy/Sell</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Order Type</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Exchange</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Quantity</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Amount</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Limit Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Last Price</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Progress</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Created at</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ padding: '40px', textAlign: 'center', color: '#4b5563', fontSize: 13 }}>
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const progress = order.orig_qty > 0 ? ((order.executed_qty / order.orig_qty) * 100).toFixed(2) + '%' : '--';
                const statusDisplay = order.status === 'OPEN' ? 'Open' : order.status === 'EXECUTED' ? 'Filled' : order.status;
                const statusColor = statusDisplay === 'Open' ? '#3b82f6' : statusDisplay === 'Filled' ? '#22c55e' : '#6b7280';
                const amount = (order.average_price || order.price) * order.orig_qty;
                const createdAt = new Date(order.created_time).toLocaleTimeString('en-IN', { hour12: false });
                const lastPrice = order.average_price > 0 ? order.average_price : '--';
                const orderType = 'Limit'; // Assume, as not in data

                return (
                  <tr key={order.order_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CoinIcon pair={order.symbol} />
                        <span style={{ fontSize: 13, color: '#e5e7eb', fontWeight: 600 }}>{order.symbol}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: order.side === 'BUY' ? '#22c55e' : '#ef4444' }}>
                        {order.side === 'BUY' ? 'Buy' : 'Sell'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af' }}>{orderType}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af' }}>{order.exchange}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'right', fontWeight: 600 }}>{order.orig_qty}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'right', fontWeight: 600 }}>₹{amount.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>₹{order.price}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>₹{lastPrice}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: statusColor }}>{statusDisplay}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#d1d5db', textAlign: 'center', fontWeight: 600 }}>{progress}</td>
                    <td style={{ padding: '12px 16px', fontSize: 11, color: '#6b7280', textAlign: 'right' }}>{createdAt}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {order.status === 'OPEN' && (
                        <button
                          onClick={() => handleClose(order.order_id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            fontSize: 11,
                            fontWeight: 600,
                            textDecoration: 'underline',
                          }}
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#0b0e17',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 24,
            width: 300,
            textAlign: 'center',
          }}>
            <h3 style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 16 }}>Confirm Cancel Order?</h3>
            <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #6b7280',
                  background: 'transparent',
                  color: '#e5e7eb',
                  cursor: 'pointer',
                }}
              >
                No
              </button>
              <button
                onClick={confirmClose}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#ef4444',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;