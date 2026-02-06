import React, { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Table.module.scss";
import Pagination, { PaginationProps } from "../Pagination/Pagination";
import { ChevronUp, ChevronDown, ChevronsUpDown, Info, X } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  description?: string; // New description prop
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  keyExtractor?: (row: T) => string | number;
  emptyMessage?: string;
  pagination?: PaginationProps;
  sortColumn?: keyof T;
  sortDirection?: "asc" | "desc";
  onSort?: (column: keyof T) => void;
}

const Table = <T extends object>({
  columns,
  data,
  className = "",
  keyExtractor,
  emptyMessage = "No data available",
  pagination,
  sortColumn,
  sortDirection,
  onSort,
}: TableProps<T>) => {
  const [activeInfoColumn, setActiveInfoColumn] = useState<Column<T> | null>(
    null,
  );

  // Helper to render cell content
  const renderCell = (row: T, col: Column<T>) => {
    if (col.render) {
      return col.render(row);
    }
    return row[col.accessor] as ReactNode;
  };

  const handleHeaderClick = (col: Column<T>) => {
    if (col.sortable && typeof col.accessor === "string" && onSort) {
      onSort(col.accessor as keyof T);
    }
  };

  const handleInfoClick = (e: React.MouseEvent, col: Column<T>) => {
    e.stopPropagation(); // Prevent sorting when clicking info
    setActiveInfoColumn(col);
  };

  return (
    <>
      <div className={`table_container ${className}`}>
        <div className={styles.table_wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col, index) => {
                  const isSortable =
                    col.sortable && typeof col.accessor === "string";

                  return (
                    <th
                      key={index}
                      className={`${col.headerClassName || ""} ${isSortable ? styles.sortable : ""}`}
                      onClick={() => handleHeaderClick(col)}
                      style={
                        isSortable
                          ? { display: "table-cell", cursor: "pointer" }
                          : {}
                      }
                    >
                      <div className={styles.header_content}>
                        {col.header}

                        {/* Sort Icons */}
                        {isSortable && (
                          <span className="text-gray-400">
                            {sortColumn === col.accessor ? (
                              sortDirection === "asc" ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )
                            ) : (
                              <ChevronsUpDown
                                size={14}
                                className="opacity-50"
                              />
                            )}
                          </span>
                        )}

                        {/* Info Icon */}
                        {col.description && (
                          <span
                            className={styles.info_icon}
                            onClick={(e) => handleInfoClick(e, col)}
                            title="View details"
                          >
                            <Info size={14} />
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => {
                  // Determine unique key: explicit extractor > 'id' property > index
                  const key = keyExtractor
                    ? keyExtractor(row)
                    : (row as any).id || rowIndex;

                  return (
                    <tr key={key}>
                      {columns.map((col, colIndex) => (
                        <td key={colIndex} className={col.className || ""}>
                          {renderCell(row, col)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className={styles.empty_state}>
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Integrated Pagination */}
        {pagination && (
          <div className={styles.table_footer}>
            <Pagination {...pagination} />
          </div>
        )}
      </div>

      {/* Info Modal - Ported to body to ensure it's on top of everything */}
      {activeInfoColumn &&
        createPortal(
          <div
            className={styles.modal_overlay}
            onClick={() => setActiveInfoColumn(null)}
          >
            <div
              className={styles.modal_content}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={styles.modal_header}>
                <h3>
                  <Info
                    size={20}
                    className={styles.title_icon}
                    strokeWidth={2.5}
                  />
                  {activeInfoColumn.header}
                </h3>
                <button
                  onClick={() => setActiveInfoColumn(null)}
                  className={styles.close_btn}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className={styles.modal_body}>
                <p>{activeInfoColumn.description}</p>
              </div>

              {/* Footer */}
              <div className={styles.modal_actions}>
                <button onClick={() => setActiveInfoColumn(null)}>
                  Got it
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Table;
