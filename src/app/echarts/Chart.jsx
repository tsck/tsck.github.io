import React, { useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";

import * as echarts from "echarts";
import { palette } from "@leafygreen-ui/palette";
import { borderRadius } from "@leafygreen-ui/tokens";
import ToolTip from "./Tooltip";
import { generateDatasets } from "./utils";

const Chart = ({ group }) => {
  const chartRef = useRef(null);

  const datasetCount = 4;
  const granularity = 1; // in minutes
  const hours = 8;

  const baseValues = Array.from(
    { length: datasetCount },
    (_, i) => 50 * (i + 1)
  );
  const ranges = Array.from({ length: datasetCount }, (_, i) => 5 * (i + 1));
  const datasets = generateDatasets(
    datasetCount,
    baseValues,
    ranges,
    granularity,
    hours
  );

  const colors = [
    "#016BF8",
    "#00A35C",
    "#FFC010",
    "#DB3030",
    "#5E0C9E",
    "#1254B7",
    "#00684A",
    "#944F01",
    "#970606",
    "#2D0B59",
    "#0498EC",
    "#00ED64",
    "#FFEC9E",
    "#FF6960",
    "#B45AF2",
  ];

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const series = datasets.map((dataset, index) => ({
      name: dataset.key,
      type: "line",
      data: dataset.data.map((d) => [d.x, d.y]),
      showSymbol: false,
      emphasis: {
        itemStyle: {
          color: dataset.color,
          borderWidth: 5,
        },
        symbol: "circle",
        symbolSize: 1,
      },
    }));

    const option = {
      color: colors,
      toolbox: {
        feature: {
          dataZoom: {
            show: true,
          },
        },
        right: "20px",
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#001E2B",
        borderRadius: borderRadius[150],
        padding: 0,
        formatter: (params) => renderToString(<ToolTip params={params} />),
      },
      xAxis: {
        type: "time",
        splitLine: { show: true },
        axisLine: {
          lineStyle: {
            color: "#e0e0e0",
          },
        },
        axisLabel: {
          textStyle: {
            color: palette.gray.dark1,
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        splitLine: { show: true },
        axisLine: {
          lineStyle: {
            color: "#e0e0e0",
          },
        },
        axisLabel: {
          textStyle: {
            color: palette.gray.dark1,
          },
        },
        axisTick: {
          show: false,
        },
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

    chartInstance.on("dataZoom", (params) => {
      const { startValue: xStart, endValue: xEnd } = params.batch[0];
      const { startValue: yStart, endValue: yEnd } = params.batch[1];
      // Handle updated zoom values
    });

    return () => {
      chartInstance.dispose();
    };
  }, [datasets, group]);

  return (
    <div
      ref={chartRef}
      className="echart"
      style={{
        width: "calc(100% - 20px)",
        height: "316px",
      }}
    />
  );
};

export default Chart;
