import { api, HydrateClient } from "~/trpc/server";
import { ItemList } from "./_components/ItemList";

export default async function Home() {
  void api.post.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="flex flex-col items-center justify-start px-4 pt-4 md:px-8 md:pt-8">
        <h1 className="mb-6 text-center text-2xl font-bold">
          ヤードセールへようこそ
        </h1>
        <ItemList />
      </main>
    </HydrateClient>
  );
}
