import Image from "next/image";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";
import { auth } from "@/auth";

const Navbar = async () => {
  const session = await auth();

  return (
    <div className="w-full flex items-center px-8 justify-between h-20 border-b border-fuchsia-200 shadow-sm shadow-fuchsia-400">
      <div className="transition-transform cursor-pointer duration-300 hover:scale-110">
        <Image
          src="/logo.png"
          alt="logo"
          className="rounded-lg object-cover"
          width={250}
          height={150}
        />
      </div>
      <div className="flex items-center justify-center gap-6">
        <NavLinks className="flex items-center justify-center gap-6" />
      </div>
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage
            src={session?.user?.image || ""}
            alt="avatar"
            className="grayscale"
          />
          <AvatarFallback>
            {session?.user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
        <Button variant="destructive">
          <LogOut className="ml-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
