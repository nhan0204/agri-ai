import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Expanded Southeast Asian language list
const languageSchema = z.object({
  language: z.enum([
    "en", // English
    "th", // Thai
    "vi", // Vietnamese
    "ms", // Malay
    "id", // Indonesian
    "tl", // Filipino/Tagalog
    "my", // Burmese
    "km", // Khmer
    "lo", // Lao
  ]).describe("ISO 639-1 language code"),
})

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required and must be a string" }, { status: 400 })
    }

    console.log(`Detecting: "${title}"`)

    function normalizeHashtags(text: string, maxWords = 12) {
      return text
        .replace(/#(\S+)/g, "$1") // remove '#' but keep the tag word
        .split(/\s+/)
        .slice(0, maxWords)
        .join(" ")
        .trim()
    }

    const shortTitle = normalizeHashtags(title)

    console.log(`Short titles: "${shortTitle}"`)

    const result = await generateObject({
      model: openai("gpt-4.1-mini-2025-04-14"), // switched to mini
      providerOptions: {
        openai: { structuredOutputs: true },
      },
      schemaName: "languageDetection",
      schemaDescription: "Language detection for Southeast Asian languages with country name mapping",
      schema: languageSchema,
      prompt: `Text: "${shortTitle}"
        Return only one JSON object { "language": "<code>" }
        where <code> is one of: en, th, vi, ms, id, tl, my, km, lo.
        Detect language based on the text's words or any country names mentioned.
        Country → Code mapping:
        - Malaysia → ms
        - Indonesia → id
        - Vietnam → vi
        - Thailand → th
        - Myanmar/Burma → my
        - Cambodia/Kampuchea → km
        - Laos/Lao PDR → lo
        - Philippines → tl
        If none match and unsure, return "en".`,
      maxOutputTokens: 100, // extended to prevent cutoff
      temperature: 0,
    })

    return NextResponse.json(result.object)
  } catch (error) {
    console.error("Language detection error:", error)
    return NextResponse.json({ language: "en", fallback: true })
  }
}
