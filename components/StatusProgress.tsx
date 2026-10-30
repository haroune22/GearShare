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
];

const progressByStatus: Record<string, number> = {
  PENDING: 0,
  ACCEPTED: 33,
  PICKED_UP: 67,
  RETURNED: 100,
};

export const StatusProgress = ({ bookingStatus }: StatusProgressProps) => {
  const isCancelled = bookingStatus === "CANCELLED";
  const isNoShow = bookingStatus === "NO_SHOW";
  const isDeclined = bookingStatus === "DECLINED";

  const isTerminalFailure = isCancelled || isNoShow || isDeclined;

  if (isTerminalFailure) {
    const title = isCancelled
      ? "Booking cancelled"
      : isNoShow
        ? "Renter did not show up"
        : "Booking declined";

    const description = isCancelled
      ? "This booking was cancelled and will not proceed."
      : isNoShow
        ? "The pickup did not take place because the renter did not show up."
        : "The owner declined this booking request.";

    return (
      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
            <AlertCircle className="size-5 text-red-400" />
          </div>

          <div>
            <h2 className="font-semibold text-red-300">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {description}
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

  const currentIndex = steps.findIndex((step) => step.status === bookingStatus);

  // Avoid showing misleading progress for an unknown status.
  if (currentIndex === -1) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="size-5 text-zinc-400" />
          <div>
            <h2 className="font-semibold text-zinc-100">
              Booking status unavailable
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Current status: {bookingStatus}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const progress = progressByStatus[bookingStatus];

  const isReturned = bookingStatus === "RETURNED";

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">
            Booking progress
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Follow your rental from request to return.
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
            isReturned
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300"
          }`}
        >
          {isReturned ? (
            <CheckCircle2 className="size-3.5" />
          ) : (
            <Clock3 className="size-3.5" />
          )}
          {isReturned ? "Returned" : "In progress"}
        </span>
      </div>

      <Progress
        value={progress}
        className={`mb-6 h-2 overflow-hidden rounded-full bg-zinc-800 ${
          isReturned
            ? "[&_[data-slot=progress-indicator]]:bg-emerald-400"
            : "[&_[data-slot=progress-indicator]]:bg-fuchsia-500"
        }`}
      />

      <div className="grid grid-cols-4 gap-2">
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
                      ? isReturned
                        ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 ring-4 ring-emerald-500/10"
                        : "border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-300 ring-4 ring-fuchsia-500/10"
                      : "border-zinc-700 bg-zinc-800/80 text-zinc-500"
                }`}
              >
                {isDone ? (
                  <CircleCheck className="size-4" />
                ) : isCurrent ? (
                  isReturned ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <PackageCheck className="size-4" />
                  )
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
                <p
                  className={`mt-1 text-xs ${
                    isReturned ? "text-emerald-300" : "text-fuchsia-300"
                  }`}
                >
                  {isReturned ? "Finished" : "Current step"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
