import { getBookingInfo } from "@/action/booking";
import { auth } from "@/auth";
import BookingDetails from "@/components/BookingDetails";
import { ListingDetails } from "@/components/ListingDetails";
import { StatusProgress } from "@/components/StatusProgress";

import { ChevronRightCircle } from "lucide-react";
import { redirect } from "next/navigation";

const BookingIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/");
  }

  const { id } = await params;
  const data = await getBookingInfo(id);

  if (!data.booking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl text-white">
        <h1>Sorry, couldn&apos;t find your Booking</h1>
      </div>
    );
  }
  return (
    <main className="min-h-screen w-full px-6 py-8 text-white md:px-12 lg:px-20">
      <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <span>Booking</span>
        <ChevronRightCircle size={15} />
        <span className="text-zinc-300">{data.booking.listing.name}</span>
      </div>
      <StatusProgress bookingStatus={data.booking.status} />
      <ListingDetails listing={data.booking.listing} />
      <BookingDetails bookingData={data.booking} />
    </main>
  );
};

export default BookingIdPage;
