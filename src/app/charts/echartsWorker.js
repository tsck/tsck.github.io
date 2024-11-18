import * as echarts from "echarts";

let chart;

self.onmessage = function (e) {
  console.log("Worker received message:", e.data); // Log received messages

  const { canvas, width, height, option, type } = e.data;

  if (type === "resize") {
    if (chart) {
      console.log("Resizing chart to:", width, height); // Log resize dimensions
      chart.resize({ width, height });
    }
    return;
  }

  if (!chart) {
    console.log("Initializing chart with dimensions:", width, height); // Log initialization
    chart = echarts.init(canvas, null, {
      renderer: "canvas",
      width,
      height,
    });
  }

  console.log("Setting chart option:", option); // Log chart options
  chart.setOption(option);
};
