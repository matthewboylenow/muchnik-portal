export const chartTheme = {
  cartesianGrid: {
    strokeDasharray: "3 3",
    stroke: "rgba(255, 255, 255, 0.04)",
    vertical: false,
  },
  xAxis: {
    stroke: "rgba(255, 255, 255, 0.06)",
    tick: {
      fill: "#71717A",
      fontSize: 12,
      fontFamily: "Instrument Sans",
    },
    axisLine: false,
    tickLine: false,
  },
  yAxis: {
    stroke: "rgba(255, 255, 255, 0.06)",
    tick: {
      fill: "#71717A",
      fontSize: 12,
      fontFamily: "JetBrains Mono",
    },
    axisLine: false,
    tickLine: false,
    width: 40,
  },
  tooltip: {
    contentStyle: {
      background: "rgba(24, 24, 27, 0.9)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      padding: "12px 16px",
      fontFamily: "Instrument Sans",
      fontSize: "13px",
      color: "#FAFAFA",
    },
    cursor: { stroke: "rgba(255, 255, 255, 0.1)" },
  },
  colors: {
    manhattan: "#818CF8",
    statenIsland: "#22D3EE",
    morrisCounty: "#34D399",
    primary: "#818CF8",
    positive: "#4ADE80",
    negative: "#F87171",
    warning: "#FBBF24",
    info: "#60A5FA",
  },
  areaGradients: {
    manhattan: {
      start: "rgba(129, 140, 248, 0.3)",
      end: "rgba(129, 140, 248, 0)",
    },
    statenIsland: {
      start: "rgba(34, 211, 238, 0.3)",
      end: "rgba(34, 211, 238, 0)",
    },
    morrisCounty: {
      start: "rgba(52, 211, 153, 0.3)",
      end: "rgba(52, 211, 153, 0)",
    },
  },
};
