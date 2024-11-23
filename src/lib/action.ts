"use server";
import { revalidatePath } from "next/cache";

export async function revalidateItem(path: string) {
  revalidatePath(path);
}
