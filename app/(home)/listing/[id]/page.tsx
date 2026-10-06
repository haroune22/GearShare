import { getListingById } from "@/action/listings";
import Image from "next/image";
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  Pencil,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import BookingRequestDialog from "@/components/BookingRequestDialog";

export default async function Listing({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const listing = await getListingById(id);
  // console.log(listing);

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl text-white">
        <h1>Sorry, couldn&apos;t find your tool</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full px-6 py-10 text-white md:px-12 lg:px-20">
      <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <span>Browse</span>
        <ChevronRight size={15} />
        <span>{listing.category.name}</span>
        <ChevronRight size={15} />
        <span className="text-zinc-300">{listing.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <ImageGallery images={listing.images} name={listing.name} />
        </section>

        <section className="flex flex-col">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              Available
            </span>
            <span className="text-md text-zinc-500">
              {listing.category.name}
            </span>
            {session?.user.id === listing.createdBy.id && (
              <Link
                href={`/listing/${listing.id}/edit`}
                className="flex items-center "
              >
                <Button className="flex text-lg hover:bg-fuchsia-800/80 cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-800 px-5 py-5 font-semibold ">
                  <Pencil className="mr-1" />
                  Edit
                </Button>
              </Link>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {listing.name}
          </h1>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={17} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.8</span>
            </div>
            <span className="text-zinc-500">•</span>
            <span className="text-sm text-zinc-400">12 reviews</span>
          </div>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-500">Rental price</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-bold">
                ${listing.price.toString()}
              </span>
              <span className="mb-1 text-sm text-zinc-500">/ week</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">About this item</h2>
            <p className="leading-7 text-zinc-400">{listing.description}</p>
          </div>

          <div className="mt-8 flex items-start gap-3 border-t border-zinc-800 pt-6">
            <MapPin size={20} className="mt-0.5 text-fuchsia-400" />
            <div>
              <p className="font-medium">Pickup location</p>
              <p className="mt-1 text-sm text-zinc-500">
                Location will be shown after booking
              </p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger
              render={
                <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-6 py-4 font-semibold transition hover:bg-fuchsia-500">
                  <CalendarDays size={19} />
                  Request to rent
                </button>
              }
            />
            <BookingRequestDialog
              id={listing.id}
              createdBy={listing.createdBy!}
              description={listing.description}
              address={listing.location?.address || ""}
              latitude={Number(listing.location?.latitude)}
              longitude={Number(listing.location?.longitude)}
              price={Number(listing.price)}
              name={listing.name}
            />
          </Dialog>

          <p className="mt-3 text-center text-xs text-zinc-600">
            You&apos;ll choose your rental dates next
          </p>
        </section>
      </div>

      <section className="mt-16 border-t border-zinc-800 pt-10">
        <h2 className="mb-6 text-xl font-semibold">Listed by</h2>
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-center gap-4">
            {listing.createdBy.image ? (
              <Image
                src={listing.createdBy.image}
                alt={listing.createdBy.name ?? "Owner"}
                width={56}
                height={56}
                sizes=""
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800">
                <User size={24} className="text-zinc-500" />
              </div>
            )}
            <div>
              <p className="font-semibold">
                {listing.createdBy.name ?? "Unknown owner"}
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span>4.9</span>
                <span>•</span>
                <span>12 reviews</span>
              </div>
            </div>
          </div>
          <ShieldCheck size={22} className="text-emerald-400" />
        </div>
      </section>

      <section className="mt-12 border-t border-zinc-800 pt-10 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Reviews</h2>
            <p className="mt-1 text-sm text-zinc-500">
              What renters say about this item
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Star size={18} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">4.8</span>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-dashed border-zinc-800 p-10 text-center">
          <p className="text-zinc-500">No reviews yet.</p>
        </div>
      </section>
    </main>
  );
}
