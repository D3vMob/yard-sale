"use client";

import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "~/trpc/react";

export const ItemDetail = ({ id }: { id: number }) => {
  const [item] = api.post.getById.useSuspenseQuery({ id });

  if (!item) {
    notFound();
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold w-full text-center">{item.title}</h1>
        <Link href="/">
          <ArrowBigLeft className="h-6 w-6 fill-current" />
        </Link>
      </div>

      {/* Replace with your actual item details */}
      <div className="space-y-4">
        <p className="text-gray-700">{item.description}</p>
        {/* Add more item details here */}
      </div>
    </div>
  );
};

export default ItemDetail;
