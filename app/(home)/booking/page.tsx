import { auth } from "@/auth";
import BookingSideBar from "@/components/BookingSideBar";
import { redirect } from "next/navigation";
import React from "react";

const BookingPage = async ({
  searchParams,
}: {
  searchParams: { view: string };
}) => {
  const { view } = await searchParams;
  console.log(view);
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="flex gap-10 py-12 px-16 w-full">
      <BookingSideBar />
      <div>hello</div>
    </div>
  );
};

export default BookingPage;
