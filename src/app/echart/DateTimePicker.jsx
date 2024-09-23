"use client";

import React, { useEffect, useState } from "react";
import { DatePicker } from "@leafygreen-ui/date-picker";
import { Option, Select } from "@leafygreen-ui/select";
import { spacing, fontWeights } from "@leafygreen-ui/tokens";
import { palette } from "@leafygreen-ui/palette";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Label } from "@leafygreen-ui/typography";

const dateTimeStyles = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${spacing[400]}px;
  padding-bottom: ${spacing[400]}px;
`;

const inputStyles = css`
  label {
    color: ${palette.gray.dark1};
    font-weight: ${fontWeights.regular};
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 13px;
    line-height: 20px;
  }
`;

const DateTimePicker = ({ label, value, onChange }) => {
  const [day, setDay] = useState(value);
  const [hour, setHour] = useState(value.getHours());
  const [min, setMin] = useState(value.getMinutes());
  const [sec, setSec] = useState(value.getSeconds());

  const getDateTime = () => {
    const dateTime = new Date(day);
    dateTime.setHours(hour);
    dateTime.setMinutes(min);
    dateTime.setSeconds(sec);
    return dateTime;
  };

  useEffect(() => {
    onChange(getDateTime());
  }, [day, hour, min, sec]);

  return (
    <>
      <div>
        <Label>{label}</Label>
        <div css={dateTimeStyles}>
          <div style={{ width: "95%" }}>
            <DatePicker
              label="Day"
              name="day"
              value={value}
              onDateChange={setDay}
              locale="iso8601"
              timeZone="utc"
              css={inputStyles}
            />
          </div>
          <Select
            label="Hour"
            name="start-hour"
            value={hour.toString()}
            dropdownWidthBasis="option"
            onChange={(newHour) => setHour(parseInt(newHour))}
            css={inputStyles}
          >
            {Array.from({ length: 24 }, (_, index) => (
              <Option key={index} value={index.toString()}>
                {index <= 9 && "0"}
                {index}
              </Option>
            ))}
          </Select>
          <Select
            label="Minute"
            name="start-min"
            value={min.toString()}
            dropdownWidthBasis="option"
            onChange={(newMin) => setMin(parseInt(newMin))}
            css={inputStyles}
          >
            {Array.from({ length: 60 }, (_, index) => (
              <Option key={index} value={index.toString()}>
                {index <= 9 && "0"}
                {index}
              </Option>
            ))}
          </Select>
          <Select
            label="Second"
            name="start-sec"
            value={sec.toString()}
            dropdownWidthBasis="option"
            onChange={(newSec) => setSec(parseInt(newSec))}
            css={inputStyles}
          >
            {Array.from({ length: 60 }, (_, index) => (
              <Option key={index} value={index.toString()}>
                {index <= 9 && "0"}
                {index}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default DateTimePicker;
