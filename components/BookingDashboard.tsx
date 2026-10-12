"use client";
import { CalendarDays, ChevronDown, SlidersHorizontal } from "lucide-react";

import BookingSideBar from "@/components/BookingSideBar";
import { BookingCardData } from "@/lib/types";
import BookingCard from "./BookingCards";
import { useEffect, useState } from "react";

type BookingDashboardProps = {
  bookings: BookingCardData[];
  view: string;
};

const statusFilters = [
  { label: "All", value: "All" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Picked up", value: "PICKED_UP" },
];
type statusFilters = [
  "All",
  "Active",
  "Pending",
  "Completed",
  "Cancelled",
  "Picked up",
];

const BookingDashboard = ({ bookings, view }: BookingDashboardProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [data, setData] = useState<BookingCardData[]>(bookings);

  console.log(selectedStatus);
  const headings: Record<string, { title: string; description: string }> = {
    all: {
      title: "Your bookings",
      description: "Keep track of your rentals and requests.",
    },
    renting: {
      title: "Your rentals",
      description: "Everything you've requested from other members.",
    },
    request: {
      title: "Rental requests",
      description: "Manage requests for your listed items.",
    },
  };

  const heading = headings[view] ?? headings.all;

  const filteredData = bookings.filter(
    (b) => selectedStatus === "All" || b.status === selectedStatus,
  );
  console.log(bookings.map((b) => b.status));

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-8">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="lg:sticky lg:top-8">
            <BookingSideBar />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-fuchsia-300">
                <CalendarDays className="size-4" />
                <span>Booking management</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {heading.title}
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                {heading.description}
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
              <SlidersHorizontal className="size-4" />
              <span>Filter bookings</span>
              <ChevronDown className="size-4" />
            </div>
          </div>

          <div className="mb-6 overflow-x-auto">
            <div className="flex min-w-max gap-2 border-b border-zinc-800 pb-3">
              {statusFilters.map((filter) => (
                <button
                  onClick={() => setSelectedStatus(filter.value)}
                  key={filter.label}
                  type="button"
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedStatus === filter.value
                      ? "bg-fuchsia-500 text-white"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              <span className="font-medium text-zinc-200">
                {bookings.length}
              </span>{" "}
              {bookings.length === 1 ? "booking" : "bookings"}
            </p>
            <span className="text-xs text-zinc-500">Most recent first</span>
          </div>

          {filteredData.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredData.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                <CalendarDays className="size-5 text-zinc-400" />
              </div>
              <h2 className="text-lg font-medium text-zinc-100">
                No bookings yet
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
                Your bookings will appear here once you start renting items or
                receive requests from other members.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default BookingDashboard;
