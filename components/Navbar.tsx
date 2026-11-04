import Image from "next/image";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MobileNavSidebar } from "./MobileNavSidebar";

const Navbar = async () => {
  const session = await auth();

  return (
    <div className="w-full flex items-center px-8 justify-between h-20 border-b border-fuchsia-300/30 ">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="md:hidden">
          <MobileNavSidebar />
        </div>

        <Link
          href="/"
          className="shrink-0 hidden lg:flex cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/logo.png"
            alt="GearShare logo"
            width={230}
            height={150}
            priority
            className="h-auto w-35 rounded-lg object-cover sm:w-45 md:w-57.5"
          />
        </Link>
      </div>
      <div className="hidden md:flex items-center justify-center gap-6">
        <NavLinks className="flex items-center justify-center gap-6" />
      </div>
      <div className="flex items-center gap-4">
        {session?.user && (
          <Link href={`/profile/${session.user.id}`}>
            <Avatar>
              <AvatarImage src={session?.user?.image || ""} alt="avatar" />
              <AvatarFallback>
                {session?.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
          </Link>
        )}
        {session?.user ? (
          <Button
            className="py-6 px-5 flex items-center justify-center"
            onClick={async () => {
              "use server";
              await signOut();
            }}
            variant="destructive"
          >
            <LogOut className="ml-4" />
            Logout
          </Button>
        ) : (
          <Button
            onClick={redirect("/login")}
            className="py-6 px-4"
            variant="default"
          >
            <LogIn className="ml-4" />
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
