import { getCategory } from "@/action/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListCheck, Search, SlidersHorizontal } from "lucide-react";

const Browse = async () => {
  const categories = await getCategory();

  return (
    <main className="min-h-screen w-full px-4 py-10 md:px-14">
      <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Available Equipment
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Find the right tools for your next job.
          </p>
        </div>
        <Button className="w-fit cursor-pointer bg-[#9852f2] px-6 py-6 text-base font-bold transition-colors hover:bg-[#9852f2]/80">
          <ListCheck className="mr-2 h-5 w-5" />
          Create Listing
        </Button>
      </div>

      <div className="rounded-2xl border border-fuchsia-950/50 bg-zinc-900/50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

            <Input
              className="h-14 rounded-xl border-zinc-800 bg-zinc-950 pl-12 text-white placeholder:text-zinc-500 focus-visible:ring-[#9852f2]"
              placeholder="Search tools and equipment..."
            />
          </div>
          <div className="flex-1">
            <Select>
              <SelectTrigger className="py-7 w-full rounded-xl border-zinc-800 bg-zinc-950 px-4 text-white focus:ring-[#9852f2]">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="h-5 w-5 text-[#9852f2]" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-white">
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

      <div>cards</div>
    </main>
  );
};

export default Browse;
