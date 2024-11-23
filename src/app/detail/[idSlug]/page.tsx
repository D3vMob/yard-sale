import { ItemDetail } from "~/app/_components/ItemDetail";
import { api, HydrateClient } from "~/trpc/server";

interface DetailPageProps {
  params: {
    idSlug: string;
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { idSlug } = params;

  console.log(idSlug);

  void api.post.getById.prefetch({ id: Number(idSlug) });

  return (
    <HydrateClient>
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <ItemDetail id={Number(idSlug)} />
      </main>
    </HydrateClient>
  );
}
