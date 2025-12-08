import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) return null;

  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  const goPrev = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const goNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPage = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const visible = 5;
    let start = Math.max(1, currentPage - Math.floor(visible / 2));
    let end = Math.min(totalPages, start + visible - 1);

    if (end - start < visible - 1) {
      start = Math.max(1, end - visible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center items-center gap-2 p-5 bg-white rounded-lg shadow-sm">
      <button
        className="px-4 py-2 border border-gray-300 bg-white rounded text-sm cursor-pointer transition-all hover:bg-gray-50 hover:border-blue-500 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={goPrev}
        disabled={!hasPreviousPage}
      >
        Previous
      </button>

      <div className="flex gap-1">
        {visiblePages.map(page => (
          <button
            key={page}
            className={`min-w-[36px] h-9 px-2 border rounded text-sm cursor-pointer transition-all flex items-center justify-center ${
              page === currentPage
                ? 'bg-blue-500 text-white border-blue-500 font-semibold'
                : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-blue-500'
            }`}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="px-4 py-2 border border-gray-300 bg-white rounded text-sm cursor-pointer transition-all hover:bg-gray-50 hover:border-blue-500 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={goNext}
        disabled={!hasNextPage}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
