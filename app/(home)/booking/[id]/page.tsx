import { getBookingInfo } from "@/action/booking";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

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
  const booking = await getBookingInfo(id);
  console.log(booking);
  return <div>{id}</div>;
};

export default BookingIdPage;
