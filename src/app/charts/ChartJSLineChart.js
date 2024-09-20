import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const defaultColors = [
  "rgba(75,192,192,1)",
  "rgba(255,99,132,1)",
  "rgba(54,162,235,1)",
  "rgba(255,206,86,1)",
  "rgba(75,192,192,1)",
  "rgba(153,102,255,1)",
  "rgba(255,159,64,1)",
  "rgba(199,199,199,1)",
  "rgba(83,102,255,1)",
  "rgba(255,159,255,1)",
];

const ChartJSLineChart = ({ datasets, colors = defaultColors }) => {
  const chartContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        setContainerWidth(chartContainerRef.current.offsetWidth);
      }
    };

    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const data = {
    datasets: datasets.map((dataset, index) => ({
      label: dataset.key,
      data: dataset.data.map((d) => ({ x: d.x, y: d.y })),
      fill: false,
      borderColor: colors[index % colors.length],
      borderWidth: 2, // Make lines thinner
      pointRadius: 0, // Remove circles for each point
      tension: 0.1,
    })),
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        title: {
          display: false, // Hide x-axis label
        },
      },
      y: {
        title: {
          display: false, // Hide y-axis label
        },
        grid: {
          display: true, // Show horizontal grid lines
          color: "rgba(200, 200, 200, 0.3)", // Customize the color of the grid lines
        },
      },
    },
    plugins: {
      tooltip: {
        mode: "index", // Show tooltip for all datasets at the hovered x-axis value
        intersect: false, // Do not require an exact point match
        callbacks: {
          title: (tooltipItems) => {
            return new Date(tooltipItems[0].parsed.x).toDateString();
          },
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y}`;
          },
        },
      },
      legend: {
        display: false, // Disable the legend
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "calc(100% - 90px)",
        height: "280px",
        padding: "30px",
      }}
    >
      <Line data={data} options={options} width={containerWidth} height={400} />
    </div>
  );
};

export default ChartJSLineChart;
