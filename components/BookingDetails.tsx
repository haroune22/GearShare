import { ListingType } from "@/lib/generated/prisma/browser";
import { Decimal } from "@prisma/client/runtime/client";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ReceiptText,
  UserRound,
} from "lucide-react";
import Image from "next/image";

type BookingDetailsProps = {
  bookingData: {
    PricePerDay: Decimal;
    createdAt: Date;
    id: string;
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
    owner: {
      id: string;
      image: string | null;
      name: string | null;
      userName: string | null;
    };
    pickedUpAt: Date | null;
    pickupAt: Date;
    renter: {
      id: string;
      image: string | null;
      name: string | null;
      userName: string | null;
    };
    totalPrice: Decimal;
  };
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const formatPrice = (price: Decimal | number) =>
  new Intl.NumberFormat("en-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 2,
  }).format(Number(price));

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const BookingDetails = ({ bookingData }: BookingDetailsProps) => {
  const {
    createdAt,
    pickupAt,
    pickedUpAt,
    PricePerDay,
    totalPrice,
    owner,
    renter,
  } = bookingData;

  const ownerName = owner.name || owner.userName || "Owner";
  const renterName = renter.name || renter.userName || "Renter";

  return (
    <div className="space-y-6 text-zinc-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-zinc-400">Your booking</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Booking details
          </h1>
          <p className="text-sm text-zinc-400">
            Review your reservation and rental information.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-fuchsia-500/10">
              <CalendarDays className="size-5 text-fuchsia-400" />
            </div>
            <div>
              <h2 className="font-semibold">Booking information</h2>
              <p className="text-sm text-zinc-500">
                Important dates for this reservation
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex size-9 items-center justify-center rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
                  <Clock3 className="size-4 text-fuchsia-400" />
                </div>
                <div className="my-1 w-px flex-1 bg-zinc-800" />
              </div>

              <div className="flex-1 pb-4">
                <p className="text-sm text-zinc-500">Booking created</p>
                <p className="mt-1 font-medium">{formatDate(createdAt)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex size-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                  <CalendarDays className="size-4 text-zinc-300" />
                </div>
                {pickedUpAt && <div className="my-1 w-px flex-1 bg-zinc-800" />}
              </div>

              <div className="flex-1 pb-4">
                <p className="text-sm text-zinc-500">Scheduled pickup</p>
                <p className="mt-1 font-medium">{formatDate(pickupAt)}</p>
              </div>
            </div>

            {pickedUpAt && (
              <div className="flex gap-3">
                <div className="flex size-9 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-500">Picked up</p>
                  <p className="mt-1 font-medium">{formatDate(pickedUpAt)}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-fuchsia-500/10">
              <ReceiptText className="size-5 text-fuchsia-400" />
            </div>
            <div>
              <h2 className="font-semibold">Price summary</h2>
              <p className="text-sm text-zinc-500">Your booking cost</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 text-sm">
              <span className="text-zinc-400">Price per day</span>
              <span className="text-right font-medium">
                {formatPrice(PricePerDay)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 text-sm">
              <span className="text-zinc-400">Rental total</span>
              <span className="text-right font-medium">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">Total price</span>
                <span className="text-xl font-semibold text-fuchsia-300">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Final amount recorded for this booking.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="font-semibold">People involved</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Owner and renter information
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              role: "Item owner",
              person: owner,
              displayName: ownerName,
            },
            {
              role: "Renter",
              person: renter,
              displayName: renterName,
            },
          ].map(({ role, person, displayName }) => (
            <div
              key={role}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4"
            >
              {person.image ? (
                <Image
                  src={person.image}
                  width={100}
                  height={100}
                  alt={displayName}
                  className="size-12 shrink-0 rounded-full border border-zinc-700 object-cover"
                />
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold text-fuchsia-300">
                  {displayName !== "Owner" && displayName !== "Renter" ? (
                    getInitials(displayName)
                  ) : (
                    <UserRound className="size-5" />
                  )}
                </div>
              )}

              <div className="min-w-0">
                <p className="text-xs text-zinc-500">{role}</p>
                <p className="truncate font-medium">{displayName}</p>
                {person.userName && (
                  <p className="truncate text-sm text-zinc-500">
                    @{person.userName}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BookingDetails;
