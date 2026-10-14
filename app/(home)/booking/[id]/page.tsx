import { getBookingInfo } from "@/action/booking";
import { auth } from "@/auth";
import ImageGallery from "@/components/ImageGallery";
import { StatusProgress } from "@/components/StatusProgress";

import { ChevronRightCircle, MapPin, Star } from "lucide-react";
import { redirect } from "next/navigation";

const BookingIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/");
  }

  const { id } = await params;
  const data = await getBookingInfo(id);

  if (!data.booking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl text-white">
        <h1>Sorry, couldn&apos;t find your Booking</h1>
      </div>
    );
  }
  return (
    <main className="min-h-screen w-full px-6 py-10 text-white md:px-12 lg:px-20">
      <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <span>Booking</span>
        <ChevronRightCircle size={15} />
        <span className="text-zinc-300">{data.booking.listing.name}</span>
      </div>
      <StatusProgress bookingStatus={data.booking.status} />
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <ImageGallery
            images={data.booking.listing.images}
            name={data.booking.listing.name}
          />
        </section>

        <section className="flex flex-col">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              Available
            </span>
            <span className="text-md text-zinc-500">
              {data.booking.listing.category.name}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {data.booking.listing.name}
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
                ${data.booking.listing.price.toString()}
              </span>
              <span className="mb-1 text-sm text-zinc-500">/ week</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">About this item</h2>
            <p className="leading-7 text-zinc-400">
              {data.booking.listing.description}
            </p>
          </div>

          <div className="mt-8 flex items-start gap-3 border-t border-zinc-800 pt-6">
            <MapPin size={20} className="mt-0.5 text-fuchsia-400" />
            <div>
              <p className="font-medium">Pickup location</p>
              <p className="mt-1 text-sm text-zinc-500">
                {data.booking.listing.location?.address}
              </p>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-zinc-600">
            You&apos;ll choose your rental dates next
          </p>
        </section>
      </div>
    </main>
  );
};

export default BookingIdPage;
