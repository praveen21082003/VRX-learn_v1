function TableSkeleton({ rowCount = 5, columns = [] }) {
  return (
    <tbody>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <tr
          key={`skeleton-row-${rowIndex}`}
          className="border-b h-12 border-default animate-pulse"
        >
          {columns.map((col, colIndex) => (
            <td
              key={`skeleton-col-${colIndex}`}
              className="p-2"
              style={{ width: col.width }} // ✅ FIXED
            >
              <div
                className={`h-4 bg-gray-200 dark:bg-gray-700 rounded-md ${col.align === "center"
                    ? "mx-auto w-1/2"
                    : col.align === "right"
                      ? "ml-auto w-1/2"
                      : "w-full"
                  }`}
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default TableSkeleton;