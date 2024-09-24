import React, { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";

import * as echarts from "echarts";
import { palette } from "@leafygreen-ui/palette";
import { borderRadius, spacing } from "@leafygreen-ui/tokens";
import ToolTip from "./Tooltip";
import { useSearchParams } from "next/navigation";

const getThresholdConfig = (label) => ({
  lineStyle: {
    color: palette.red.base,
    type: "dashed",
    width: 1,
  },
  label: {
    formatter: ``,
    position: "insideEndBottom",
    distance: [-16, 10],
  },
  emphasis: {
    label: {
      formatter: label,
      backgroundColor: "#001E2B",
      borderRadius: borderRadius[150],
      color: "white",
      padding: spacing[400],
    },
    lineStyle: {
      width: 1,
    },
  },
  symbol: "triangle",
  symbolSize: [0, 12],
  symbolRotate: 90,
});

const getEventMarkerConfig = (label) => ({
  lineStyle: {
    color: palette.red.base,
    type: "solid",
    width: 1,
  },
  label: {
    formatter: ``,
    position: "insideEndBottom",
    distance: [-16, 10],
  },
  emphasis: {
    label: {
      formatter: label,
      backgroundColor: "#001E2B",
      borderRadius: borderRadius[150],
      color: "white",
      padding: spacing[400],
    },
    lineStyle: {
      width: 1,
    },
  },
  // symbolSize: [0, 12],
  symbol: "triangle",
  symbolRotate: 90,
});

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

  const defaultStartDate = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate"))
    : undefined;

  const defaultEndDate = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate"))
    : undefined;

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  useEffect(() => {
    setStartDate(new Date(searchParams.get("startDate")));
    setEndDate(new Date(searchParams.get("endDate")));
  }, [searchParams]);

  useEffect(() => {
    if (!data) return;

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
      clip: false,

      // TODO: Figure out - not working right.
      // markLine: {
      //   data: [
      //     {
      //       yAxis: 600,
      //       ...getThresholdConfig("Threshold 1"),
      //     },
      //     {
      //       xAxis: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      //       ...getEventMarkerConfig("Event Marker"),
      //     },
      //   ],
      //   // symbol: ["triangle", "triangle"],
      //   // symbolSize: [12, 12],
      //   // symbolRotate: 180,
      // },
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
        orient: "vertical",
        itemSize: 13,
        top: 15,
        right: -6,
        feature: {
          dataZoom: {
            icon: {
              zoom: "path://", // hack to remove zoom button
              back: "path://", // hack to remove restore button
            },
          },
        },
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
            color: palette.gray.light2,
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
            color: palette.gray.light2,
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
        left: spacing[1000],
        right: spacing[500],
        top: spacing[1600],
        bottom: spacing[500],
        containLabel: true,
        show: true,
      },
      series,
    };

    chartInstance.setOption(option);

    // Set the global cursor to dataZoomSelect to enable zooming
    chartInstance.dispatchAction({
      type: "takeGlobalCursor",
      key: "dataZoomSelect",
      dataZoomSelectActive: true,
    });

    // Set the initial zoom range
    chartInstance.dispatchAction({
      type: "dataZoom",
      startValue: startDate,
      endValue: endDate,
    });

    chartInstance.on("dataZoom", (params) => {
      const { startValue: xStart, endValue: xEnd } = params.batch[0];
      const { startValue: yStart, endValue: yEnd } = params.batch[1];

      console.log(params.batch[0]);
      console.log("Start:", new Date(Math.round(xStart)));
      console.log("End:", new Date(Math.round(xEnd)));
      // Handle updated zoom values
    });

    return () => {
      chartInstance.dispose();
    };
  }, [data, group, startDate, endDate]);

  return (
    <>
      <button
        onClick={() => {
          setStartDate(defaultStartDate);
          setEndDate(defaultEndDate);
        }}
      >
        Reset
      </button>
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
    </>
  );
};

export default Chart;
