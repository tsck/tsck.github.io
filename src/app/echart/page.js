"use client";

import React from "react";

import Chart from "./Chart";
import ConfigForm from "./ConfigForm";
import { H1 } from "@leafygreen-ui/typography";
import { ChartSyncProvider } from "./ChartSyncProvider";

function Ideal() {
  const series1 = [
    {
      name: "Dataset 1",
      data: [
        [new Date("2021-01-01T00:00:00"), 50],
        [new Date("2021-01-01T01:00:00"), 60],
        [new Date("2021-01-01T02:00:00"), 70],
        [new Date("2021-01-01T03:00:00"), 80],
        [new Date("2021-01-01T04:00:00"), 90],
        [new Date("2021-01-01T05:00:00"), 100],
      ],
    },
    {
      name: "Dataset 2",
      data: [
        [new Date("2021-01-01T00:00:00"), 100],
        [new Date("2021-01-01T01:00:00"), 40],
        [new Date("2021-01-01T02:00:00"), 80],
        [new Date("2021-01-01T03:00:00"), 90],
        [new Date("2021-01-01T04:00:00"), 130],
        [new Date("2021-01-01T05:00:00"), 100],
      ],
    },
  ];

  const series2 = [
    {
      name: "Dataset 1",
      data: [
        [new Date("2021-01-01T00:00:00"), 250],
        [new Date("2021-01-01T01:00:00"), 260],
        [new Date("2021-01-01T02:00:00"), 270],
        [new Date("2021-01-01T03:00:00"), 280],
        [new Date("2021-01-01T04:00:00"), 290],
        [new Date("2021-01-01T05:00:00"), 100],
        [new Date("2021-01-01T06:00:00"), 180],
        [new Date("2021-01-01T07:00:00"), 80],
        [new Date("2021-01-01T08:00:00"), 400],
        [new Date("2021-01-01T09:00:00"), 200],
        [new Date("2021-01-01T10:00:00"), 100],
      ],
    },
    {
      name: "Dataset 2",
      data: [
        [new Date("2021-01-01T00:00:00"), 100],
        [new Date("2021-01-01T01:00:00"), 40],
        [new Date("2021-01-01T02:00:00"), 80],
        [new Date("2021-01-01T03:00:00"), 90],
        [new Date("2021-01-01T04:00:00"), 130],
        [new Date("2021-01-01T05:00:00"), 100],
      ],
    },
  ];

  // const series1 = [
  //   {
  //     name: "Dataset 1",
  //     data: [
  //       [new Date("2021-01-01T00:00:00"), 50],
  //       [new Date("2021-01-02T00:00:00"), 60],
  //       [new Date("2021-01-03T00:00:00"), 70],
  //       [new Date("2021-01-04T00:00:00"), 80],
  //       [new Date("2021-01-05T00:00:00"), 90],
  //       [new Date("2021-01-06T00:00:00"), 100],
  //     ],
  //   },
  //   {
  //     name: "Dataset 2",
  //     data: [
  //       [new Date("2021-01-01T00:00:00"), 100],
  //       [new Date("2021-01-02T00:00:00"), 40],
  //       [new Date("2021-01-03T00:00:00"), 80],
  //       [new Date("2021-01-04T00:00:00"), 90],
  //       [new Date("2021-01-05T00:00:00"), 130],
  //       [new Date("2021-01-06T00:00:00"), 100],
  //     ],
  //   },
  // ];

  // const series2 = [
  //   {
  //     name: "Dataset 1",
  //     data: [
  //       [new Date("2021-01-01T00:00:00"), 250],
  //       [new Date("2021-01-02T00:00:00"), 260],
  //       [new Date("2021-01-03T00:00:00"), 270],
  //       [new Date("2021-01-04T00:00:00"), 280],
  //       [new Date("2021-01-05T00:00:00"), 290],
  //       [new Date("2021-01-06T00:00:00"), 100],
  //       [new Date("2021-01-07T00:00:00"), 180],
  //       [new Date("2021-01-08T00:00:00"), 80],
  //       [new Date("2021-01-09T00:00:00"), 400],
  //       [new Date("2021-01-10T00:00:00"), 200],
  //       [new Date("2021-01-11T00:00:00"), 100],
  //     ],
  //   },
  //   {
  //     name: "Dataset 2",
  //     data: [
  //       [new Date("2021-01-01T00:00:00"), 100],
  //       [new Date("2021-01-02T00:00:00"), 40],
  //       [new Date("2021-01-03T00:00:00"), 80],
  //       [new Date("2021-01-04T00:00:00"), 90],
  //       [new Date("2021-01-05T00:00:00"), 130],
  //       [new Date("2021-01-06T00:00:00"), 100],
  //     ],
  //   },
  // ];

  return (
    <>
      <H1 style={{ padding: "40px" }}>ECharts Demo</H1>
      <ChartSyncProvider
        xAxis={{
          type: "time",
          min: new Date("2021-01-01T00:00:00"),
          max: new Date("2021-01-01T05:00:00"),
        }}
        yAxis={{
          type: "value",
        }}
        sync
      >
        <ConfigForm />
        <Chart series={series1} label="Chart 1" />
        <Chart series={series2} label="Chart 2" />
      </ChartSyncProvider>
    </>
  );
}

export default Ideal;
