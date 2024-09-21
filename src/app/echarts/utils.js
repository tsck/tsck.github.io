export const generateDatasets = (
  count,
  baseValues,
  ranges,
  granularity,
  hours
) => {
  const now = new Date();
  const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);
  const datasets = Array.from({ length: count }, (_, i) => ({
    key: `Dataset ${i + 1}`,
    data: [],
    baseValue: baseValues[i],
    range: ranges[i],
  }));

  for (
    let time = startTime;
    time <= now;
    time.setMinutes(time.getMinutes() + granularity)
  ) {
    datasets.forEach((dataset) => {
      // Small random change
      dataset.baseValue += (Math.random() - 0.5) * dataset.range;

      // Occasional spike or dip
      if (Math.random() < 0.05) {
        dataset.baseValue += (Math.random() - 0.5) * dataset.range * 10;
      }

      // Ensure the value stays within a reasonable range
      dataset.baseValue = Math.max(0, dataset.baseValue);

      dataset.data.push({
        x: new Date(time), // Ensure a new Date object is created
        y: dataset.baseValue,
      });
    });
  }

  return datasets;
};
