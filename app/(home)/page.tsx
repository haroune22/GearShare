import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  console.log(session?.user);
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-80 items-center justify-center">
      <Button
        onClick={async () => {
          "use server";
          await signOut();
        }}
      >
        Logout
      </Button>
    </div>
  );
}
