import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "./NavLinks";

const Footer = () => {
  return (
    <footer className="w-full border-t border-fuchsia-300/30 bg-zinc-950 px-8 py-10">
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-12">
        <div className="flex flex-1 flex-col gap-2">
          <Image
            src="/logo.png"
            alt="GearShare"
            width={300}
            height={150}
            className="h-20 object-cover"
          />

          <p className="max-w-sm text-sm leading-6 text-gray-400">
            Rent tools and equipment from people near you. Every job&apos;s
            tool, one app away.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <h3 className="font-semibold text-white">Explore</h3>

          <NavLinks className="flex flex-col items-start gap-4" />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <h3 className="font-semibold text-white">Information</h3>

          <nav className="flex flex-col items-start gap-2">
            <Link
              href="/about"
              className="text-sm text-gray-400 transition-colors hover:text-fuchsia-400"
            >
              About Us
            </Link>

            <Link
              href="/privacy"
              className="text-sm text-gray-400 transition-colors hover:text-fuchsia-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-sm text-gray-400 transition-colors hover:text-fuchsia-400"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/contact"
              className="text-sm text-gray-400 transition-colors hover:text-fuchsia-400"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-gray-800 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} GearShare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
