import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { TRPCReactProvider } from "~/trpc/react";
import TopBarNav from "~/components/navigation/topBarNav";
import Link from "next/link";
import Image from "next/image";
import logo from "~/assets/logo.png";

export const metadata: Metadata = {
  title: "Yard-Sale",
  description:
    "This is a yard-sale app, where you can buy items that we are selling.",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <div className="sticky top-0 z-50 h-14 w-full bg-blue-500 shadow-md">
            <div className="flex items-center justify-between pr-4 pt-2">
              <Link
                href="/"
                className="items-baseline ps-4 text-2xl text-white"
              >
                <div className="flex items-center gap-[0.1rem]">
                  <Image
                    src={logo}
                    alt="Yard-Sale Logo"
                    width={40}
                    height={40}
                  />
                  <div className="pt-2 text-2xl">dleSimple</div>
                </div>
              </Link>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <div className="flex items-center">
                  <TopBarNav />
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
