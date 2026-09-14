import HomeSearchBar from "./HomeSearchBar";

const Hero = () => {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] w-full flex-col items-center justify-center px-6 py-20">
      <div className="flex max-w-3xl flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-5xl font-bold text-white md:text-7xl lg:text-8xl">
          Every job&apos;s tool,
        </h1>
        <span className="text-4xl font-bold text-[#9852f2] md:text-6xl lg:text-7xl">
          one neighbor away.
        </span>
        <p className="mt-4 max-w-xl text-lg font-medium leading-7 text-zinc-500 md:text-xl">
          GearShare is the peer-to-peer marketplace for tools and equipment.
          Browse what&apos;s available near you — then grab the app to rent it.
        </p>
      </div>
      <div className="mt-8 relative flex w-full max-w-xl">
        <HomeSearchBar />
      </div>
    </section>
  );
};

export default Hero;
