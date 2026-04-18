import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TablePagination from "./TablePagination";
import getPagination from '@/utils/getPagination';


function DataTable({ columns, data, page, setPage, pageSize, total, setPageSize, selectedRows, renderMobileCard, loading, clearFilters }) {

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
    <div className="w-full md:border-2 border-default flex flex-col">


      <div className="hidden md:block">
        <table className="w-full table-fixed border-b border-default">
          <TableHeader columns={columns} />
        </table>
      </div>

      <div className="hidden md:block flex-1 overflow-y-auto">

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


      <div className="block md:hidden flex-1 overflow-y-auto p-2">
        {renderMobileCard
          ? data?.map((row, index) => {
            if (!row) return null;
            return (
              <div key={row.id || index}>
                {renderMobileCard(row)}
              </div>
            )
          })
          : null}
      </div>


      <div className="">
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

    </div>);
}
export default DataTable;