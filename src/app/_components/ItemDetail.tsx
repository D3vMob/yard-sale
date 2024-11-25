"use client";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { notFound } from "next/navigation";
import { api } from "~/trpc/react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowBigLeft, X } from "lucide-react";
import { useState } from "react";
import { calculateDiscountedPrice } from "~/lib/utils";

export const ItemDetail = ({ id }: { id: number }) => {
  const [item] = api.post.getById.useSuspenseQuery({ id });
  const { user } = useUser();
  const isAdmin = user?.publicMetadata.role === "admin";
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  if (!item) {
    notFound();
  }

  return (
    <Card className="w-full border-none shadow-none md:border-gray-200 md:shadow-md">
      <CardContent className="relative p-2 md:p-6">
        <Link href="/">
          <ArrowBigLeft className="absolute right-2 top-2 h-6 w-6 fill-blue-500 text-blue-500 md:right-4 md:top-2" />
        </Link>
        {/* Image Carousel */}
        {item.imageUrl && item.imageUrl.length > 0 && (
          <div className="px-6 pb-6">
            <Carousel>
              <CarouselContent>
                {item.imageUrl.map((image, index) => (
                  <CarouselItem key={index}>
                    <div
                      className="relative h-72 cursor-pointer md:h-96"
                      onClick={() => setFullscreenIndex(index)}
                    >
                      <Image
                        src={image}
                        alt={`${item.title} - Image ${index + 1}`}
                        fill
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        {/* Fullscreen Modal */}
        {fullscreenIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <button
              onClick={() => setFullscreenIndex(null)}
              className="absolute right-4 top-4 z-50 p-2 text-white"
            >
              <X className="h-8 w-8 text-gray-500 shadow-md" />
            </button>
            <Carousel className="h-screen w-full">
              <CarouselContent>
                {item.imageUrl?.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-screen w-full">
                      <Image
                        src={image}
                        alt={`${item.title} - Image ${index + 1}`}
                        fill
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        {/* Title and Description */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="text-xl font-semibold text-primary">
            ¥{calculateDiscountedPrice(item.price).toLocaleString("ja-JP")}
          </p>
          <div className="prose max-w-none">
            {item.description && (
              <div
                className="ProseMirror px-6 py-4"
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button className="w-full" variant="default">
            販売者に連絡する
          </Button>

          {isAdmin && (
            <Button className="w-full" variant="outline" asChild>
              <Link href={`/item/${item.id}`}>編集</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemDetail;
