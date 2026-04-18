function TableHeader({ columns }) {
  return (
    <thead className="hidden md:table-header-group bg-table-Header-bg h-14 border-b-2 border-default">
      <tr>
        {columns.map((col,index) => (
          <th
            key={col.key || index}
            style={{ width: col.width }}
            className={`p-2 text-h5 ${col.align === "left" ? "text-left" : "text-center"
              } ${col.className || ""}`}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;