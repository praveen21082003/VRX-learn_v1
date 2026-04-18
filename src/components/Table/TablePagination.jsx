import React from 'react'
import { Button } from '@/components/ui'


function TablePagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  total,
  totalPages,
  start,
  end,
  pages
}) {

  console.log("page", page);
  console.log("total items", total);
  console.log("total pages", totalPages);
  console.log("pageSize", pageSize);



  return (
    <div className="flex items-center justify-between px-3 text-small h-10 border-t border-default">
      <div className='hidden md:flex items-center gap-3'>
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="border-2 bg-background border-default rounded-sm px-3 py-0.5"
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
        </select>
      </div>
      <div className="hidden md:block">
        {start}-{end} of {total} entries
      </div>

      <div className="flex items-center gap-1 w-full md:w-auto justify-center md:justify-end">
        <Button
          buttonName="Previous"
          disabled={page === 1}
          bgClass="bg-pagenation-bg dark:bg-transparent"
          textClass="text-black  dark:text-white"
          fontClass="text-small"
          className="px-2 py-1 text-body rounded-sm border border-default"
          onClick={() => setPage(page - 1)}
        />
        <div className="flex items-center gap-1">

          {pages.map((p, index) => {

            if (p === "...") {
              return <span key={index} className='text-xl'>....</span>;
            }

            return (
              <Button
                buttonName={p}
                key={`${p}-${index}`}
                onClick={() => setPage(p)}
                bgClass={`${page === p ? "bg-primary" : "bg-pagenation-bg dark:bg-transparent"}`}
                textClass={`${page === p ? "text-white" : "text-black dark:text-white"}`}
                fontClass="text-small"
                className="px-2 py-1 text-body  rounded-sm border border-default"
              />
            );
          })}
        </div>
        <Button
          buttonName="Next"
          disabled={page === totalPages || totalPages === 0}
          bgClass="bg-pagenation-bg dark:bg-transparent"
          textClass="text-black dark:text-white"
          fontClass="text-small"
          className="px-2 py-1 text-body rounded-sm border border-default"
          onClick={() => setPage(page + 1)}
        />
      </div>

    </div>
  )
}

export default TablePagination
