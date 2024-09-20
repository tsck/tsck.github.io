"use client";

import React, { useEffect, useState } from "react";
import VisxLineChart from "./charts/VisxLineChart";
import EchartsLineChart from "./charts/EChartsLineChart";
import ChartJSLineChart from "./charts/ChartJSLineChart";

const generateData = ({ numOfDataSets, numOfDaysPerSet }) => {
  const datasets = [];
  const startDate = new Date(2023, 0, 1);
  for (let j = 0; j < numOfDataSets; j++) {
    const data = [];
    for (let i = 0; i < numOfDaysPerSet; i++) {
      data.push({
        x: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000), // Add i days
        y: Math.floor(Math.random() * 100), // Random y value between 0 and 100
      });
    }
    datasets.push({ key: `Line ${j + 1}`, data });
  }
  return datasets;
};

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const App = () => {
  const [numOfCharts, setNumOfCharts] = useState(100);
  const [numOfDataSets, setNumOfDataSets] = useState(10);
  const [numOfDaysPerSet, setNumOfDaysPerSet] = useState(90);
  const [datasets, setDatasets] = useState(
    generateData({ numOfDataSets, numOfDaysPerSet })
  );
  const [lib, setLib] = useState("visx");

  useEffect(() => {
    setDatasets(generateData({ numOfDataSets, numOfDaysPerSet }));
  }, [numOfCharts, numOfDataSets, numOfDaysPerSet]);

  const handleConfigChange = debounce((value, setter) => {
    setter(Number(value));
  }, 500); // 500ms delay

  const charts = [];

  for (let i = 0; i < numOfCharts; i++) {
    if (lib === "echarts") {
      charts.push(<EchartsLineChart key={i} datasets={datasets} />);
    } else if (lib === "chartjs") {
      charts.push(<ChartJSLineChart key={i} datasets={datasets} />);
    } else {
      charts.push(<VisxLineChart key={i} datasets={datasets} />);
    }
  }

  return (
    <div>
      <h1 style={{ padding: "0 20px" }}>Chart Performance Comparison</h1>
      <form style={{ padding: "0 20px" }} onSubmit={(e) => e.preventDefault()}>
        <div>
          <fieldset style={{ margin: "20px 0", border: 0, padding: "10px 0" }}>
            <legend>Chart Library:</legend>
            <div style={{ marginBottom: "5px" }}>
              <input
                type="radio"
                id="visx"
                name="drone"
                value="visx"
                checked={lib === "visx"}
                onChange={() => setLib("visx")}
                style={{ marginRight: "5px" }}
              />
              <label for="visx">Visx (SVG)</label>
            </div>
            <div style={{ marginBottom: "5px" }}>
              <input
                type="radio"
                id="chartjs"
                name="drone"
                value="chartjs"
                checked={lib === "chartjs"}
                onChange={() => setLib("chartjs")}
                style={{ marginRight: "5px" }}
              />
              <label for="chartjs">Chart.js (canvas)</label>
            </div>
            <div style={{ marginBottom: "5px" }}>
              <input
                type="radio"
                id="echarts"
                name="drone"
                value="echarts"
                checked={lib === "echarts"}
                onChange={() => setLib("echarts")}
                style={{ marginRight: "5px" }}
              />
              <label for="echarts">ECharts (canvas)</label>
            </div>
          </fieldset>
        </div>
        <div>
          <label>
            Number of charts:
            <input
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              value={numOfCharts}
              onChange={(e) =>
                handleConfigChange(e.currentTarget.value, setNumOfCharts)
              }
              style={{ margin: "0 30px 0 10px" }}
            />
          </label>
          <label>
            Number of datasets:
            <input
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              value={numOfDataSets}
              onChange={(e) =>
                handleConfigChange(e.currentTarget.value, setNumOfDataSets)
              }
              style={{ margin: "0 30px 0 10px" }}
            />
          </label>
          <label>
            Number of days per dataset:
            <input
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              value={numOfDaysPerSet}
              onChange={(e) =>
                handleConfigChange(e.currentTarget.value, setNumOfDaysPerSet)
              }
              style={{ margin: "0 30px 0 10px" }}
            />
          </label>
        </div>
      </form>
      {charts}
    </div>
  );
};

export default App;
