"use client";

import {
  AlertCircle,
  CheckCircle2,
  CircleCheck,
  Clock3,
  PackageCheck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type StatusProgressProps = {
  bookingStatus: string;
};

const steps = [
  { label: "Requested", status: "PENDING" },
  { label: "Accepted", status: "ACCEPTED" },
  { label: "Picked up", status: "PICKED_UP" },
  { label: "Returned", status: "RETURNED" },
  { label: "Completed", status: "COMPLETED" },
];

const progressByStatus: Record<string, number> = {
  PENDING: 0,
  ACCEPTED: 25,
  PICKED_UP: 50,
  RETURNED: 75,
  COMPLETED: 100,
};

export const StatusProgress = ({ bookingStatus }: StatusProgressProps) => {
  const isCancelled = bookingStatus === "CANCELLED";
  const isNoShow = bookingStatus === "NO_SHOW";
  const isCompleted = bookingStatus === "COMPLETED";

  if (isCancelled || isNoShow) {
    return (
      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
            <AlertCircle className="size-5 text-red-400" />
          </div>

          <div>
            <h2 className="font-semibold text-red-300">
              {isCancelled ? "Booking cancelled" : "Renter did not show up"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {isCancelled
                ? "This booking was cancelled and will not proceed."
                : "The pickup did not take place because the renter did not show up."}
            </p>
          </div>
        </div>

        <Progress
          value={0}
          className="h-2 overflow-hidden rounded-full bg-zinc-800 **:data-[slot=progress-indicator]:bg-red-500"
        />
        <p className="mt-2 text-xs text-zinc-500">Booking progress · 0%</p>
      </section>
    );
  }

  if (isCompleted) {
    return (
      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
            <CheckCircle2 className="size-6 text-emerald-400" />
          </div>

          <div>
            <h2 className="font-semibold text-emerald-300">
              Rental completed successfully
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              The rental journey is complete. Thanks for using GearShare! You
              can now share your experience by leaving a review.
            </p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full w-full rounded-full bg-emerald-400" />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-emerald-300">All steps completed</span>
          <span className="font-medium text-emerald-300">100%</span>
        </div>
      </section>
    );
  }

  const currentIndex = steps.findIndex((step) => step.status === bookingStatus);

  const progress = progressByStatus[bookingStatus] ?? 0;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">
            Booking progress
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Follow your rental from request to completion.
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1.5 text-xs font-medium text-fuchsia-300">
          <Clock3 className="size-3.5" />
          In progress
        </span>
      </div>

      <Progress
        value={progress}
        className="mb-6 h-2 overflow-hidden rounded-full bg-zinc-800 **:data-[slot=progress-indicator]:bg-fuchsia-500"
      />

      <div className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.status} className="min-w-0">
              <div
                className={`mb-3 flex size-8 items-center justify-center rounded-full border transition-colors ${
                  isDone
                    ? "border-fuchsia-500 bg-fuchsia-500 text-white"
                    : isCurrent
                      ? "border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-300 ring-4 ring-fuchsia-500/10"
                      : "border-zinc-700 bg-zinc-800/80 text-zinc-500"
                }`}
              >
                {isDone ? (
                  <CircleCheck className="size-4" />
                ) : isCurrent ? (
                  <PackageCheck className="size-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>

              <p
                className={`wrap-break-words text-xs font-medium sm:text-sm ${
                  isDone || isCurrent ? "text-zinc-100" : "text-zinc-500"
                }`}
              >
                {step.label}
              </p>

              {isCurrent && (
                <p className="mt-1 text-xs text-fuchsia-300">Current step</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
