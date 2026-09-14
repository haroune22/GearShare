import { ShieldCheck, Wallet, Wrench } from "lucide-react";
const Why = () => {
  const data = [
    {
      label: "Tools Near You",
      description: "Find equipment from people in your area.",
      icon: Wrench,
    },
    {
      label: "Save Money",
      description: "Rent instead of buying expensive tools for one job.",
      icon: Wallet,
    },
    {
      label: "Trusted Community",
      description:
        "Rent and borrow with confidence through ratings and reviews.",
      icon: ShieldCheck,
    },
  ];
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Why <span className="text-[#9852f2]">GearShare?</span>
        </h2>
        <p className="mt-4 text-base leading-7 text-zinc-400 md:text-lg">
          Get the tools you need without buying equipment you&apos;ll only use
          once.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {data.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="group flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#9852f2]/50 hover:bg-[#9852f2]/5 hover:shadow-lg hover:shadow-[#9852f2]/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9852f2]/10 text-[#9852f2] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#9852f2]/20">
                <Icon className="h-7 w-7" strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {item.label}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default Why;
