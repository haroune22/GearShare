import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";

import { getUser } from "@/action/user";
import ProfileClient from "@/components/ProfileClient";

import type { ProfileReview } from "../../../../lib/types";

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  const isOwner = session.user.id === user.id;

  const reviews: ProfileReview[] = [];

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <ProfileClient user={user} isOwner={isOwner} reviews={reviews} />
    </main>
  );
};

export default ProfilePage;
