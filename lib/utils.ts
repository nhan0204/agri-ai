import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractDirectUrl(downloadUrl?: string): string | null {
  if (!downloadUrl) return null;
  const base64Part = downloadUrl.split("/dlUrl/")[1];
  if (!base64Part) return null;

  const decodedString = Buffer.from(base64Part, "base64").toString("utf-8");
  const decodedUrl = new URL(decodedString);
  return decodedUrl.searchParams.get("url");
}