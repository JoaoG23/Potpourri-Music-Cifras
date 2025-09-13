import { Button } from "@/components/ui/button";
import React from "react";

type PaginationPropsT<T = unknown> = {
  page: number;
  setPage: (page: number) => void;
  data: T;
};
export const Pagination: React.FC<PaginationPropsT<T>> = ({
  page,
  setPage,
  data,
}) => {
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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
        {Array.from(
          { length: Math.min(5, data?.pagination?.pages) },
          (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          }
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
