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


export const metadata: Metadata = {
  title: "Yard-Sale",
  description: "This is a yard-sale app, where you can buy items that we are selling.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <div className="top-0 w-full sticky bg-blue-500 h-14 z-50 shadow-md">
            <div className="flex justify-end pt-4 pr-4">

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
