"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const queryNumOfCharts = searchParams.get("numOfCharts");
  const queryNumOfDataSets = searchParams.get("numOfDataSets");
  const queryNumOfDaysPerSet = searchParams.get("numOfDaysPerSet");
  const queryLib = searchParams.get("lib");

  const [numOfCharts, setNumOfCharts] = useState(
    queryNumOfCharts ? Number(queryNumOfCharts) : 100
  );
  const [numOfDataSets, setNumOfDataSets] = useState(
    queryNumOfDataSets ? Number(queryNumOfDataSets) : 10
  );
  const [numOfDaysPerSet, setNumOfDaysPerSet] = useState(
    queryNumOfDaysPerSet ? Number(queryNumOfDaysPerSet) : 90
  );
  const [lib, setLib] = useState(queryLib || "visx");
  const [datasets, setDatasets] = useState(
    generateData({ numOfDataSets, numOfDaysPerSet })
  );

  useEffect(() => {
    setDatasets(generateData({ numOfDataSets, numOfDaysPerSet }));
  }, [numOfCharts, numOfDataSets, numOfDaysPerSet]);

  const updateQueryParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleConfigChange = debounce((value, setter, queryParam) => {
    setter(Number(value));
    updateQueryParams(queryParam, value);
  }, 500); // 500ms delay

  const handleLibChange = (value) => {
    setLib(value);
    updateQueryParams("lib", value);
  };

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
      <h1 style={{ padding: "40px" }}>Chart Performance Comparison</h1>
      <form
        style={{ padding: "0 40px 40px", borderBottom: "1px solid white" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <fieldset style={{ border: 0, padding: "10px 0 40px" }}>
            <legend>Chart Library:</legend>
            <div style={{ marginBottom: "5px" }}>
              <input
                type="radio"
                id="visx"
                name="lib"
                value="visx"
                checked={lib === "visx"}
                onChange={(e) => handleLibChange(e.target.value)}
              />
              <label htmlFor="visx">Visx (SVG - via D3)</label>
            </div>
            <div style={{ marginBottom: "5px" }}>
              <input
                type="radio"
                id="echarts"
                name="lib"
                value="echarts"
                checked={lib === "echarts"}
                onChange={(e) => handleLibChange(e.target.value)}
              />
              <label htmlFor="echarts">Echarts (canvas)</label>
            </div>
            <div style={{ marginBottom: "5px" }}>
              <input
                type="radio"
                id="chartjs"
                name="lib"
                value="chartjs"
                checked={lib === "chartjs"}
                onChange={(e) => handleLibChange(e.target.value)}
              />
              <label htmlFor="chartjs">Chart.js (canvas)</label>
            </div>
          </fieldset>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <label
            for="numOfCharts"
            style={{ display: "inline-block", width: "250px" }}
          >
            Number of charts:
          </label>
          <input
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            defaultValue={numOfCharts}
            onChange={(e) =>
              handleConfigChange(
                e.currentTarget.value,
                setNumOfCharts,
                "numOfCharts"
              )
            }
            style={{ width: "50px" }}
            id="numOfCharts"
          />
        </div>
        <div style={{ marginBottom: "5px" }}>
          <label
            for="numOfDataSets"
            style={{ display: "inline-block", width: "250px" }}
          >
            Number of datasets:
          </label>
          <input
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            defaultValue={numOfDataSets}
            onChange={(e) =>
              handleConfigChange(
                e.currentTarget.value,
                setNumOfDataSets,
                "numOfDataSets"
              )
            }
            style={{ width: "50px" }}
            id="numOfDataSets"
          />
        </div>
        <div style={{ marginBottom: "5px" }}>
          <label
            for="numOfDaysPerSet"
            style={{ display: "inline-block", width: "250px" }}
          >
            Number of days per dataset:
          </label>
          <input
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            defaultValue={numOfDaysPerSet}
            onChange={(e) =>
              handleConfigChange(
                e.currentTarget.value,
                setNumOfDaysPerSet,
                "numOfDaysPerSet"
              )
            }
            style={{ width: "50px" }}
            id="numOfDaysPerSet"
          />
        </div>
      </form>
      {charts}
    </div>
  );
};

export default App;
