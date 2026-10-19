import { getBookings } from "@/action/booking";
import { auth } from "@/auth";
import BookingDashboard from "@/components/BookingDashboard";
import Link from "next/link";
import { redirect } from "next/navigation";

const VALID_VIEWS = ["all", "renting", "request"] as const;

type BookingView = (typeof VALID_VIEWS)[number];

const BookingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { view } = await searchParams;

  if (!view || !VALID_VIEWS.includes(view as BookingView)) {
    redirect("/booking?view=all");
  }

  const data = await getBookings(view as BookingView);

  const convertedData = data?.bookings?.map((b) => {
    const { PricePerDay, totalPrice, ...bookingData } = b;
    return {
      PricePerDay: Number(PricePerDay),
      totalPrice: Number(totalPrice),
      ...bookingData,
    };
  });

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium text-fuchsia-400">
            YOUR ACTIVITY
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Manage your rentals, track booking requests, and keep up with your
            rental activity.
          </p>
        </header>

        {convertedData?.length ? (
          <BookingDashboard bookings={convertedData} view={view} />
        ) : (
          <section className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">No bookings yet</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
              Your bookings will appear here once you start renting items or
              receive requests for your listings.
            </p>

            <Link
              href="/browse"
              className="relative z-50 mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-fuchsia-500"
            >
              Explore Listings
            </Link>
          </section>
        )}
      </div>
    </main>
  );
};

export default BookingPage;
