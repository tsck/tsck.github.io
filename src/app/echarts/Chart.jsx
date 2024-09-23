import React, { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";

import * as echarts from "echarts";
import { palette } from "@leafygreen-ui/palette";
import { borderRadius } from "@leafygreen-ui/tokens";
import ToolTip from "./Tooltip";
import { useSearchParams } from "next/navigation";

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

const Chart = ({ data, group, label }) => {
  const searchParams = useSearchParams();
  const chartRef = useRef(null);
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate"))
      : undefined
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endDate")
      ? new Date(searchParams.get("endDate"))
      : undefined
  );

  useEffect(() => {
    setStartDate(new Date(searchParams.get("startDate")));
    setEndDate(new Date(searchParams.get("endDate")));
  }, [searchParams]);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const series = data.map((dataset, index) => ({
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
      title: {
        show: true,
        text: label,
        padding: 20,
        textStyle: {
          color: palette.black,
          fontFamily: "Euclid Circular A Light, sans-serif",
        },
      },
      color: colors,
      toolbox: {
        feature: {
          dataZoom: {
            show: false,
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
        min: startDate, // Specify the start value for the x-axis
        max: endDate, // Specify the end value for the x-axis
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
        top: "64px",
        bottom: "20px",
        containLabel: true,
        show: true,
      },
      series,
    };

    chartInstance.setOption(option);

    chartInstance.on("dataZoom", (params) => {
      // const { startValue: xStart, endValue: xEnd } = params.batch[0];
      // const { startValue: yStart, endValue: yEnd } = params.batch[1];
      // Handle updated zoom values
    });

    return () => {
      chartInstance.dispose();
    };
  }, [data, group, startDate, endDate]);

  return (
    <div
      ref={chartRef}
      className="echart"
      style={{
        height: "316px",
        border: "1px solid #e0e0e0",
        margin: "20px",
        borderRadius: borderRadius[200],
      }}
    />
  );
};

export default Chart;
