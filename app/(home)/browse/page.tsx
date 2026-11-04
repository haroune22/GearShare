import { getCategory } from "@/action/category";
import { getListings, getListingsCount } from "@/action/listings";

import Listings from "@/components/Listings";
import ListingsFilters from "@/components/ListingsFilters";
import ListingsPagination from "@/components/ListingsPagination";

import { ListCheck } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

type SearchParamValue = string | string[] | undefined;

type SearchParams = Promise<{
  category?: SearchParamValue;
  name?: SearchParamValue;
  page?: SearchParamValue;
  userId?: SearchParamValue;
}>;

const getSingleParam = (value: SearchParamValue) => {
  return Array.isArray(value) ? value[0] : value;
};

const Browse = async ({ searchParams }: { searchParams: SearchParams }) => {
  const params = await searchParams;

  const category = getSingleParam(params.category) ?? "";
  const name = getSingleParam(params.name) ?? "";
  const userId = getSingleParam(params.userId) ?? "";

  // Validate requested page
  const rawPage = Number(getSingleParam(params.page) ?? "1");

  const requestedPage =
    Number.isSafeInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  const filters = {
    categorySlug: category,
    name,
    userId,
  };

  // Fetch categories and count listings in parallel
  const [categories, totalCount] = await Promise.all([
    getCategory(),
    getListingsCount(filters),
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const currentPage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Fetch only the listings for the current page
  const listings = await getListings({
    ...filters,
    take: ITEMS_PER_PAGE,
    skip,
  });

  return (
    <main className="min-h-screen w-full px-4 py-10 md:px-14">
      <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Available Equipment
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Find the right tools for your next job.
          </p>
        </div>

        <Link
          href="/listing/new"
          className="flex w-fit cursor-pointer rounded-lg bg-[#9852f2] px-6 py-5 text-base font-bold transition-colors hover:bg-[#9852f2]/80"
        >
          <ListCheck className="mr-2 h-5 w-5" />
          Create Listing
        </Link>
      </div>

      <ListingsFilters categories={categories} />

      <Listings listings={listings} />

      <ListingsPagination totalPages={totalPages} currentPage={currentPage} />
    </main>
  );
};

export default Browse;
