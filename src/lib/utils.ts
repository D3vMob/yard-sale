import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDiscountedPrice(price: number, sold: boolean) {
  const currentDate = new Date();
  const jan30 = new Date("2024-01-31");

  // If current date is after Jan 30
  if (currentDate > jan30 && !sold) {
    return Math.floor(price * 0.3); // 60% of original price
  } else {
    return Math.floor(price * 0.6); // 30% of original price
  }
}
