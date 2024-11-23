import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { ItemForm } from "~/app/_components/ItemForm";

export default function ItemPage() {
  return (
    <div className="container mx-auto py-10">
      <SignedIn>
        <ItemForm />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
