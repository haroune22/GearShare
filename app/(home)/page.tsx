import { getListings } from "@/action/listings";
import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import Listings from "@/components/Listings";
import Why from "@/components/Why";
import { Button } from "@/components/ui/button";
import { ListCheck } from "lucide-react";

export default async function Home() {
  const listings = await getListings({});
  return (
    <main className="flex w-full flex-col items-center">
      <Hero />
      <div className="w-full max-w-7xl px-6">
        <Categories />
        <section className="py-16">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Available Equipment
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Find the right tools for your next job.
              </p>
            </div>
            <Button className="w-fit cursor-pointer bg-[#9852f2] px-6 py-6 text-base font-bold transition-colors hover:bg-[#9852f2]/80">
              <ListCheck className="mr-2 h-5 w-5" /> Create Listing
            </Button>
          </div>
          <Listings listings={listings} />
        </section>
        <Why />
      </div>
    </main>
  );
}
