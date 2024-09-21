"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { NumberInput } from "@leafygreen-ui/number-input";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const ConfigForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [numOfCharts, setNumOfCharts] = useState(
    Number(searchParams.get("numOfCharts")) || 100
  );
  const [numOfDataSets, setNumOfDataSets] = useState(
    Number(searchParams.get("numOfDataSets")) || 20
  );
  const [numOfDaysPerSet, setNumOfDaysPerSet] = useState(
    Number(searchParams.get("numOfDaysPerSet")) || 90
  );

  const updateQueryParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of newParams) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleConfigChange = debounce((value, setter, queryParam) => {
    updateQueryParams([[queryParam, value]]);
    setter(Number(value));
  }, 500);

  useEffect(() => {
    updateQueryParams([
      ["numOfCharts", numOfCharts],
      ["numOfDataSets", numOfDataSets],
      ["numOfDaysPerSet", numOfDaysPerSet],
    ]);
  }, []);

  return (
    <form
      style={{ padding: "0 40px 40px", borderBottom: "1px solid white" }}
      onSubmit={(e) => e.preventDefault()}
    >
      <NumberInput
        label="Number of Charts"
        defaultValue={numOfCharts}
        onChange={(e) =>
          handleConfigChange(
            e.currentTarget.value,
            setNumOfCharts,
            "numOfCharts"
          )
        }
        css={inputStyles}
      />
      <NumberInput
        label="Number of Datasets Per Chart"
        defaultValue={numOfDataSets}
        onChange={(e) =>
          handleConfigChange(
            e.currentTarget.value,
            setNumOfDataSets,
            "numOfDataSets"
          )
        }
        css={inputStyles}
      />
      <NumberInput
        label="Number of Days Per Dataset"
        defaultValue={numOfDaysPerSet}
        onChange={(e) =>
          handleConfigChange(
            e.currentTarget.value,
            setNumOfDaysPerSet,
            "numOfDaysPerSet"
          )
        }
        css={inputStyles}
      />
      {/* <div style={{ marginTop: "32px" }}>
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
      </div> */}
    </form>
  );
};

export default ConfigForm;
