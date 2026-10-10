"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Box, Download, ListChecks, SquareKanban } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const navigation = [
  {
    label: "Overview",
    href: "/booking",
    icon: SquareKanban,
    view: "all",
  },
  {
    label: "Renting",
    href: "/booking?view=renting",
    icon: Download,
    view: "renting",
  },
  {
    label: "My Listings",
    href: "/browse",
    icon: Box,
  },
  {
    label: "Requests",
    href: "/booking?view=requests",
    icon: ListChecks,
    view: "requests",
    count: 2,
  },
];

const BookingSideBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") ?? "all";

  return (
    <Card className="w-full max-w-72 gap-0 border-zinc-800 bg-zinc-900 text-zinc-100 shadow-sm">
      <CardHeader className="px-5 pb-5 pt-5">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Your Dashboard
        </CardTitle>
        <p className="text-sm text-zinc-400">
          Manage your rentals and listings
        </p>
      </CardHeader>

      <CardContent className="px-3 pb-4">
        <nav
          aria-label="Dashboard navigation"
          className="flex flex-col gap-1.5"
        >
          {navigation.map(({ label, href, icon: Icon, view, count }) => {
            const isActive = view
              ? pathname === "/booking" && currentView === view
              : pathname === "/listing" || pathname.startsWith("/listing/");

            return (
              <Link
                key={label}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 ${
                  isActive
                    ? "bg-fuchsia-500/10 text-fuchsia-300"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                }`}
              >
                <Icon className="size-4.5 shrink-0" />
                <span>{label}</span>
                {count !== undefined && (
                  <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-md bg-fuchsia-500/15 px-1.5 py-1 text-xs font-semibold text-fuchsia-300">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
};

export default BookingSideBar;
