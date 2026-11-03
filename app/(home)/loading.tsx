import { Spinner } from "@/components/ui/spinner";

const LoadingPage = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-[100px]" />

      <div
        className="relative flex flex-col items-center gap-6"
        role="status"
        aria-live="polite"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-fuchsia-500/10 blur-xl" />
          <Spinner className="relative h-14 w-14 text-fuchsia-400" />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold tracking-wide text-zinc-100">
            Getting things ready
          </h2>
          <p className="text-sm text-zinc-500">Please wait a moment...</p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
