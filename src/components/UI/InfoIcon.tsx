// src/components/UI/InfoIcon/InfoIcon.tsx
import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
interface InfoIconProps {
  size?: string; // optional prop for custom size
  color?: string; // optional prop for custom color
  onClick?: () => void; // optional click handler
}

const InfoIcon: React.FC<InfoIconProps> = ({
  size = "clamp(20px,5vw,28px)",
  color = "text-orange-600",
  onClick,
}) => {
  return (
    <span
      className={`${color} cursor-pointer font-bold`}
      style={{ fontSize: size ,verticalAlign: "top" }}
      onClick={onClick}
    >
      <InfoCircleOutlined  /> 
     </span>
  );
};

export default InfoIcon;
