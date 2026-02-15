import React, { useEffect, useRef } from "react";

const TradingChart = () => {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous script if any
    const existingScript = document.getElementById("tradingview-script");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = "tradingview-script";
    script.src = "https://s3.tradingview.com/tv.js";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          width: "100%",
          height: "100%",
          symbol: "BITSTAMP:BTCUSD * FX_IDC:USDINR", // BTC/INR approximation
          interval: "60", // Default 1 hour
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1", // Candlesticks
          locale: "en",
          toolbar_bg: "#0f1419",
          enable_publishing: false,
          hide_top_toolbar: false,       // ← IMPORTANT: Top toolbar ON (timeframe, zoom, indicators)
          hide_legend: true,
          save_image: false,
          studies: ["MAExp@tv-basicstudies", "MASimple@tv-basicstudies"],
          studies_overrides: {
            "moving average exponential.length": 9,
            "moving average exponential.plot.color": "#a855f7",
            "moving average exponential.plot.linewidth": 2,
            "moving average simple.length": 30,
            "moving average simple.plot.color": "#eab308",
            "moving average simple.plot.linewidth": 2,
          },
          container_id: "tradingview_chart_container",
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  // Optional resize handler (helps in responsive layouts)
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (widgetRef.current?.activeChart) {
        widgetRef.current.activeChart().resize();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="bg-[#0f1419] rounded-lg flex flex-col border border-gray-800 shadow-lg overflow-hidden h-full">
      {/* Header - Price + Stats */}
      <div className="px-4 py-2.5 border-b border-gray-800 bg-[#0a0e13] flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-base">
            ₿
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center">
              BTC/INR <span className="ml-1.5 text-yellow-500">★</span>
            </h2>
            <div className="text-xs text-gray-400">CoinSwitchX</div>
          </div>
        </div>

        <div className="flex items-center space-x-5">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-white">₹67,00,292</span>
            <span className="text-green-500">+0.35%</span>
          </div>

          <div className="flex space-x-5 text-gray-300 text-xs">
            <div>
              <span className="text-gray-500">24H High</span><br />₹67,910
            </div>
            <div>
              <span className="text-gray-500">24H Low</span><br />₹65,56,987
            </div>
            <div>
              <span className="text-gray-500">24H Vol (INR)</span><br />₹76,72,219
            </div>
            <div>
              <span className="text-gray-500">24H Vol (BTC)</span><br />1.15
            </div>
          </div>
        </div>
      </div>

      {/* Moving Averages Info */}
      <div className="px-4 py-1.5 text-xs text-gray-400 border-b border-gray-800 bg-[#0a0e13] flex space-x-5">
        <div>
          MA 30 <span className="text-white">66,68,133</span>
        </div>
        <div>
          EMA 9 <span className="text-purple-400">66,88,863</span>
        </div>
      </div>

      {/* Chart Area - TradingView handles timeframe selector here */}
      <div className="flex-1 max-h-[480px]" ref={containerRef}>
        <div
          id="tradingview_chart_container"
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      {/* Small footer note */}
      <div className="px-4 py-1.5 text-xs text-gray-400 border-t border-gray-800 bg-[#0a0e13]">
        Volume SMA 9 ≈ 0.031  |  Use chart toolbar to change timeframe / add indicators
      </div>
    </div>
  );
};

export default TradingChart;