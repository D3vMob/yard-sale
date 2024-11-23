"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import sold from "~/assets/sold.png";
export function ItemList() {
  const { user } = useUser();
  const [items] = api.post.getAll.useSuspenseQuery();

  const handleRemoveUnderScore = (title: string) => {
    return title.replace(/_/g, " ");
  };
  items.forEach((item) => {
    console.log(item);
  });
  return (
    <div className="flex flex-col gap-4">
      
      {items.map((item) => (
        <Link key={item.id} href={`/detail/${item.id}`}>
          <Card className="relative w-96 transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="-mb-4 text-2xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {item.sold && (
                <div className="absolute left-0 top-0 h-full z-30 w-full flex justify-center items-center">
                  <Image src={sold} alt="sold" width={200} />
                </div>
              )}
              {item.imageUrl && item.imageUrl.length > 0 && (
                <div className="relative flex h-[40px] w-full flex-wrap gap-2">
                  {item.imageUrl.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-[40px] w-[40px] rounded-md border border-gray-300"
                    >
                      <Image
                        key={index}
                        src={image}
                        alt="item image"
                        fill
                        className="object-cover"
                        sizes="25px"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="absolute right-4 top-4 rounded-md bg-gray-100 px-2 py-1 text-xs text-muted-foreground">
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
