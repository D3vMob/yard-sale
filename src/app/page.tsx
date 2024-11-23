
import { api, HydrateClient } from "~/trpc/server";
import { ItemList } from "./_components/ItemList";

export default async function Home() {

  void api.post.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="flex flex-col items-center justify-start pt-4 md:pt-8 px-4 md:px-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to the Yard-Sale</h1>
        <ItemList />
      </main>
    </HydrateClient>
  );
}
