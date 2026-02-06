import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.scss";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = "",
}) => {
  const [jumpPage, setJumpPage] = useState<string>("");

  useEffect(() => {
    setJumpPage("");
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleJumpSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = parseInt(jumpPage);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        handlePageChange(page);
        setJumpPage("");
      }
    }
  };

  const renderPageNumbers = () => {
    // ... logic remains similar but simplified for space if needed
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <li key={`dots-${index}`} className={styles.page_item}>
            <span className={styles.dots}>...</span>
          </li>
        );
      }
      return (
        <li key={page} className={styles.page_item}>
          <button
            className={`${styles.page_link} ${currentPage === page ? styles.active : ""}`}
            onClick={() => handlePageChange(page as number)}
          >
            {page}
          </button>
        </li>
      );
    });
  };

  // Calculate range string
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`${styles.pagination_container} ${className}`}>
      {/* Left Part: Show Entries & Page Size */}
      <div className={styles.pagination_info}>
        <span>Show</span>
        {onPageSizeChange && (
          <select
            className={styles.page_size_select}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        )}
        <span>per page</span>
        {totalItems > 0 && (
          <span style={{ marginLeft: 8, opacity: 0.7 }}>
            ( {startItem} - {endItem} of {totalItems} )
          </span>
        )}
      </div>

      {/* Right Part: Pagination Controls & Jump */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <ul className={styles.pagination_controls}>
          <li className={styles.page_item}>
            <button
              className={styles.page_link}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
          </li>

          {totalPages > 1 && renderPageNumbers()}

          <li className={styles.page_item}>
            <button
              className={styles.page_link}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </li>
        </ul>

        <div className={styles.jump_to_page}>
          <span>Go to</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            placeholder={String(currentPage)}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyDown={handleJumpSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
