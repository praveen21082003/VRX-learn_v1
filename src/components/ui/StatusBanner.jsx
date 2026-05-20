import React from "react";

export default function StatusBanner({msg, type}) {
    const typeMapping = {
        success : {
            icon : "mdi:checkbox-marked-circle",
            style : "text-[#0F5132] dark:text-green-400"
        } , 
        error : {
            icon : "mdi:cross-circle",
            style : "text-[#E53935] dark:text-red-400"
        }
    }
  return (
    <div className="flex flex-col items-center gap-2 text-center bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4 mt-2">
      <Icon
        name= {typeMapping[type]?.icon || "mdi:information"}
        height="28"
        width="28"
        className={typeMapping[type]?.style }
      />
      <p className="text-xs text-green-700 dark:text-green-400 font-medium leading-5 max-w-xs">
        {msg}
      </p>
    </div>
  );
}
