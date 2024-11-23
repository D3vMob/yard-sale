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
          <div className="top-0 w-full sticky bg-blue-500 h-14 text-gray-100 hover:text-gray-500">
            <div className="flex justify-end pt-4 pr-4">

            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
                
                <UserButton />
            </SignedIn>
            </div>
          </div>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
