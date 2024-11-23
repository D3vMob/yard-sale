"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export function ItemList() {
  const { user } = useUser();
  const [items] = api.post.getAll.useSuspenseQuery();

  const handleRemoveUnderScore = (title: string) => {
    return title.replace(/_/g, " ");
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        className="absolute right-16 top-[0.8rem] h-8 w-16"
        variant="outline"
        asChild
      >
        {user?.publicMetadata?.role === "admin" && (
          <Link href="/item">form</Link>
        )}
      </Button>
      {items.map((item) => (
        <Link key={item.id} href={`/detail/${item.id}`}>
          <Card className="relative w-96 transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground absolute right-4 top-4 rounded-md bg-gray-100 px-2 py-1 text-xs">
                {handleRemoveUnderScore(item.state ?? "")}
              </div>
              <div className="pb-2 text-sm">{item.description}</div>
              <p className="text-2xl font-bold">${item.price}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
