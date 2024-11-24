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
import { ArrowBigLeft } from "lucide-react";

export const ItemDetail = ({ id }: { id: number }) => {
  
  const [item] = api.post.getById.useSuspenseQuery({ id });
  const { user } = useUser();
  const isAdmin = user?.publicMetadata.role === "admin";

  if (!item) {
    notFound();
  }


  return (
    <Card className="w-full border-none shadow-none md:border-gray-200 md:shadow-md">
      <CardContent className="relative p-2 md:p-6">
        <Link href="/">
          <ArrowBigLeft className="absolute right-2 top-2 md:right-4 md:top-2 h-6 w-6 fill-current" />
        </Link>
        {/* Image Carousel */}
        {item.imageUrl && item.imageUrl.length > 0 && (
          <div className="pb-6 px-6">
            <Carousel>
              <CarouselContent>
                {item.imageUrl.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-72 md:h-96">
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
            ¥{item.price.toLocaleString('ja-JP')}
          </p>
          <div className="prose max-w-none">
            <p>{item.description}</p>
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
}

export default ItemDetail;
