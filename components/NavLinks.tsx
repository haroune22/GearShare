"use client";

import { cn } from "@/lib/utils";
import { Home, List, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavLinks = ({ className }: { className?: string }) => {
  const navLinks = [
    {
      href: "/",
      label: "Home",
      icon: <Home />,
    },
    {
      href: "/browse",
      label: "Browse Tools",
      icon: <Wrench />,
    },
    {
      href: "/listings",
      label: "List Your Tools",
      icon: <List />,
    },
  ];
  const pathname = usePathname();

  return (
    <div className={cn("", className)}>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            href={link.href}
            key={link.label}
            className={cn(
              `flex gap-2 items-center justify-center`,
              isActive ? "text-white" : "text-gray-400",
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};
