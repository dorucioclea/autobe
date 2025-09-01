import { COLORS } from "../constant/color";

/** Props interface for ReceiptIcon component */
interface IReceiptIconProps {
  /** Width of the icon */
  width?: number;
  /** Height of the icon */
  height?: number;
  /** Color of the icon */
  color?: string;
}

/** Receipt SVG icon component */
export const ReceiptIcon = ({
  width = 24,
  height = 30,
  color = COLORS.GRAY_TEXT_DARK,
}: IReceiptIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Receipt Body */}
    <path
      d="M2 2H22V24L20 22L18 24L16 22L14 24L12 22L10 24L8 22L6 24L4 22L2 24V2Z"
      fill={color}
      fillOpacity="0.1"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Receipt Lines */}
    <line
      x1="6"
      y1="7"
      x2="18"
      y2="7"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    />
    <line
      x1="6"
      y1="11"
      x2="18"
      y2="11"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    />
    <line
      x1="6"
      y1="15"
      x2="14"
      y2="15"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    />
    <line
      x1="6"
      y1="19"
      x2="16"
      y2="19"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);
