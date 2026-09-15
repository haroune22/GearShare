import { getCategory } from "@/action/category";
import { getListings } from "@/action/listings";
import Listings from "@/components/Listings";
import ListingsFilters from "@/components/ListingsFilters";
import ListingsPagination from "@/components/ListingsPagination";
import { Button } from "@/components/ui/button";
import { ListCheck } from "lucide-react";

type SearchParams = Promise<{ category: string; name: string; page: number }>;

const Browse = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { name, category, page } = await searchParams;
  const listings = await getListings({ categorySlug: category, name });
  const categories = await getCategory();

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
        <Button className="w-fit cursor-pointer bg-[#9852f2] px-6 py-6 text-base font-bold transition-colors hover:bg-[#9852f2]/80">
          <ListCheck className="mr-2 h-5 w-5" />
          Create Listing
        </Button>
      </div>
      <ListingsFilters categories={categories} />
      <Listings listings={listings} />
      {listings && (
        <ListingsPagination
          listingsLength={listings.length}
          currentPage={page}
        />
      )}
    </main>
  );
};

export default Browse;
