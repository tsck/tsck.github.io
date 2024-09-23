export const generateDataset = (
  baseValue,
  range,
  granularityInMinutes,
  startDate,
  endDate
) => {
  const dataset = {
    key: `Dataset`,
    data: [],
    baseValue: baseValue,
    range: range,
  };

  for (
    let time = new Date(startDate);
    time <= new Date(endDate);
    time.setMinutes(time.getMinutes() + granularityInMinutes)
  ) {
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
  }

  return dataset;
};

export const generateDatasets = (
  count,
  granularityInMinutes,
  startDate,
  endDate
) => {
  const baseValues = Array.from({ length: count }, (_, i) => 50 * (i + 1));
  const ranges = Array.from({ length: count }, (_, i) => 5 * (i + 1));

  const datasets = Array.from({ length: count }, (_, i) =>
    generateDataset(
      baseValues[i],
      ranges[i],
      granularityInMinutes,
      startDate,
      endDate
    )
  );

  // Assign unique keys to each dataset
  datasets.forEach((dataset, index) => {
    dataset.key = `Dataset ${index + 1}`;
  });

  return datasets;
};
