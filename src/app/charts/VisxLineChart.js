import React from "react";
import { XYChart, Grid, Axis, Tooltip, LineSeries } from "@visx/xychart";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

const VisxLineChart = ({ datasets }) => {
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

export default VisxLineChart;
