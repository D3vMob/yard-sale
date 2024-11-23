"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { generateUUID, uploadS3 } from "~/lib/uploadS3";
import { CameraIcon, X } from "lucide-react";
import { env } from "~/env";
import { revalidateItem } from "~/lib/action";
import { toast } from "sonner";
import { useRef, useState } from "react";
import Image from "next/image";
import { postSchema, type PostSchema } from "~/server/schemas/post";
import { Slider } from "~/components/ui/slider";
import { Checkbox } from "~/components/ui/checkbox";

export function ItemForm() {
  const router = useRouter();
  const utils = api.useUtils();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata.role === "admin";

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const imageBaseUrl = env.NEXT_PUBLIC_AWS_BUCKET;

  const [imageArray, setImageArray] = useState<string[]>([]);

  const handleRemoveImage = (index: number) => {
    setImageArray(imageArray.filter((_, i) => i !== index));
  };
  function handlePickClick() {
    imageInputRef?.current?.click();
  }
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert file to base64 string instead of Buffer
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const uuid = await generateUUID();
      console.log(file.size, MAX_FILE_SIZE);
      if (file && file.size <= MAX_FILE_SIZE) {
        try {
          await uploadS3(base64String, uuid, file.type);
          setImageArray([...imageArray, `${imageBaseUrl}${uuid}`]);
          await user?.reload();
          //   await revalidateItem("/");
        } catch (error) {
          console.error(error);
          toast.error("Failed to upload image");
        }
      } else {
        toast.error(
          `File size is too large. Please keep file size under ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
        );
      }
    };
    reader.readAsDataURL(file);
  };
  console.log(imageArray);
  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      state: "new",
      imageUrl: [],
      priority: 5,
    },
  });

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.post.invalidate();
      router.push("/");
    },
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    form.setValue("imageUrl", imageArray);
    const postValues = {
      ...values,
      imageUrl: imageArray,
    };
    createPost.mutate(postValues);
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="pb-4 text-center text-red-500">
          You are not authorized to access this page
        </div>
        <Link href="/" className="text-blue-500 underline">
          return home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Button
        className="absolute right-16 top-[0.8rem] h-8 w-16"
        variant="outline"
        asChild
      >
        <Link href="/">home</Link>
      </Button>
      <h1 className="pb-8 text-center text-2xl font-bold">Create New Item</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-[90%] space-y-4 sm:max-w-md"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price"
                    {...field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.onChange(Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    form.setValue(
                      "state",
                      value as
                        | "new"
                        | "like_new"
                        | "used"
                        | "heavily_used"
                        | "damaged",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like_new">Like New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="heavily_used">Heavily Used</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {imageArray.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imageArray.map((image, index) => (
                <div key={index} className="relative h-[100px] w-[100px] p-8">
                  <X
                    className="absolute -right-1 -top-1 z-20 cursor-pointer rounded-full border border-gray-500 bg-white hover:bg-gray-200"
                    color="gray"
                    size={18}
                    onClick={() => handleRemoveImage(index)}
                  />
                  <Image
                    src={image}
                    alt="uploaded image"
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          )}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    form.setValue(
                      "category",
                      value as
                        | "electronics"
                        | "furniture"
                        | "appliances"
                        | "other",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="appliances">Appliances</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority (1-10)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="py-4"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sold"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Sold</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              className="cursor-pointer rounded-md border border-gray-300"
              onClick={() => handlePickClick()}
            >
              <CameraIcon className="h-6 w-6" />
            </Button>
            <Button type="submit">Create Item</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
