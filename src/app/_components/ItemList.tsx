"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import sold from "~/assets/sold.png";
export function ItemList() {
  const [items] = api.post.getAll.useSuspenseQuery();

  const handleRemoveUnderScore = (title: string) => {
    return title.replace(/_/g, " ");
  };


 function handleTranslateStatus(status: string) {
    switch (status) {
      case "new":
        return "新品";
      case "like_new":
        return "ほぼ新品";
      case "used":
        return "中古";
      case "heavily_used":
        return "大変使用されている";
      case "damaged":
        return "傷ついている";
    }
  };
  return (
    <div className="flex flex-col gap-4">
      {items
        .sort((a, b) => b.priority - a.priority)
        .map((item) => (
        <Link key={item.id} href={`/detail/${item.id}`}>
          <Card className="relative w-96 transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="-mb-4 text-2xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {item.sold && (
                <div className="absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center">
                  <Image src={sold} alt="sold" width={200} />
                </div>
              )}
              {item.imageUrl && item.imageUrl.length > 0 && (
                <div className="relative flex h-[40px] w-full flex-wrap gap-1 mb-1">
                  {item.imageUrl.slice(0, 6).map((image, index) => (
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
                  {item.imageUrl.length > 6 && (
                    <div className="flex h-[40px] w-[40px] items-center justify-center">
                      <span className="text-sm text-gray-500">...</span>
                    </div>
                  )}
                </div>
              )}
              <div className="absolute right-4 top-4 rounded-md bg-gray-100 px-2 py-1 text-xs text-muted-foreground">
                {handleRemoveUnderScore(handleTranslateStatus(item.state) ?? "")}
              </div>
              <div className="pb-2 text-sm">
                {item.description && item.description.length > 180
                  ? `${item.description.slice(0, 180)}...`
                  : item.description}
              </div>
              <div className="flex gap-2 justify-between items-baseline px-4 border-t pt-2 -mb-3">
                <span className="text-sm text-muted-foreground">価格:</span>
                <p className="text-2xl font-bold">¥{item.price?.toLocaleString('ja-JP')}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
