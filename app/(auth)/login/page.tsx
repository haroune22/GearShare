import { login } from "@/action/user";
import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Login = async ({ searchParams }: SearchPageProps) => {
  const error = (await searchParams).error;

  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="w-full max-w-lg rounded-xl border bg-zinc-950/80 px-6 py-10 text-white shadow-xl backdrop-blur-sm sm:px-10">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
            Login To Your Account
          </h1>
          <p className="text-sm text-zinc-400 sm:text-base">
            Welcome back to GearShare
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={async () => {
              "use server";
              await signIn("google");
            }}
            variant="outline"
            className="h-12 w-full border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
          >
            <Image
              className="mr-2"
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Continue with Google
          </Button>

          <Button
            type="button"
            onClick={async () => {
              "use server";
              await signIn("github");
            }}
            variant="outline"
            className="h-12 w-full border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
          >
            <Image
              className="mr-2"
              src="/github.svg"
              alt="GitHub"
              width={20}
              height={20}
            />
            Continue with GitHub
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs text-zinc-500">OR</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <form action={login} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="kyleCrane@gmail.com"
              required
              className="h-12 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="h-12 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500"
            />
          </div>
          <Button
            type="submit"
            className="h-12 w-full text-base font-semibold shadow-lg"
          >
            Login
          </Button>
          {error && (
            <p className="text-center text-red-500">
              Invalid email or password
            </p>
          )}
        </form>

        <p className="text-center text-xs leading-5 text-zinc-500">
          By continuing, you agree to our{" "}
          <span className="text-blue-600 hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-blue-600 hover:underline">Privacy Policy</span>
        </p>

        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
