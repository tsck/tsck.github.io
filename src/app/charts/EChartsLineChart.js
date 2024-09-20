import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const EchartsLineChart = ({ datasets }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const series = datasets.map((dataset) => ({
      name: dataset.key,
      type: "line",
      data: dataset.data.map((d) => [d.x, d.y]),
      symbol: "none", // Remove circles for each point
    }));

    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(50, 50, 50, 0.8)", // Set solid background color
        transitionDuration: 0, // Prevent transparency when moving
        formatter: (params) => {
          const date = new Date(params[0].data[0]).toDateString();
          const values = params
            .map((p) => `${p.seriesName}: ${p.data[1]}`)
            .join("<br/>");
          return `${date}<br/>${values}`;
        },
      },
      xAxis: {
        type: "time",
      },
      yAxis: {
        type: "value",
      },
      grid: {
        left: "20px",
        right: "20px",
        top: "20px",
        bottom: "20px",
        containLabel: true,
      },
      series,
    };

    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, [datasets]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "calc(100% - 20px)",
        height: "260px",
        padding: "40px 10px",
      }}
    />
  );
};

export default EchartsLineChart;
