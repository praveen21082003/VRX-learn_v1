import React from "react";

function ProgressBar({ 
  percent = 0,
  bgClass = "bg-[#FAFAF8]",
  roundedClass="rounded",
  hClass="h-2"
}) {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`w-full ${hClass} ${roundedClass} bg-[#949493] overflow-hidden`}>
        <div
          className={`h-full ${bgClass} transition-all duration-300`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
      <span>
        {safePercent}%
      </span>
    </div>
  );
}

export default ProgressBar;

