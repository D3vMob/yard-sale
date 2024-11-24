import { ItemDetail } from "~/app/_components/ItemDetail";
import { api, HydrateClient } from "~/trpc/server";



export default async function DetailPage({ params }: { params: { idSlug: string } }) {
  
  const id = Number(params.idSlug);
  if (isNaN(id)) throw new Error("Invalid ID format");
  await api.post.getById.prefetch({ id });

  return (
    <HydrateClient>
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <ItemDetail id={id} />
      </main>
    </HydrateClient>
  );
}
