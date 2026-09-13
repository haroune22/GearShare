import React from "react";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col gap-2 min-h-[calc(100vh-5rem)] items-center justify-center">
      <div className="flex max-w-3xl gap-4 flex-col items-center justify-center">
        <h1 className=" text-white text-8xl font-bold">
          Every job&apos;s tool,
        </h1>
        <span className="text-[#9852f2] text-7xl font-bold">
          one neighbor away.{" "}
        </span>
        <p className="text-center mt-7 max-w-xl font-medium text-zinc-500 text-xl">
          GearShare is the peer-to-peer marketplace for tools and equipment.
          Browse what&lsquo;s available near you — then grab the app to rent it.
        </p>
      </div>
      <div className="flex relative mt-8 max-w-xl w-full">
        <SearchBar />
      </div>
    </div>
  );
};

export default Hero;
