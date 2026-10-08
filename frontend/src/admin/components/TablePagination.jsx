import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TablePagination = ({
  currentPage,
  pageCount,
  pageSize,
  totalItems,
  setCurrentPage,
}) => {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const firstVisiblePage = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
  const lastVisiblePage = Math.min(pageCount, firstVisiblePage + 4);
  const visiblePages = Array.from(
    { length: lastVisiblePage - firstVisiblePage + 1 },
    (_, index) => firstVisiblePage + index
  );

  return (
    <nav
      aria-label="Table pagination"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eee4da] bg-white px-4 py-3"
    >
      <p className="text-xs text-[#8c7661]">
        Showing <span className="font-semibold text-[#4d3d2f]">{start}–{end}</span> of{" "}
        <span className="font-semibold text-[#4d3d2f]">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#e3d3c2] px-3 text-xs font-semibold text-[#6b5a49] transition hover:bg-[#f6ede0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaChevronLeft size={10} /> <span className="hidden sm:inline">Previous</span>
        </button>
        {firstVisiblePage > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              aria-label="Page 1"
              className="h-9 min-w-9 rounded-lg border border-[#e3d3c2] px-2 text-xs font-semibold text-[#6b5a49] hover:bg-[#f6ede0]"
            >
              1
            </button>
            {firstVisiblePage > 2 && <span className="px-1 text-xs text-[#8c7661]">…</span>}
          </>
        )}
        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={`h-9 min-w-9 rounded-lg border px-2 text-xs font-semibold transition ${
              currentPage === page
                ? "border-[#c8a279] bg-[#c8a279] text-white"
                : "border-[#e3d3c2] text-[#6b5a49] hover:bg-[#f6ede0]"
            }`}
          >
            {page}
          </button>
        ))}
        {lastVisiblePage < pageCount && (
          <>
            {lastVisiblePage < pageCount - 1 && <span className="px-1 text-xs text-[#8c7661]">…</span>}
            <button
              type="button"
              onClick={() => setCurrentPage(pageCount)}
              aria-label={`Page ${pageCount}`}
              className="h-9 min-w-9 rounded-lg border border-[#e3d3c2] px-2 text-xs font-semibold text-[#6b5a49] hover:bg-[#f6ede0]"
            >
              {pageCount}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageCount}
          aria-label="Next page"
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#e3d3c2] px-3 text-xs font-semibold text-[#6b5a49] transition hover:bg-[#f6ede0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Next</span> <FaChevronRight size={10} />
        </button>
      </div>
    </nav>
  );
};

export default TablePagination;
