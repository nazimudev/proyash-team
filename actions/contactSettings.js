"use server";

// src/actions/contactSettings.js
// Called by the admin page after saving, so /contact shows the new data immediately
// instead of waiting for the 5-minute cache.
// NOTE: on Next.js 16, revalidateTag needs a second argument: revalidateTag("contact-settings", "max").
import { revalidatePath, revalidateTag } from "next/cache";

export async function refreshContactPage() {
  revalidateTag("contact-settings");
  revalidatePath("/contact");
}
