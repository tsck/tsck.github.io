"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import VisxLineChart from "./charts/VisxLineChart";
import EchartsLineChart from "./charts/EChartsLineChart";
import ChartJSLineChart from "./charts/ChartJSLineChart";
import D3LineChart from "./charts/D3LineChart";

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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    queryNumOfDataSets ? Number(queryNumOfDataSets) : 20
  );
  const [numOfDaysPerSet, setNumOfDaysPerSet] = useState(
    queryNumOfDaysPerSet ? Number(queryNumOfDaysPerSet) : 90
  );
  const [lib, setLib] = useState(queryLib || "visx");

  const [datasets, setDatasets] = useState(
    generateData({ numOfDataSets, numOfDaysPerSet })
  );

  const libOptions = {
    visx: {
      label: "Visx (SVG)",
      render: (props) => <VisxLineChart {...props} />,
    },
    echarts: {
      label: "ECharts (canvas)",
      render: (props) => <EchartsLineChart {...props} />,
    },
    chartjs: {
      label: "Chart.js (canvas) (might crash browser at scale)",
      render: (props) => <ChartJSLineChart {...props} />,
    },
    d3: {
      label: "D3 (canvas) (WIP)",
      render: (props) => <D3LineChart {...props} />,
    },
  };

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
    updateQueryParams(queryParam, value);
    setter(Number(value));
  }, 500); // 500ms delay

  const handleLibChange = (value) => {
    updateQueryParams("lib", value);
    setLib(value);
  };

  return (
    <div>
      <h1 style={{ padding: "40px" }}>Chart Performance Comparison</h1>
      <form
        style={{ padding: "0 40px 40px", borderBottom: "1px solid white" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <fieldset style={{ border: 0, padding: "10px 0 32px" }}>
            <legend>Chart Library (can take time on click, at scale):</legend>
            {Object.entries(libOptions).map(([id, { label }]) => {
              return (
                <div key={id} style={{ marginBottom: "10px" }}>
                  <input
                    type="radio"
                    id={id}
                    name="lib"
                    value={id}
                    checked={lib === id}
                    onChange={(e) => handleLibChange(e.target.value)}
                  />
                  <label htmlFor={id} style={{ marginLeft: "5px" }}>
                    {label}
                  </label>
                </div>
              );
            })}
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
            Number of datasets per chart:
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
        <div style={{ marginTop: "32px" }}>
          <p style={{ marginBottom: "8px" }}>
            <span style={{ display: "inline-block", width: "250px" }}>
              Total Lines:
            </span>
            <span>{numberWithCommas(numOfCharts * numOfDataSets)}</span>
          </p>
          <p style={{ marginBottom: "5px" }}>
            <span style={{ display: "inline-block", width: "250px" }}>
              Total Points:
            </span>
            <span>
              {numberWithCommas(numOfCharts * numOfDataSets * numOfDaysPerSet)}
            </span>
          </p>
        </div>
      </form>

      {Array.from({ length: numOfCharts }, (_, i) =>
        libOptions[lib].render({ datasets, key: i, group: "chartGroup" })
      )}
    </div>
  );
};

export default App;
