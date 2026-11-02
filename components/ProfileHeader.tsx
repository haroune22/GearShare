import { CalendarDays, ShieldCheck } from "lucide-react";
import type { ProfileUser } from "../lib/types";
import Image from "next/image";

type Props = {
  user: ProfileUser;
  isOwner: boolean;
};

export function ProfileHeader({ user, isOwner }: Props) {
  const displayName = user.name || user.userName || "GearShare member";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-fuchsia-700/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-fuchsia-500/40 bg-zinc-800 text-2xl font-bold text-white">
          {user.image ? (
            <Image
              src={user.image}
              width={250}
              height={250}
              alt={`${user.userName}'s profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {user.name || user.userName}
            </h1>

            {isOwner && (
              <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
                Your profile
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-zinc-400">@{user.userName}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              <span>Member since {memberSince}</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-fuchsia-400" />
              <span>GearShare member</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
