import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { ItemForm } from "~/app/_components/ItemForm";

export default async function ItemPage(props: {
  params: Promise<{ editSlug: string }>;
}) {
  const params = await props.params;
  return (
    <div className="container mx-auto py-10">
      <SignedIn>
        <ItemForm id={Number(params.editSlug)} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
