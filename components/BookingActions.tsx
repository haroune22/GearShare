"use client";

import { BookingStatus, PaymentStatus } from "@/lib/generated/prisma/enums";
import { useRouter } from "next/navigation";
import {
  AcceptBooking,
  ConfirmPickup,
  DeclineBooking,
  ReturnedBooking,
} from "@/action/booking";
import {
  Ban,
  Check,
  Clock,
  CreditCard,
  PackageCheck,
  ShieldAlert,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const ActionButton = ({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => Promise<{ status: number; message: string }>;
  variant?: "primary" | "secondary" | "danger";
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!onClick || loading) return;

    setLoading(true);

    try {
      const result = await onClick();

      if (result.status === 200) {
        router.refresh();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Booking action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    primary:
      "border border-fuchsia-500 bg-fuchsia-600 text-white hover:bg-fuchsia-500",
    secondary:
      "border border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
    danger:
      "border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || !onClick}
      className={`inline-flex min-h-11 items-center justify-center cursor-pointer gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]}`}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {children}
    </button>
  );
};

type BookingActionsProps = {
  bookingId: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus | null;
  ownerId: string;
  renterId: string;
  currentUserId?: string;
  pickupAt?: Date;
};

const BookingActions = ({
  bookingId,
  bookingStatus,
  paymentStatus,
  ownerId,
  renterId,
  currentUserId,
  pickupAt,
}: BookingActionsProps) => {
  const isOwner = currentUserId === ownerId;
  const isRenter = currentUserId === renterId;
  const isParticipant = isOwner || isRenter;

  const status = String(bookingStatus);
  const isPaid = paymentStatus === PaymentStatus.COMPLETED;

  const isPending = status === "PENDING";
  const isAccepted = status === "ACCEPTED";
  const isPickedUp = status === "PICKED_UP";
  const isReturned = status === "RETURNED";

  const [passedDeadline, setPassedDeadline] = useState<number | null>(null);

  const pickupDeadline =
    pickupAt === undefined ? null : new Date(pickupAt).getTime();

  useEffect(() => {
    if (pickupDeadline === null || !Number.isFinite(pickupDeadline)) {
      return;
    }

    const delay = Math.max(0, pickupDeadline - Date.now());

    const timer = setTimeout(() => {
      setPassedDeadline(pickupDeadline);
    }, delay);

    return () => clearTimeout(timer);
  }, [pickupDeadline]);

  const pickupDeadlinePassed =
    pickupDeadline !== null && passedDeadline === pickupDeadline;

  const canCancel = isOwner && (isPending || isAccepted);
  const canMarkNoShow = isOwner && isAccepted && isPaid && pickupDeadlinePassed;

  const isTerminal = ["COMPLETED", "CANCELLED", "NO_SHOW", "DECLINED"].includes(
    status,
  );

  if (!isParticipant) {
    return null;
  }

  return (
    <section className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/10">
          <PackageCheck className="size-5 text-fuchsia-400" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-zinc-100">Booking actions</h2>
          <p className="mt-1 text-sm leading-5 text-zinc-400">
            {isOwner
              ? "Manage the rental request and coordinate the handoff."
              : "Review your booking and complete the next step."}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
          {isOwner ? "Owner" : "Renter"}
        </span>
      </div>

      <div className="h-px bg-zinc-800" />

      <div className="space-y-3">
        {isPending && isOwner && (
          <>
            <p className="text-sm text-zinc-300">
              Review this request before deciding.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <ActionButton onClick={() => AcceptBooking(bookingId)}>
                <Check className="size-4" />
                Accept request
              </ActionButton>

              <ActionButton
                variant="secondary"
                onClick={() => DeclineBooking(bookingId)}
              >
                <X className="size-4" />
                Decline request
              </ActionButton>
            </div>
          </>
        )}

        {isPending && isRenter && (
          <InfoMessage
            icon={<Clock className="size-5" />}
            title="Waiting for owner"
            description="Your request has been submitted. The owner needs to review it before you can continue."
          />
        )}

        {isAccepted && isRenter && !isPaid && (
          <>
            <InfoMessage
              icon={<CreditCard className="size-5" />}
              title="Your request was accepted"
              description="Your booking has been accepted. Complete payment to arrange pickup."
            />

            <ActionButton
              onClick={async () => {
                const response = await fetch("/api/stripe/checkout", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ bookingId }),
                });

                const data = await response.json();

                if (!response.ok || !data.url) {
                  throw new Error(data.error ?? "Unable to start checkout");
                }

                window.location.href = data.url;

                return {
                  status: 200,
                  message: "Redirecting to Stripe...",
                };
              }}
            >
              <CreditCard className="size-4" />
              Pay for booking
            </ActionButton>
          </>
        )}

        {isAccepted && isOwner && !isPaid && (
          <InfoMessage
            icon={<Clock className="size-5" />}
            title="Awaiting payment"
            description="The renter must complete payment before you can confirm pickup."
          />
        )}

        {isAccepted && isOwner && isPaid && (
          <>
            <InfoMessage
              icon={<Check className="size-5" />}
              title="Payment received"
              description="When you physically hand the item to the renter, confirm the pickup below."
            />

            <ActionButton onClick={() => ConfirmPickup(bookingId)}>
              <PackageCheck className="size-4" />
              Confirm pickup
            </ActionButton>
          </>
        )}

        {isAccepted && isRenter && isPaid && (
          <InfoMessage
            icon={<Clock className="size-5" />}
            title="Paid — awaiting pickup"
            description="Your payment is complete. The owner will confirm pickup when they hand over the item."
          />
        )}

        {isPickedUp && isOwner && (
          <>
            <InfoMessage
              icon={<PackageCheck className="size-5" />}
              title="Item picked up"
              description="The rental is underway. Confirm the return after the renter hands the item back."
            />

            <ActionButton onClick={() => ReturnedBooking(bookingId)}>
              <PackageCheck className="size-4" />
              Confirm return
            </ActionButton>
          </>
        )}

        {isPickedUp && isRenter && (
          <InfoMessage
            icon={<PackageCheck className="size-5" />}
            title="Rental in progress"
            description="The pickup is confirmed. Return the item at the agreed time."
          />
        )}

        {isReturned && (
          <InfoMessage
            icon={<Check className="size-5" />}
            title="Item returned"
            description="The return has been recorded. The booking can proceed to completion."
          />
        )}

        {status === "COMPLETED" && (
          <InfoMessage
            icon={<Check className="size-5" />}
            title="Booking completed"
            description="This rental is finished. No further booking actions are available."
          />
        )}

        {(status === "CANCELLED" ||
          status === "DECLINED" ||
          status === "NO_SHOW") && (
          <InfoMessage
            icon={<Ban className="size-5" />}
            title={
              status === "NO_SHOW"
                ? "Marked as no-show"
                : status === "DECLINED"
                  ? "Request declined"
                  : "Booking cancelled"
            }
            description="This booking is no longer active."
          />
        )}
      </div>

      {!isTerminal && (canCancel || canMarkNoShow) && (
        <>
          <div className="h-px bg-zinc-800" />

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Other actions
            </p>

            {canMarkNoShow && (
              <div className="space-y-2">
                <ActionButton variant="danger">
                  <ShieldAlert className="size-4" />
                  Mark renter as no-show
                </ActionButton>

                <p className="text-xs leading-5 text-zinc-500">
                  Only use this if the renter failed to arrive within the agreed
                  pickup window.
                </p>
              </div>
            )}

            {canCancel && (
              <ActionButton variant="danger">
                <Ban className="size-4" />
                Cancel booking
              </ActionButton>
            )}
          </div>
        </>
      )}

      {!isTerminal && !canCancel && !canMarkNoShow && (
        <p className="text-xs leading-5 text-zinc-500">
          Booking reference: {bookingId.slice(0, 8)}
        </p>
      )}
    </section>
  );
};

function InfoMessage({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="mt-0.5 shrink-0 text-fuchsia-400">{icon}</div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-100">{title}</p>
        <p className="text-sm leading-5 text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

export default BookingActions;
