import ImageGallery from "./ImageGallery";
import { ListingType } from "@/lib/generated/prisma/client";
import { MapPin, Star, ShieldCheck, Clock3 } from "lucide-react";
import { Decimal } from "@prisma/client/runtime/client";
import { ListingMapWrapper } from "./ListingMapWrapper";

type ListingDetailsProps = {
  listing: {
    category: {
      id: string;
      name: string;
      slug: string;
      createdAt: Date;
      updatedAt: Date;
    };
    description: string;
    id: string;
    images: string[];
    location: {
      id: string;
      address: string;
      latitude: Decimal;
      longitude: Decimal;
      listingId: string;
    } | null;
    name: string;
    price: Decimal;
    type: ListingType;
  };
};

export const ListingDetails = ({ listing }: ListingDetailsProps) => {
  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
      <section className="min-w-0">
        <ImageGallery images={listing.images} name={listing.name} />
      </section>

      <section className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {listing.type === "Rent" ? "Rent" : "borrow"}
          </span>

          <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs font-medium text-zinc-400">
            {listing.category.name}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl md:leading-tight">
          {listing.name}
        </h1>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <Star size={16} className="fill-amber-400 text-amber-400" />
          <span className="font-semibold text-zinc-200">4.8</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400">12 reviews</span>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-2xl border border-fuchsia-500/20 bg-linear-to-br from-fuchsia-500/9 via-zinc-900/90 to-zinc-950 p-4 md:p-5">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="relative">
            <p className="text-sm font-medium text-zinc-400">
              {listing.type === "Rent" ? "Rental price" : "Borrow this item"}
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-4xl font-bold tracking-tight text-white">
                {listing.type === "Rent"
                  ? `$${listing.price.toString()}`
                  : "Free"}
              </span>
              {listing.type === "Rent" && (
                <span className="text-sm text-zinc-500">/ day</span>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-xs text-zinc-400">
              <ShieldCheck size={15} className="text-fuchsia-400" />
              <span>Coordinate pickup directly with the owner</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-white">About this item</h2>
          <p className="mt-1 whitespace-pre-line text-sm leading-7 text-zinc-400 md:text-base">
            {listing.description}
          </p>
        </div>

        <div className="mt-6 border-t border-zinc-800/80 pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-500/15 bg-fuchsia-500/8">
              <MapPin size={19} className="text-fuchsia-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-white">Pickup location</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {listing.location?.address || "Location not provided"}
              </p>
              <p className="mt-1.5 text-xs text-zinc-600">
                {listing.location
                  ? "Map shows the item's pickup area"
                  : "The owner hasn't added a location yet"}
              </p>
            </div>
          </div>

          {listing.location && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
              <div className="overflow-hidden rounded-xl">
                <ListingMapWrapper
                  address={listing.location.address}
                  latitude={Number(listing.location.latitude)}
                  longitude={Number(listing.location.longitude)}
                />
              </div>

              <div className="flex items-center justify-between gap-3 px-3 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Clock3 size={15} className="shrink-0 text-zinc-500" />
                  <span className="truncate text-xs text-zinc-400">
                    Pickup arranged with owner
                  </span>
                </div>

                <span className="shrink-0 text-xs font-medium text-fuchsia-400">
                  View on map
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
