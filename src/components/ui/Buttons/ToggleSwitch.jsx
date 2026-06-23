import React from 'react';
import clsx from 'clsx';

function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={clsx(
        "shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer",
        checked
          ? "bg-primary"
          : "bg-gray-300 dark:bg-gray-600",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={clsx(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200",
          checked ? "translate-x-5.5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default ToggleSwitch;