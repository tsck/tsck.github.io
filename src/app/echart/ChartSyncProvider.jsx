import * as echarts from "echarts";
import React, { createContext, useContext, useEffect, useState } from "react";

const ChartSyncContext = createContext();

export const useChartSyncContext = () => useContext(ChartSyncContext);

const generateRandomGroup = () => {
  return "group-" + Math.random().toString(36).substr(2, 9);
};

export const ChartSyncProvider = ({ xAxis, yAxis, label, children, sync }) => {
  const [config, setConfig] = useState({ xAxis, yAxis, label });
  const group = sync ? generateRandomGroup() : null;

  function updateConfig(newConfig) {
    setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  }

  useEffect(() => {
    if (sync) {
      echarts.connect(group);
    }
  }, [sync]);

  return (
    <ChartSyncContext.Provider value={{ ...config, group, updateConfig }}>
      {children}
    </ChartSyncContext.Provider>
  );
};
