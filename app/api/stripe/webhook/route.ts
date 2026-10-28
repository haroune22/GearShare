import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing webhook signature or configuration" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    // Stripe requires the original, unmodified request body.
    const rawBody = await request.text();

    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 },
    );
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      // A completed Checkout Session does not always mean funds are paid.
      if (checkoutSession.payment_status !== "paid") {
        return NextResponse.json({ received: true });
      }

      const paymentId = checkoutSession.metadata?.paymentId;
      const paymentIntentId =
        typeof checkoutSession.payment_intent === "string"
          ? checkoutSession.payment_intent
          : checkoutSession.payment_intent?.id;

      if (!paymentId || !paymentIntentId) {
        console.error(
          "Checkout Session is missing payment metadata or PaymentIntent",
        );
        return NextResponse.json(
          { error: "Missing payment information" },
          { status: 400 },
        );
      }

      // Match both IDs so an old Checkout Session cannot complete
      // a payment record that has since been linked to another session.
      const result = await prisma.payment.updateMany({
        where: {
          id: paymentId,
          stripeCheckoutSessionId: checkoutSession.id,
          status: { not: "COMPLETED" },
        },
        data: {
          status: "COMPLETED",
          stripePaymentIntentId: paymentIntentId,
        },
      });

      if (result.count === 0) {
        const existingPayment = await prisma.payment.findUnique({
          where: { id: paymentId },
          select: {
            status: true,
            stripeCheckoutSessionId: true,
            stripePaymentIntentId: true,
          },
        });

        // A repeated event for an already completed payment is safe.
        if (
          existingPayment?.status === "COMPLETED" &&
          existingPayment.stripeCheckoutSessionId === checkoutSession.id &&
          existingPayment.stripePaymentIntentId === paymentIntentId
        ) {
          return NextResponse.json({ received: true });
        }

        console.error(
          "No matching pending payment found for Checkout Session:",
          checkoutSession.id,
        );

        return NextResponse.json(
          { error: "Payment record mismatch" },
          { status: 500 },
        );
      }
    }

    // Other event types are intentionally ignored for now.
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
