import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const EchartsLineChart = ({ datasets, group }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const series = datasets.map((dataset) => ({
      name: dataset.key,
      type: "line",
      data: dataset.data.map((d) => [d.x, d.y]),
      symbol: "none", // Remove circles for each point
      animation: false,
      triggerLineEvernt: false,
      emphasis: {
        disabled: true,
      },
    }));

    const option = {
      // toolbox: {
      //   feature: {
      //     dataZoom: {},
      //     restore: {},
      //   },
      //   right: "20px",
      // },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgb(50, 50, 50)", // Set solid background color
        transitionDuration: 0, // Prevent transparency when moving
        textStyle: {
          color: "#fff", // Ensure text is visible on dark background
        },
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
        top: "50px",
        bottom: "20px",
        containLabel: true,
        show: true,
      },
      series,
    };

    chartInstance.setOption(option);

    // if (group) {
    //   chartInstance.group = group;
    //   echarts.connect(group);
    // }

    // chartInstance.on("dataZoom", (params) => {
    //   const { startValue: xStart, endValue: xEnd } = params.batch[0];
    //   const { startValue: yStart, endValue: yEnd } = params.batch[1];
    //   // Handle updated zoom values
    // });

    return () => {
      chartInstance.dispose();
    };
  }, [datasets, group]);

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
