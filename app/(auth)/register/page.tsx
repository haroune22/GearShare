import { register } from "@/action/user";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type RegisterProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const Register = async ({ searchParams }: RegisterProps) => {
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
            Create Your Account
          </h1>
          <p className="text-sm text-zinc-400 sm:text-base">
            Join thousands of tool renters today
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            type="button"
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
        <form action={register} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Kyle Crane"
              className="h-12 w-full border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              className="h-12 w-full border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
              placeholder="kylecrane@gmail.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="h-12 w-full border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
              required
            />
          </div>
          <Button type="submit" size={"lg"}>
            Create Account
          </Button>

          {error === "user_exists" && (
            <p className="text-center text-sm text-red-400">
              An account with this email already exists.
            </p>
          )}
        </form>

        <p className="text-center text-xs leading-5 text-zinc-500">
          By creating an account, you agree to our
          <span className="text-zinc-300 hover:underline">
            Terms of Service
          </span>
          and
          <span className="text-zinc-300 hover:underline">Privacy Policy</span>
        </p>
        <p className="text-center text-sm text-zinc-400">
          Already have an account?
          <Link
            href="/login"
            className="font-medium text-white hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
