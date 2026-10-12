import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, UserRound } from "lucide-react";
import { BookingCardData } from "@/lib/types";
import Image from "next/image";

type BookingCardProps = {
  booking: BookingCardData;
};

const statusStyles: Record<string, string> = {
  ACTIVE: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  ACCEPTED: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  PENDING: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  COMPLETED: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  CANCELLED: "border-red-400/20 bg-red-400/10 text-red-300",
  PICKED_UP: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-300",
  RETURNED: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  NO_SHOW: "border-red-400/20 bg-red-400/10 text-red-300",
};

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const BookingCard = ({ booking }: BookingCardProps) => {
  const status = String(booking.status);
  const image = booking.listing.images?.[0];

  return (
    <Link
      href={`/booking/${booking.id}`}
      className="group block rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 transition-all hover:border-fuchsia-500/40 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-44 shrink-0 overflow-hidden rounded-lg bg-zinc-800 sm:h-32 sm:w-36">
          {image ? (
            <Image
              src={image}
              fill
              alt={booking.listing.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              No image
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Booking #{booking.id.slice(0, 8)}
              </p>
              <h3 className="truncate text-lg font-semibold text-zinc-100 transition-colors group-hover:text-fuchsia-300">
                {booking.listing.name}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                <UserRound className="size-4 shrink-0" />
                <span className="truncate">
                  {booking.otherUser.userName ?? "GearShare member"}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status] ?? "border-zinc-700 bg-zinc-800 text-zinc-300"}`}
            >
              {formatStatus(status)}
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3 border-t border-zinc-800 pt-3">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-500">
                  <CalendarDays className="size-3.5" />
                  Rental period
                </div>
                <p className="text-sm text-zinc-300">
                  {formatDate(booking.pickupAt)}
                  {" – "}
                  {formatDate(booking.returnAt)}
                </p>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Clock3 className="size-3.5" />
                  Booked on
                </div>
                <p className="text-sm text-zinc-300">
                  {formatDate(booking.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-lg font-semibold text-zinc-100">
                  {booking.totalPrice.toString()} DA
                </p>
                <p className="text-xs text-zinc-500">Total price</p>
              </div>
              <ArrowUpRight className="size-5 text-zinc-500 transition-colors group-hover:text-fuchsia-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookingCard;
