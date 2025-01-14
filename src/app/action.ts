// app/actions.ts
"use server";

import { revalidateTag } from "next/cache";

export async function revalidateByTag(tag: string) {
  // Gọi revalidateTag với tag tương ứng
  revalidateTag(`${tag}`);
}
