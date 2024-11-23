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

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  state: z.enum(["new", "like_new", "used", "heavily_used", "damaged"]),
});

export function ItemForm() {
  const router = useRouter();
  const utils = api.useUtils();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      state: "new",
    },
  });

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      // Reset form
      form.reset();
      // Invalidate the posts query to refetch the list
      await utils.post.invalidate();
      // Redirect to home page
      router.push("/");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPost.mutate({
      ...values,
      imageUrl: [], // Empty array for now
      priority: 5, // Default priority
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-4"
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
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
                onValueChange={field.onChange}
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
        <Button 
          type="submit" 
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Creating..." : "Create Item"}
        </Button>
      </form>
    </Form>
  );
}