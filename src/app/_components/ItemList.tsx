"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import sold from "~/assets/sold.png";
import { calculateDiscountedPrice } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export function ItemList() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata.role === "admin";
  const [items] = api.post.getAll.useSuspenseQuery();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...new Set(items.map((item) => item.category))];

  const filteredItems = items.filter((item) =>
    selectedCategory === "all" ? true : item.category === selectedCategory,
  );

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
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="w-96 mx-auto">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="カテゴリーを選択" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all"
                  ? "すべて"
                  : category === "electronics"
                    ? "電化製品"
                    : category === "furniture"
                      ? "家具"
                      : category === "appliances"
                        ? "電気製品"
                        : category === "other"
                          ? "その他"
                          : handleRemoveUnderScore(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">   
        {filteredItems
          .sort((a, b) => b.priority - a.priority)
          .map((item) => {
          // Skip items with priority 1 for non-admin users
          if (item.priority === 1 && !isAdmin) return null;
          
          return (
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
                    <div className="relative mb-1 flex h-[40px] w-full flex-wrap gap-1">
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
                  <div className="absolute right-1 top-1 rounded-md bg-blue-500 px-2 py-0.5 text-xs text-white">
                    {handleRemoveUnderScore(
                      handleTranslateStatus(item.state) ?? "",
                    )}
                  </div>
                  <div className="pb-2 text-sm max-h-32 overflow-hidden">
                    {item.description && (
                      <div
                        className="ProseMirror px-6 py-4"
                        style={{ whiteSpace: "pre-line" }}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}
                  </div>
                  <div className="flex items-baseline justify-between gap-2 border-t px-4 pt-2">
                    <span className="text-sm text-muted-foreground">価格:</span>
                    <p className="text-2xl font-bold">
                      ¥
                      {calculateDiscountedPrice(item.price).toLocaleString(
                        "ja-JP",
                      )}
                    </p>
                  </div>
                  <div className="-mb-3 -mt-1 flex items-baseline justify-center gap-2 px-4 pt-2">
                    <span className="text-xs text-muted-foreground">
                      小売価格:
                    </span>
                    <p className="text-xs text-gray-500">
                      ¥{item.price.toLocaleString("ja-JP")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
