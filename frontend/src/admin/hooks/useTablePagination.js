import { useState } from "react";

export const useTablePagination = (items, resetKey = "", pageSize = 5) => {
  const [pagination, setPagination] = useState({ resetKey, page: 1 });
  const requestedPage = pagination.resetKey === resetKey ? pagination.page : 1;
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(requestedPage, pageCount);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    pageItems: items.slice(startIndex, startIndex + pageSize),
    currentPage,
    pageCount,
    pageSize,
    totalItems: items.length,
    setCurrentPage: (page) => setPagination({ resetKey, page }),
  };
};
