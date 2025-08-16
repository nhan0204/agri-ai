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

export function getBadgeClass(platform: string): string {
  console.log(`getBadgeClass called with platform: ${platform.toLocaleLowerCase()}`);
  switch (platform) {
    case "youtube":
      return "bg-red-700 text-white";
    case "TikTok":
      return "bg-gray-700 text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
}