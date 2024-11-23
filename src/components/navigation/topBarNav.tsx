"use client";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";

export default function TopBarNav() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <>
      {pathname === "/" && (
        <Button
          className="absolute right-16 top-[0.8rem] h-8 w-16"
          variant="outline"
          asChild
        >
          {user?.publicMetadata?.role === "admin" && (
            <Link href="/item">form</Link>
          )}
        </Button>
      )}
      {pathname === "/item" && (
        <Button
          className="absolute right-16 top-[0.8rem] h-8 w-16"
          variant="outline"
          asChild
        >
          <Link href="/">Home</Link>
        </Button>
      )}
    </>
  );
}
