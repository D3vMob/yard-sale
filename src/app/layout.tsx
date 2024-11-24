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

export const metadata: Metadata = {
  title: "Yard-Sale",
  description:
    "This is a yard-sale app, where you can buy items that we are selling.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <div className="sticky top-0 z-50 h-14 w-full bg-blue-500 shadow-md">
            <div className="flex justify-between pr-4 pt-4">
              <Link href="/" className="text-2xl font-bold text-white ps-4">OodleSimple</Link>
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
