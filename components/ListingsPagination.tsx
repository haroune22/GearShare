"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type ListingsPaginationProps = {
  listingsLength: number;
  currentPage: number;
};

const ListingsPagination = ({
  listingsLength,
  currentPage,
}: ListingsPaginationProps) => {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(listingsLength / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("page", page.toString());

    return `/browse?${params.toString()}`;
  };

  return (
    <div className="mt-12 flex justify-center">
      <Pagination>
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              href={
                currentPage > 1 ? createPageUrl(currentPage - 1) : undefined
              }
              className={
                currentPage === 1 ? "pointer-events-none opacity-40" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href={createPageUrl(page)}
                  isActive={page === currentPage}
                  className="h-9 w-9"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={
                currentPage < totalPages
                  ? createPageUrl(currentPage + 1)
                  : undefined
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-40"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ListingsPagination;
