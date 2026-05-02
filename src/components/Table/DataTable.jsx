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
    <div className="md:h-auto w-full md:border-2 border-default flex flex-col">

      {/* Desktop header */}
      <div className="hidden md:block shrink-0">
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

      {/* ----------- Mobile Screen -------------*/}
      <div className="block md:hidden space-y-2 pb-16">
        {typeof renderMobileCard === 'function' ? (
          loading ? (
            <TableMobileSkeleton type={mobileLoadingType} />
          ) : safeData?.length > 0 ? (
            safeData.map((row, index) => (
              <div key={row.id || index} className="w-full">
                {renderMobileCard(row)}
              </div>
            ))
          ) : (
            <div className="text-center p-10 text-muted">No data found</div>
          )
        ) : (
          <div className="p-4 text-center text-muted italic text-sm">
            Mobile view not implemented.
          </div>
        )}
      </div>

      {/* Pagination — fixed bottom on mobile, static on desktop */}
      <div className="md:static md:border-t md:border-default fixed bottom-0 left-0 right-0 border-t border-default bg-background z-20">
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