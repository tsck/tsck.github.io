"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import DateTimePicker from "./DateTimePicker";
import { Option, Select } from "@leafygreen-ui/select";
import { useChartSyncContext } from "./ChartSyncProvider";
import { DatePicker } from "@leafygreen-ui/date-picker";
import { spacing } from "@leafygreen-ui/tokens";

const inputStyles = css`
  margin-bottom: 16px;
`;

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const ConfigForm = () => {
  const syncContext = useChartSyncContext();
  console.log(syncContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [granularity, setGranularity] = useState(
    Number(searchParams.get("granularity")) || 1
  );

  // Get the current date and time
  const currentDate = new Date();
  // Subtract 8 hours from the current date and time
  const [startDate, setStartDate] = useState(
    new Date(
      searchParams.get("startDate") ||
        currentDate.getTime() - 8 * 60 * 60 * 1000
    )
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endDate")
      ? new Date(searchParams.get("endDate"))
      : currentDate
  );

  const updateQueryParams = (newParams, toReplace) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of newParams) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    if (toReplace) {
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const handleConfigChange = debounce((value, setter, queryParam) => {
    updateQueryParams([[queryParam, value]]);
    setter(Number(value));
  }, 500);

  useEffect(() => {
    updateQueryParams(
      [
        ["granularity", granularity],
        ["startDate", startDate.toISOString()],
        ["endDate", endDate.toISOString()],
      ],
      true
    );
  }, []);

  return (
    <form
      style={{ padding: "0 40px 40px", borderBottom: "1px solid white" }}
      onSubmit={(e) => e.preventDefault()}
    >
      <Select
        label="Granularity"
        name="granularity"
        value={granularity}
        onChange={(value) =>
          handleConfigChange(value, setGranularity, "granularity")
        }
        css={inputStyles}
        dropdownWidthBasis="option"
      >
        <Option value={1}>1 minute</Option>
        <Option value={5}>5 minutes</Option>
        <Option value={60}>1 hour</Option>
        <Option value={60 * 24}>1 day</Option>
      </Select>
      <DateTimePicker
        label="Start"
        value={startDate}
        onChange={(newDate) => {
          updateQueryParams([["startDate", newDate.toISOString()]]);
          setStartDate(newDate);
        }}
      />
      <DateTimePicker
        label="End"
        value={endDate}
        onChange={(newDate) => {
          updateQueryParams([["endDate", newDate.toISOString()]]);
          setEndDate(newDate);
        }}
      />
    </form>
  );
};

function DateRangeSelector() {
  const { xAxis, updateConfig } = useChartSyncContext();

  return (
    <form style={{ margin: "20px", width: "92%" }}>
      <DatePicker
        label="Start"
        value={xAxis.min}
        onDateChange={(newDate) =>
          updateConfig({ xAxis: { ...xAxis, min: newDate } })
        }
        // locale="iso8601"
        // timeZone="utc"
        style={{ marginBottom: "16px" }}
      />
      <DatePicker
        label="End"
        value={xAxis.max}
        onDateChange={(newDate) =>
          updateConfig({ xAxis: { ...xAxis, max: newDate } })
        }
        // locale="iso8601"
        // timeZone="utc"
        // style={{ marginBottom: "16px" }}
      />
    </form>
  );
}

export default DateRangeSelector;
