import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TablePagination from "./TablePagination";
import getPagination from '@/utils/getPagination';
import { TableMobileSkeleton } from "../ui/loading";


function DataTable({ columns, data, page, setPage, pageSize, total, setPageSize, selectedRows, renderMobileCard, loading, mobileLoadingType, clearFilters }) {

  const totalPages = Math.ceil(total / pageSize);

  // const startIndex = (page - 1) * pageSize;
  // const endIndex = startIndex + pageSize;

  // const paginatedData = data.slice(startIndex, endIndex);
  const paginatedData = data;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = getPagination(page, totalPages);

  const safeData = Array.isArray(data) ? data : [];
  const emptyRows = Math.max(0, pageSize - safeData.length);

  return (
    <div className="h-full md:h-auto w-full md:border-2 border-default flex flex-col overflow-hidden">

      {/* Desktop header */}
      <div className="hidden md:block flex-shrink-0">
        <table className="w-full table-fixed border-b border-default">
          <TableHeader columns={columns} />
        </table>
      </div>

      {/* Desktop body — NO flex-1, grows naturally */}
      <div className="hidden md:block">
        <table className="w-full table-fixed">
          <TableBody
            loading={loading}
            selectedRows={selectedRows}
            columns={columns}
            data={paginatedData}
            emptyRows={emptyRows}
            pageSize={pageSize}
            clearFilters={clearFilters}
          />
        </table>
      </div>

      {/* Mobile body — flex-1 + overflow scroll */}
      <div className="block md:hidden flex-1 overflow-y-auto scrollbar-hide space-y-2 p-2">
        {typeof renderMobileCard === 'function' ? (
          safeData?.length > 0 ? (
            safeData.map((row, index) => {
              if (!row) return null;
              return (
                <div key={row.id || index} className="w-full">
                  {renderMobileCard(row)}
                </div>
              );
            })
          ) : loading ? (
            <TableMobileSkeleton type={mobileLoadingType} />
          ) : (
            <div className="text-center p-10 text-muted">No data found</div>
          )
        ) : (
          <div className="p-4 text-center text-muted italic text-sm">
            Mobile view not implemented for this table.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="shrink-0 sticky bottom-0 border-t border-default bg-background z-20">
        <TablePagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          total={total}
          setPageSize={setPageSize}
          start={start}
          end={end}
          totalPages={totalPages}
          pages={pages}
        />
      </div>

    </div>
  );
}
export default DataTable;