import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <>
      <Search className="h-12 w-12 absolute left-3 top-3.5" />
      <Input
        className="bg-zinc-800 placeholder:text-xl placeholder:pl-12 ring-fuchsia-900 py-9 rounded-full px-4"
        placeholder="Search drills, saws, pressure washers...."
      />
      <Button className="absolute bottom-2 right-2 text-lg  font-bold rounded-full bg-[#9852f2]  px-8 py-7">
        Search
      </Button>
    </>
  );
};

export default SearchBar;
