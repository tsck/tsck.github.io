"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Chart from "./Chart";
import ConfigForm from "./ConfigForm";
import { H1 } from "@leafygreen-ui/typography";
import { generateDatasets } from "./utils";

async function getDatasets(granularityInMinutes) {
  const datasetCount = 4;
  const now = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(now.getDate() - 3);

  return generateDatasets(
    datasetCount,
    granularityInMinutes,
    threeDaysAgo,
    now
  );
}

const App = () => {
  const searchParams = useSearchParams();

  const [granularity, setGranularity] = useState(
    Number(searchParams.get("granularity")) || 1
  );

  const [datasets, setDatasets] = useState([]);

  const numOfCharts = 10;

  useEffect(() => {
    (async () => {
      const newSets = [];
      for (let i = 0; i < numOfCharts; i++) {
        newSets.push(await getDatasets(granularity));
      }
      setDatasets(newSets);
    })();
  }, [granularity]);

  useEffect(() => {
    setGranularity(Number(searchParams.get("granularity")));
  }, [searchParams]);

  return (
    <div>
      <H1 style={{ padding: "40px" }}>ECharts Demo</H1>
      <ConfigForm />
      {Array.from({ length: numOfCharts }, (_, i) => (
        <Chart
          key={i}
          group="chartGroup"
          data={datasets[i]}
          label={"Chart " + (i + 1)}
        />
      ))}
    </div>
  );
};

export default App;
