import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  handlePageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

function PaginationComponent({
  handlePageChange,
  currentPage,
  totalPages,
}: PaginationComponentProps) {
  return (
    <>
      <Pagination className="sm:self-end sm:justify-end self-center justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/dashboard?page=${currentPage}`}
              onClick={() => handlePageChange(currentPage - 1)}
              className="hover:bg-primary/10 text-primary hover:text-primary"
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                href={`/dashboard?page=${index + 1}`}
                onClick={() => handlePageChange(index + 1)}
                isActive={Boolean(index + 1 === currentPage)}
                className="border-primary hover:bg-primary/10 text-primary hover:text-primary"
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              className="hover:bg-primary/10 text-primary hover:text-primary"
              href={`/dashboard?page=${currentPage}`}
              onClick={() => handlePageChange(currentPage + 1)}
              
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

export default PaginationComponent;
