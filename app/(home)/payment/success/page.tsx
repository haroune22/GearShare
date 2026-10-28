import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type PageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

type PaymentResultState = "success" | "pending" | "error";

type PaymentResultData = {
  state: PaymentResultState;
  title: string;
  description: string;
  bookingId?: string;
};

function PaymentResult({
  state,
  title,
  description,
  bookingId,
}: PaymentResultData) {
  const styles = {
    success: {
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-400/10",
    },
    pending: {
      icon: Clock3,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-400/10",
    },
    error: {
      icon: XCircle,
      iconColor: "text-red-400",
      iconBg: "bg-red-400/10",
    },
  }[state];

  const Icon = styles.icon;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/80 p-8 text-center shadow-2xl">
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${styles.iconBg}`}
        >
          <Icon className={`h-9 w-9 ${styles.iconColor}`} />
        </div>

        <p className="mb-3 text-sm font-medium tracking-widest text-zinc-400">
          GEARSHARE · PAYMENTS
        </p>

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>

        {state === "success" && (
          <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-left">
            <p className="font-medium text-emerald-300">Paid successfully</p>
            <p className="mt-1 text-sm text-zinc-400">
              Your booking is awaiting pickup. Coordinate the handoff with the
              owner through your booking details.
            </p>
          </div>
        )}

        {state === "pending" && (
          <p className="mt-5 text-sm text-amber-300">
            Your payment may take a moment to appear. Refresh this page shortly
            to check again.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {bookingId && (
            <Link
              href={`/booking/${bookingId}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              View booking
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          <Link
            href="/"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
          >
            Back to GearShare
          </Link>
        </div>
      </div>
    </main>
  );
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <PaymentResult
        state="error"
        title="Missing payment session"
        description="We couldn't identify this payment. Please open the confirmation link from your checkout."
      />
    );
  }

  let result: PaymentResultData;

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status !== "paid") {
      result = {
        state: "pending",
        title: "Payment not confirmed yet",
        description:
          "Stripe has not confirmed this payment as paid. Please wait a moment before checking again.",
      };
    } else {
      const paymentId = checkoutSession.metadata?.paymentId;

      if (!paymentId) {
        result = {
          state: "error",
          title: "Payment record not found",
          description:
            "We couldn't match this checkout to a GearShare payment record. Please contact support before attempting to pay again.",
        };
      } else {
        const payment = await prisma.payment.findFirst({
          where: {
            id: paymentId,
            stripeCheckoutSessionId: checkoutSession.id,
          },
          select: {
            status: true,
            booking: {
              select: {
                id: true,
              },
            },
          },
        });

        if (!payment) {
          result = {
            state: "error",
            title: "Payment record not found",
            description:
              "The checkout couldn't be matched to your booking. Please contact support if you were charged.",
          };
        } else if (payment.status !== "COMPLETED") {
          result = {
            state: "pending",
            title: "Confirming your payment",
            description:
              "Stripe confirms that your payment was received, but GearShare is still waiting for its payment record to update.",
            bookingId: payment.booking.id,
          };
        } else {
          result = {
            state: "success",
            title: "Payment successful!",
            description:
              "Your payment has been verified. You're all set for the next step of your rental.",
            bookingId: payment.booking.id,
          };
        }
      }
    }
  } catch (error) {
    console.error("Payment success page verification failed:", error);

    result = {
      state: "error",
      title: "Couldn't verify your payment",
      description:
        "We couldn't verify this checkout right now. If you were charged, check your booking before trying to pay again.",
    };
  }

  return <PaymentResult {...result} />;
}
