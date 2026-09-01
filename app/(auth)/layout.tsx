export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen min-w-4xl items-center justify-center overflow-hidden bg-zinc-950">
      <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-fuchsia-950/20 blur-3xl" />

      <div className="absolute bottom-1/4 right-1/3 h-80 w-80 rounded-full bg-pink-950/15 blur-3xl" />

      <div className="relative z-10 py-2">{children}</div>
    </div>
  );
}
