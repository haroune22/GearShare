import { getCategory } from "@/action/category";
import Link from "next/link";
import {
  ArrowRight,
  Car,
  Drill,
  Dumbbell,
  Hammer,
  HardHat,
  House,
  PartyPopper,
  Shovel,
  Sparkles,
  Speaker,
  TentTree,
  Truck,
} from "lucide-react";

const Categories = async () => {
  const categoryData = await getCategory();
  // console.log(categoryData);

  const categoryIcons = {
    "power-tools": Drill,
    "hand-tools": Hammer,
    "cleaning-equipment": Sparkles,
    "gardening-landscaping": Shovel,
    "outdoor-camping": TentTree,
    automotive: Car,
    "sports-fitness": Dumbbell,
    "events-party-equipment": PartyPopper,
    "home-diy": House,
    "electronics-audio": Speaker,
    "construction-equipment": HardHat,
    "moving-transport": Truck,
  };

  return (
    <section className="flex flex-col max-w-[80vw] items-center justify-center mt-4">
      <div className="flex w-full items-center justify-between px-10">
        <h1 className="text-2xl md:text-4xl text-white font-bold">
          Browse by <span className="text-[#9852f2]">Category</span>
        </h1>
        <Link
          className="text-xl hover:bg-zinc-800 justify-center p-2 rounded-lg flex items-center gap-3 font-bold cursor-pointer"
          href="/browse"
        >
          See all tools
          <ArrowRight />
        </Link>
      </div>
      <div className="mt-10 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categoryData.map((category) => {
          const Icon =
            categoryIcons[category.slug as keyof typeof categoryIcons];
          return (
            <Link
              key={category.id}
              href={`/browse?category=${category.slug}`}
              className="group flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#9852f2]/60 hover:bg-[#9852f2]/10 hover:shadow-lg hover:shadow-[#9852f2]/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#9852f2]/10 text-[#9852f2] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#9852f2]/20">
                {Icon ? (
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                ) : (
                  <Hammer className="h-6 w-6" strokeWidth={1.8} />
                )}
              </div>
              <span className="text-sm font-semibold text-zinc-300 transition-colors group-hover:text-white">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
