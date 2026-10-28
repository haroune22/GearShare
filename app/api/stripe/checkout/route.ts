import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { Prisma } from "@/lib/generated/prisma/client";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const bookingId = body?.bookingId;

    if (typeof bookingId !== "string" || !bookingId.trim()) {
      return NextResponse.json(
        { error: "A valid bookingId is required" },
        { status: 400 },
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true, payment: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.renterId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (booking.status !== "ACCEPTED") {
      return NextResponse.json(
        { error: "This booking cannot be paid for" },
        { status: 409 },
      );
    }

    // Never start another checkout for an already-paid booking.
    if (booking.payment?.status === "COMPLETED") {
      return NextResponse.json(
        { error: "This booking has already been paid for" },
        { status: 409 },
      );
    }

    // Reuse an existing Checkout Session if it's still open.
    if (booking.payment?.stripeCheckoutSessionId) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        booking.payment.stripeCheckoutSessionId,
      );

      if (existingSession.status === "open" && existingSession.url) {
        return NextResponse.json({ url: existingSession.url });
      }

      if (existingSession.status === "complete") {
        return NextResponse.json(
          {
            error:
              "This checkout has completed or is processing. Please wait for payment confirmation.",
          },
          { status: 409 },
        );
      }
    }

    const amount = new Prisma.Decimal(booking.totalPrice);

    if (!amount.isFinite() || amount.lte(0)) {
      return NextResponse.json(
        { error: "Invalid booking amount" },
        { status: 400 },
      );
    }

    const amountInCents = amount.mul(100);

    if (!amountInCents.isInteger()) {
      return NextResponse.json(
        { error: "Invalid payment precision" },
        { status: 400 },
      );
    }

    const unitAmount = amountInCents.toNumber();

    if (!Number.isSafeInteger(unitAmount)) {
      return NextResponse.json(
        { error: "Payment amount is too large" },
        { status: 400 },
      );
    }

    // Create the payment record if this booking doesn't have one yet.
    const payment = await prisma.payment.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        status: "PENDING",
        paymentMethod: "stripe",
      },
      update: {},
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.listing.name,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        paymentId: payment.id,
      },
      payment_intent_data: {
        metadata: {
          bookingId: booking.id,
          paymentId: payment.id,
        },
      },
      success_url:
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/success` +
        "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Unable to create Checkout URL" },
        { status: 500 },
      );
    }

    // Link the Stripe session to the existing Payment record.
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripeCheckoutSessionId: checkoutSession.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe Checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 },
    );
  }
}
