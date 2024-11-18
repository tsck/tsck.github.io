import React, { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";

import * as echarts from "echarts";
import { palette } from "@leafygreen-ui/palette";
import { borderRadius, spacing } from "@leafygreen-ui/tokens";
import ToolTip from "./Tooltip";
import { useSearchParams } from "next/navigation";
import { useChartSyncContext } from "./ChartSyncProvider";

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

const populateSeries = (seriesConfig) => ({
  type: "line",
  showSymbol: false,
  emphasis: {
    itemStyle: {
      // color: dataset.color,
      // borderWidth: 5,
    },
    symbol: "circle",
    symbolSize: 1,
  },
  clip: false,
  ...seriesConfig,
});

const Chart = (props) => {
  const syncContext = useChartSyncContext();

  const series = props.series || syncContext.series;
  const xAxis = props.xAxis || syncContext.xAxis;
  const yAxis = props.yAxis || syncContext.yAxis;
  const label = props.label || syncContext.label;
  const group = syncContext.group;

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!series) return;

    const chartInstance = echarts.init(chartRef.current);
    chartInstanceRef.current = chartInstance;
    chartInstance.group = group;

    const option = {
      series: series.map(populateSeries),
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
        ...xAxis,
      },
      yAxis: {
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
        ...yAxis,
      },
      grid: {
        left: spacing[1000],
        right: spacing[500],
        top: spacing[1600],
        bottom: spacing[500],
        containLabel: true,
        show: true,
      },
    };

    chartInstance.setOption(option);

    // Set the global cursor to dataZoomSelect to enable zooming
    chartInstance.dispatchAction({
      type: "takeGlobalCursor",
      key: "dataZoomSelect",
      dataZoomSelectActive: true,
    });

    chartInstance.on("dataZoom", (params) => {
      console.log(params);
    });

    const handleResize = () => {
      chartInstance.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.dispose();
    };
  }, [series, group]);

  // useEffect(() => {
  //   if (!isZoomed) {
  //     chartInstanceRef.current.dispatchAction({
  //       type: "dataZoom",
  //       start: 0,
  //       end: 100,
  //     });
  //   }
  // }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* <button
        onClick={() => {
          // setIsZoomed(false);
        }}
      >
        Reset
      </button> */}
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
    </div>
  );
};

export default Chart;
