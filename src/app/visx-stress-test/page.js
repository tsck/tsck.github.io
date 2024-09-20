"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { XYChart, Grid, Axis, Tooltip, LineSeries } from "@visx/xychart";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

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

const MyChart = ({ datasets }) => {
  return (
    <ParentSize>
      {({ width }) => (
        <XYChart
          height={300}
          width={width}
          xScale={{ type: "time" }}
          yScale={{ type: "linear" }}
        >
          <Grid />
          <Axis orientation="bottom" />
          <Axis orientation="left" />
          {datasets.map((dataset) => (
            <LineSeries
              key={dataset.key}
              dataKey={dataset.key}
              data={dataset.data}
              xAccessor={(d) => d.x}
              yAccessor={(d) => d.y}
            />
          ))}
          <Tooltip
            showVerticalCrosshair
            showSeriesGlyphs
            renderTooltip={({ tooltipData }) => (
              <div>
                <div>
                  <strong>x:</strong>{" "}
                  {tooltipData.nearestDatum.datum.x.toDateString()}
                </div>
                <div>
                  <strong>y:</strong> {tooltipData.nearestDatum.datum.y}
                </div>
              </div>
            )}
          />
        </XYChart>
      )}
    </ParentSize>
  );
};

const App = (props) => {
  const [numOfCharts, setNumOfCharts] = useState(100);
  const [numOfDataSets, setNumOfDataSets] = useState(10);
  const [numOfDaysPerSet, setNumOfDaysPerSet] = useState(90);

  const charts = [];

  for (let i = 0; i < numOfCharts; i++) {
    const datasets = generateData({ numOfDataSets, numOfDaysPerSet });
    charts.push(<MyChart key={i} datasets={datasets} />);
  }

  return (
    <div>
      <form style={{ padding: "40px 20px 0" }}>
        <label>
          Number of charts:
          <input
            type="number"
            value={numOfCharts}
            onChange={(e) => setNumOfCharts(Number(e.currentTarget.value))}
            style={{ margin: "0 30px 0 10px" }}
          />
        </label>
        <label>
          Number of datasets:
          <input
            type="number"
            value={numOfDataSets}
            onChange={(e) => setNumOfDataSets(Number(e.currentTarget.value))}
            style={{ margin: "0 30px 0 10px" }}
          />
        </label>
        <label>
          Number of days per dataset:
          <input
            type="number"
            value={numOfDaysPerSet}
            onChange={(e) => setNumOfDaysPerSet(Number(e.currentTarget.value))}
            style={{ margin: "0 30px 0 10px" }}
          />
        </label>
      </form>
      {charts}
    </div>
  );
};

export default App;
