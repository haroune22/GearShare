import { getListings } from "@/action/listings";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
const Listings = async () => {
  const listings = await getListings();
  return (
    <div className="mt-8 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings?.map((listing) => {
        const price = Number(listing.price);
        return (
          <Card
            key={listing.id}
            className="group w-full overflow-hidden border-zinc-800 bg-zinc-900/70 py-0 transition-all duration-300 hover:-translate-y-1 hover:border-[#9852f2]/50 hover:shadow-lg hover:shadow-[#9852f2]/10"
          >
            <Link href={`/listing/${listing.id}`}>
              <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-[#9852f2]/20">
                <span className="text-6xl font-bold text-zinc-700 transition-transform duration-500 group-hover:scale-110">
                  {listing.name.charAt(0)}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-sm">
                  {listing.status}
                </span>
                <span className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {listing.type}
                </span>
              </div>
            </Link>
            <CardHeader className="gap-2 px-5 pt-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-white">
                    {listing.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-400">
                    {listing.description}
                  </p>
                </div>
                <Link
                  href={`/listing/${listing.id}`}
                  className="shrink-0 rounded-full p-2 text-zinc-500 transition-colors hover:bg-[#9852f2]/10 hover:text-[#9852f2]"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" /> <span>4.8</span>
                  <span className="text-zinc-500">(12)</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500">
                  <MapPin className="h-4 w-4" /> <span>Nearby</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-zinc-800 pt-4">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                  {listing.createdBy?.image ? (
                    <Image
                      width={36}
                      height={36}
                      src={listing.createdBy.image}
                      alt={listing.createdBy.name ?? "Owner"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-400">
                      {listing.createdBy?.name?.charAt(0) ?? "U"}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500">Listed by</p>
                  <p className="truncate text-sm font-medium text-zinc-300">
                    {listing.createdBy?.userName ||
                      listing.createdBy?.name ||
                      "Unknown user"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
              <div>
                {listing.type === "Borrow" ? (
                  <p className="text-lg font-bold text-emerald-400">
                    Free to borrow
                  </p>
                ) : (
                  <>
                    <span className="text-xl font-bold text-white">
                      {price.toFixed(2)} DA
                    </span>
                    <span className="ml-1 text-xs text-zinc-500">/ week</span>
                  </>
                )}
              </div>
              <Button className="rounded-xl bg-[#9852f2] font-semibold hover:bg-[#9852f2]/80">
                <Link href={`/listing/${listing.id}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default Listings;
