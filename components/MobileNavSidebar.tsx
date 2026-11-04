"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { NavLinks } from "./NavLinks";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

export const MobileNavSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer swipeDirection="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            className="size-10 text-zinc-100 hover:bg-zinc-800 hover:text-fuchsia-400 md:hidden"
          />
        }
      >
        <Menu className="size-6" />
      </DrawerTrigger>

      <DrawerContent className="fixed inset-y-0 left-0 right-auto z-50 mt-0 flex h-full w-75 max-w-[85vw] flex-col rounded-none border-y-0 border-l-0 border-r border-zinc-800 bg-zinc-950 p-0 text-zinc-100">
        <DrawerHeader className="flex flex-row items-center justify-between border-b border-zinc-800 px-5 py-5">
          <DrawerTitle className="sr-only">GearShare navigation</DrawerTitle>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="GearShare home"
            className="transition-transform duration-200 hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="GearShare"
              width={200}
              height={130}
              priority
              className="h-auto w-42.5 rounded-lg object-cover"
            />
          </Link>

          <DrawerClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close navigation menu"
                className="shrink-0 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              />
            }
          >
            <X className="size-5" />
          </DrawerClose>
        </DrawerHeader>
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-4 py-6"
          onClick={() => setOpen(false)}
        >
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Navigation
          </p>
          <NavLinks className="flex flex-col items-stretch gap-2 [&_a]:flex [&_a]:w-full [&_a]:items-center [&_a]:rounded-xl [&_a]:px-4 [&_a]:py-3 [&_a]:text-base [&_a]:font-medium [&_a]:text-zinc-300 [&_a]:transition-colors [&_a:hover]:bg-fuchsia-500/10 [&_a:hover]:text-fuchsia-300 [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-fuchsia-400" />
        </nav>

        <div className="border-t border-zinc-800 px-6 py-5">
          <p className="text-sm font-medium text-zinc-300">
            Share more. Buy less.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Find the tools you need, nearby.
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
