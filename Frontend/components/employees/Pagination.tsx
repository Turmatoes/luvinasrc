'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null; // Don't show pagination if only one page
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Max page numbers to show (not including prev/next)

    if (totalPages <= maxVisible) {
      // Show all pages if total <= 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add pages around current
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagin">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-sm btn-pre btn-falcon-default"
        style={{
          opacity: currentPage === 1 ? 0.5 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        <svg
          className="svg-inline--fa fa-chevron-left fa-w-10"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="chevron-left"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"
          ></path>
        </svg>
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...' || page === currentPage}
          className={
            page === currentPage
              ? 'btn btn-sm btn-falcon-default btn-disabled'
              : page === '...'
              ? 'btn btn-sm btn-falcon-default btn-disabled'
              : 'btn btn-sm text-primary btn-falcon-default'
          }
          style={{
            cursor:
              page === '...' || page === currentPage ? 'default' : 'pointer',
            opacity:
              page === '...' || page === currentPage ? 0.6 : 1,
          }}
        >
          {page === '...' ? (
            <svg
              className="svg-inline--fa fa-ellipsis-h fa-w-16"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="ellipsis-h"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"
              ></path>
            </svg>
          ) : (
            page
          )}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-sm btn-next btn-falcon-default"
        style={{
          opacity: currentPage === totalPages ? 0.5 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        <svg
          className="svg-inline--fa fa-chevron-right fa-w-10"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="chevron-right"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
          ></path>
        </svg>
      </button>
    </div>
  );
}
