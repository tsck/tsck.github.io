"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Chart from "./Chart";
import ConfigForm from "./ConfigForm";
import { H1 } from "@leafygreen-ui/typography";

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

const App = () => {
  const searchParams = useSearchParams();
  const [numOfCharts, setNumOfCharts] = useState();
  const [numOfDataSets, setNumOfDataSets] = useState();
  const [numOfDaysPerSet, setNumOfDaysPerSet] = useState();
  const [datasets, setDatasets] = useState(
    generateData({ numOfDataSets, numOfDaysPerSet })
  );

  useEffect(() => {
    setDatasets(generateData({ numOfDataSets, numOfDaysPerSet }));
  }, [numOfCharts, numOfDataSets, numOfDaysPerSet]);

  useEffect(() => {
    setNumOfCharts(Number(searchParams.get("numOfCharts")));
    setNumOfDataSets(Number(searchParams.get("numOfDataSets")));
    setNumOfDaysPerSet(Number(searchParams.get("numOfDaysPerSet")));
  }, [searchParams]);

  return (
    <div>
      <H1 style={{ padding: "40px" }}>LeafyGreen Charts Demo</H1>
      <ConfigForm />
      {Array.from({ length: numOfCharts }, (_, i) => (
        <Chart datasets={datasets} key={i} group="chartGroup" />
      ))}
    </div>
  );
};

export default App;
