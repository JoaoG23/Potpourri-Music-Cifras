import { Button } from "@/components/ui/button";
import React from "react";

type PaginationProps<T = unknown> = {
  page: number;
  setPage: (page: number) => void;
  data: T;
};

export const Pagination = <T extends { pagination?: { has_prev?: boolean; has_next?: boolean; pages?: number } }>({
  page,
  setPage,
  data,
}: PaginationProps<T>): React.ReactElement => {
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Sliding window calculation for page numbers
  const totalPages = data?.pagination?.pages || 1;
  const windowSize = Math.min(5, totalPages);
  const halfWindow = Math.floor(windowSize / 2);

  let start = Math.max(1, page - halfWindow);
  let end = start + windowSize - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - windowSize + 1);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page - 1)}
        disabled={!data?.pagination?.has_prev}
      >
        Anterior
      </Button>

      <div className="flex items-center gap-1">
        {/* First page and leading ellipsis */}
        {start > 1 && (
          <>
            <Button
              key={1}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            {start > 2 && <span className="px-1 select-none">…</span>}
          </>
        )}

        {/* Sliding window of pages */}
        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}

        {/* Trailing ellipsis and last page */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 select-none">…</span>}
            <Button
              key={totalPages}
              variant={page === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page + 1)}
        disabled={!data?.pagination?.has_next}
      >
        Próximo
      </Button>
    </div>
  );
};
