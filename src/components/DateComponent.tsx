import React, { useState, useRef } from "react";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
// import "antd/dist/reset.css";

const { RangePicker } = DatePicker;

type DateRange = [Dayjs | null, Dayjs | null] | null;
const CustomDateRange: React.FC = () => {
  const [dates, setDates] = useState<DateRange>(null);
 const pickerRef = useRef<React.ElementRef<typeof RangePicker>>(null);


  const handleChange = (values: DateRange) => {
    setDates(values);
  };

  return (
    <div className="relative w-80">
      {/* Display Box */}
      <div
        onClick={() => pickerRef.current?.focus()}
        className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:shadow-md"
      >
        <span className="text-gray-600 text-md">
          {dates && dates[0] && dates[1]
            ? `${dates[0].format("DD-MM-YYYY")} - ${dates[1].format(
                "DD-MM-YYYY"
              )}`
            : "30-05-2024 - 05-06-2024"}
        </span>

        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Hidden RangePicker */}
      <RangePicker
        ref={pickerRef}
        value={dates}
        onChange={handleChange}
        format="DD-MM-YYYY"
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
      />
    </div>
  );
};

export default CustomDateRange;
