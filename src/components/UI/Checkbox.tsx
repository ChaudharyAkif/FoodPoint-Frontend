import { useState } from "react";

type ColorCheckboxProps = {
  color?: "blue" | "orange" | "olive";
  label: string;
};

const ColorCheckbox = ({
  color = "blue",
  label,
}: ColorCheckboxProps) => {
  const [checked, setChecked] = useState(false);

  const boxColor =
    color === "blue"
      ? "bg-blue-500 border-blue-500"
      : color === "orange"
      ? "bg-orange-500 border-orange-500"
      : "bg-green-700 border-green-700"; // olive color

  return (
    <div
      onClick={() => setChecked(!checked)}
      className="flex items-center gap-2  cursor-pointer select-none"
    >
      <div
        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${boxColor}`}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {/* Text from props */}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default ColorCheckbox;
