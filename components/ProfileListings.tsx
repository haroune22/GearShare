import { Package } from "lucide-react";
import type { ProfileListing } from "../lib/types";
import Link from "next/link";

type Props = {
  listings: ProfileListing[];
  isOwner: boolean;
};

export function ProfileListings({ listings, isOwner }: Props) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {isOwner ? "My listings" : "Listings"}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Items published by this member.
          </p>
        </div>

        <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
          {listings.length}
        </span>
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 py-12 text-center">
          <Package size={35} className="text-zinc-600" />

          <h3 className="mt-4 font-medium text-white">No listings yet</h3>

          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            {isOwner
              ? "You haven't published any items yet. Your listings will appear here."
              : "This member hasn't published any items yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            const image = listing.images?.[0];
            const isBorrow = listing.type.toLowerCase() === "borrow";

            return (
              <Link
                href={`/listing/${listing.id}`}
                key={listing.id}
                className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition hover:border-fuchsia-500/40"
              >
                <div
                  className="flex h-44 items-center justify-center bg-zinc-800 bg-cover bg-center"
                  style={
                    image ? { backgroundImage: `url("${image}")` } : undefined
                  }
                >
                  {!image && <Package size={40} className="text-zinc-600" />}
                </div>

                <div className="p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-xs text-fuchsia-300">
                      {listing.type}
                    </span>

                    <span className="text-xs text-zinc-500">
                      {listing.status}
                    </span>
                  </div>

                  <h3 className="truncate font-semibold text-white transition group-hover:text-fuchsia-300">
                    {listing.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm text-zinc-400">
                    {listing.description || "No description provided."}
                  </p>

                  <div className="mt-4 border-t border-zinc-800 pt-4">
                    <p className="font-semibold text-white">
                      {isBorrow
                        ? "Free to borrow"
                        : `${listing.price} DA / day`}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
