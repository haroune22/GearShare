"use client";

import { useRouter } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileInformation } from "./ProfileInformation";
import { ProfileListings } from "./ProfileListings";
import { ProfileReviews } from "./ProfileReviews";

import type { ProfileFormData, ProfileReview, ProfileUser } from "../lib/types";
import { updateUser } from "@/action/user";

type Props = {
  user: ProfileUser;
  isOwner: boolean;
  reviews: ProfileReview[];
};

export default function ProfileClient({ user, isOwner, reviews }: Props) {
  const router = useRouter();

  const handleSave = async (data: ProfileFormData) => {
    const result = await updateUser(user.id, data);

    if (result.status === 200) {
      router.refresh();
    }

    return result;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ProfileHeader user={user} isOwner={isOwner} />

      <ProfileInformation user={user} isOwner={isOwner} onSave={handleSave} />

      <ProfileListings listings={user.listings} isOwner={isOwner} />

      <ProfileReviews reviews={reviews} />
    </div>
  );
}
