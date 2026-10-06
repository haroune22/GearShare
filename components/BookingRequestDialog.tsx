"use client";

import React from "react";
import { CalendarDays, MapPin, UserRound } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "./ui/calendar";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

type BookingRequestDialogProps = {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  createdBy: {
    id: string;
    image: string | null;
    name: string | null;
    userName: string | null;
  };
};

function BookingRequestDialog({
  createdBy,
  description,
  address,
  price,
  name,
}: BookingRequestDialogProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const rentalDays =
    dateRange?.from && dateRange?.to
      ? Math.max(
          1,
          Math.ceil(
            (dateRange.to.getTime() - dateRange.from.getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

  const totalPrice = rentalDays * price;

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-700 bg-zinc-950 text-zinc-100 sm:max-w-lg">
      <DialogHeader className="border-b border-zinc-800 pb-4">
        <DialogTitle className="text-xl font-semibold text-white">
          Request to rent
        </DialogTitle>
        <DialogDescription className="text-zinc-400">
          Choose your rental dates and review the request details.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white">{name}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-300">
                {description}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-semibold text-white">${price}</p>
              <p className="text-xs text-zinc-400">per day</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-zinc-800 pt-3">
            <UserRound className="size-4 text-fuchsia-400" />
            <span className="text-sm text-zinc-300">
              {createdBy.name || createdBy.userName || "Owner"}
            </span>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-fuchsia-500/10">
              <MapPin className="size-4 text-fuchsia-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white">
                Pickup location
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                {address}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="size-4 text-fuchsia-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Rental dates</h3>
              <p className="text-xs text-zinc-400">
                Select when you want to rent the item.
              </p>
            </div>
          </div>

          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            disabled={{ before: new Date() }}
            numberOfMonths={1}
            className="mx-auto text-zinc-900 rounded-2xl"
          />
        </section>

        <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">
            Price summary
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Rental</span>
              <span className="text-zinc-200">
                {rentalDays > 0
                  ? `${rentalDays} day${rentalDays === 1 ? "" : "s"} × $${price}`
                  : "Select dates"}
              </span>
            </div>

            <div className="border-t border-zinc-800 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-300">Total</span>
                <span className="text-xl font-bold text-white">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <DialogFooter className="border-t border-zinc-800 bg-zinc-900 pt-4">
        <DialogClose
          render={
            <Button variant="secondary" className="py-5">
              Cancel
            </Button>
          }
        />
        <Button
          type="button"
          disabled={!dateRange?.from || !dateRange?.to}
          className="bg-fuchsia-600 py-5 font-semibold text-lg text-white hover:bg-fuchsia-500 disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          Request to rent
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default BookingRequestDialog;
