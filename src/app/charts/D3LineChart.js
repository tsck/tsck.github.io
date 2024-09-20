import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const D3LineChart = ({ datasets }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const devicePixelRatio = window.devicePixelRatio || 1;

    const drawChart = () => {
      const width =
        canvas.parentElement.clientWidth - margin.left - margin.right;
      const height = 240 - margin.top - margin.bottom;

      canvas.width = (width + margin.left + margin.right) * devicePixelRatio;
      canvas.height = (height + margin.top + margin.bottom) * devicePixelRatio;

      canvas.style.width = `${width + margin.left + margin.right}px`;
      canvas.style.height = `${height + margin.top + margin.bottom}px`;

      context.scale(devicePixelRatio, devicePixelRatio);

      const x = d3
        .scaleTime()
        .domain(d3.extent(datasets[0].data, (d) => d.x))
        .range([0, width]);

      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(
            datasets.flatMap((dataset) => dataset.data),
            (d) => d.y
          ),
        ])
        .nice()
        .range([height, 0]);

      const line = d3
        .line()
        .x((d) => x(d.x))
        .y((d) => y(d.y))
        .context(context);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.save();
      context.translate(margin.left, margin.top);

      // Draw x-axis
      context.beginPath();
      x.ticks(width / 80).forEach((tick) => {
        context.moveTo(x(tick), height);
        context.lineTo(x(tick), height + 6);
      });
      context.strokeStyle = "black";
      context.stroke();

      context.textAlign = "center";
      context.textBaseline = "top";
      x.ticks(width / 80).forEach((tick) => {
        context.fillText(d3.timeFormat("%b %d")(tick), x(tick), height + 6);
      });

      // Draw y-axis
      context.beginPath();
      y.ticks(height / 40).forEach((tick) => {
        context.moveTo(0, y(tick));
        context.lineTo(-6, y(tick));
      });
      context.strokeStyle = "black";
      context.stroke();

      context.textAlign = "right";
      context.textBaseline = "middle";
      y.ticks(height / 40).forEach((tick) => {
        context.fillText(tick, -9, y(tick));
      });

      // Draw horizontal grid lines
      context.beginPath();
      y.ticks(height / 40).forEach((tick) => {
        context.moveTo(0, y(tick));
        context.lineTo(width, y(tick));
      });
      context.strokeStyle = "#e0e0e0"; // Light gray color for grid lines
      context.stroke();

      // Draw lines
      datasets.forEach((dataset, index) => {
        context.beginPath();
        line(dataset.data);
        context.lineWidth = 2;
        context.strokeStyle = color(index);
        context.stroke();
      });

      context.restore();

      // Tooltip
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("border-radius", "4px");

      canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left - margin.left;
        const x0 = x.invert(mouseX);

        const values = datasets.map((dataset) => {
          const closestData = dataset.data.reduce((a, b) =>
            Math.abs(b.x - x0) < Math.abs(a.x - x0) ? b : a
          );
          return `<strong>${dataset.key}:</strong> ${closestData.y}`;
        });

        tooltip
          .style("visibility", "visible")
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`)
          .html(
            `<strong>Date:</strong> ${x0.toDateString()}<br/>${values.join(
              "<br/>"
            )}`
          );
      });

      canvas.addEventListener("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

      return () => {
        tooltip.remove();
      };
    };

    drawChart();
    window.addEventListener("resize", drawChart);

    return () => {
      window.removeEventListener("resize", drawChart);
    };
  }, [datasets]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "260px", marginTop: "40px" }}
    ></canvas>
  );
};

export default D3LineChart;
