import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const HomeSearchBar = () => {
  return (
    <form action="/browse" method="GET" className="relative w-full">
      <Search className="absolute left-5 top-1/2 z-10 h-8 w-8 -translate-y-1/2 text-zinc-400" />

      <Input
        type="text"
        name="name"
        className="w-full max-w-[95%] rounded-full bg-zinc-800 py-9 pl-16 pr-36 text-lg ring-fuchsia-900 placeholder:text-base"
        placeholder="Search drills, saws, pressure washers..."
      />

      <Button
        type="submit"
        className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full bg-[#9852f2] px-8 py-7 text-lg font-bold hover:bg-[#8842e2]"
      >
        Search
      </Button>
    </form>
  );
};

export default HomeSearchBar;
