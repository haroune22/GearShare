"use client";

import { usePathname, useSearchParams } from "next/navigation";

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
  totalPages: number;
  currentPage: number;
};

const ListingsPagination = ({
  totalPages,
  currentPage,
}: ListingsPaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  // Preserve existing filters and change only the page.
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    return `${pathname}?${params.toString()}`;
  };

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Display a maximum of 7 page entries, including ellipses.
  const getVisiblePages = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [1];

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="mt-12 flex justify-center">
      <Pagination>
        <PaginationContent className="gap-1">
          {hasPrev && (
            <PaginationItem>
              <PaginationPrevious
                href={createPageUrl(currentPage - 1)}
                className="transition-colors  hover:bg-fuchsia-500/10 hover:text-fuchsia-400"
              />
            </PaginationItem>
          )}

          {getVisiblePages().map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={createPageUrl(page)}
                  isActive={page === currentPage}
                  className="h-9 w-9 transition-colors hover:border-fuchsia-500 text-fuchsia-400"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {hasNext && (
            <PaginationItem>
              <PaginationNext
                href={createPageUrl(currentPage + 1)}
                className="transition-colors hover:bg-fuchsia-500/10 hover:text-fuchsia-400"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ListingsPagination;
