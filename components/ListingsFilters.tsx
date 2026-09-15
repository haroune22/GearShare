"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Category } from "@/lib/generated/prisma/client";
import { Button } from "./ui/button";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ListingsFilters = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleNameChange = async (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("name", e.target.value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCatChange = async (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="rounded-2xl border border-fuchsia-950/50 bg-zinc-900/50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <Input
            onChange={(e) => handleNameChange(e)}
            type="text"
            className="h-14 rounded-xl border-zinc-800 bg-zinc-950 pl-12 text-white placeholder:text-zinc-500 focus-visible:ring-[#9852f2]"
            placeholder="Search tools and equipment..."
          />
        </div>
        <div className="flex-1">
          <Select onValueChange={(value) => handleCatChange(value as string)}>
            <SelectTrigger className="py-7 w-full rounded-xl border-zinc-800 bg-zinc-950 px-4 text-white focus:ring-[#9852f2]">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5 text-[#9852f2]" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              className="border-zinc-800 bg-zinc-900 text-white"
            >
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.slug}
                    className="cursor-pointer py-3  hover:text-white focus:text-white"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button className="h-14 rounded-xl bg-[#9852f2] px-7 text-base font-semibold transition-colors hover:bg-[#9852f2]/80">
          Near me
        </Button>
      </div>
    </div>
  );
};

export default ListingsFilters;
