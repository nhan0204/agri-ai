import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface ScriptGenerationParams {
  insights: string[]
  transcriptions: string
  targetRegion: string
  contentType: string
  customPrompt?: string
}

export async function generateScript(params: ScriptGenerationParams) {
  const { insights, transcriptions, targetRegion, contentType, customPrompt } = params

  const regionContext = {
    philippines: {
      language: "Filipino-English mix (Taglish)",
      culturalNotes:
        "Use familiar Filipino greetings, reference local farming practices, include Tagalog terms naturally",
      audience: "Filipino smallholder rice farmers",
    },
    vietnam: {
      language: "Vietnamese with English agricultural terms",
      culturalNotes: "Reference Vietnamese farming traditions, use respectful tone",
      audience: "Vietnamese smallholder farmers",
    },
    thailand: {
      language: "Thai with English agricultural terms",
      culturalNotes: "Include Thai cultural elements, reference local crops like jasmine rice",
      audience: "Thai smallholder farmers",
    },
    indonesia: {
      language: "Indonesian (Bahasa Indonesia)",
      culturalNotes: "Reference Indonesian farming practices, use appropriate honorifics",
      audience: "Indonesian smallholder farmers",
    },
    malaysia: {
      language: "Malay-English mix",
      culturalNotes: "Include Malaysian farming context, use familiar local terms",
      audience: "Malaysian smallholder farmers",
    },
  }

  const context = regionContext[targetRegion as keyof typeof regionContext] || regionContext.philippines

  const systemPrompt = `You are an expert agricultural content creator specializing in TikTok videos for Southeast Asian farmers. Your goal is to create engaging, educational content that helps smallholder farmers improve their practices.

Key requirements:
- Write in ${context.language}
- Target audience: ${context.audience}
- Content type: ${contentType}
- Cultural context: ${context.culturalNotes}
- Keep it conversational and relatable
- Include practical, actionable advice
- Use a friendly, encouraging tone
- Structure for TikTok format (short, engaging, visual)
- Include call-to-action for engagement`

  const userPrompt = `Based on these key insights from existing agricultural videos:
${insights.join(", ")}

And these transcription excerpts:
${transcriptions.substring(0, 1000)}...

${customPrompt ? `Additional requirements: ${customPrompt}` : ""}

Create a new TikTok script that:
1. Combines the best elements from the source material
2. Is tailored for ${context.audience}
3. Follows ${contentType} format
4. Is engaging and educational
5. Includes practical tips farmers can immediately use

The script should be 60-90 seconds when spoken, include natural pauses, and be optimized for voiceover generation.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
    })

    // Extract key points from the generated script
    const keyPoints = extractKeyPoints(text)

    return {
      title: generateTitle(text, contentType, targetRegion),
      script: text,
      keyPoints,
      targetAudience: context.audience,
      language: context.language,
    }
  } catch (error) {
    console.error("Error generating script:", error)
    throw error
  }
}

function extractKeyPoints(script: string): string[] {
  // Simple extraction of key points - in a real implementation, this could be more sophisticated
  const sentences = script.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const keyPoints = sentences
    .filter(
      (sentence) =>
        sentence.includes("important") ||
        sentence.includes("remember") ||
        sentence.includes("tip") ||
        sentence.includes("key") ||
        sentence.includes("best") ||
        sentence.includes("effective"),
    )
    .slice(0, 4)
    .map((point) => point.trim().replace(/^(and|but|so|then)\s+/i, ""))

  // Fallback to first few meaningful sentences if no key indicators found
  if (keyPoints.length < 2) {
    return sentences
      .slice(1, 5)
      .map((s) => s.trim())
      .filter((s) => s.length > 20)
  }

  return keyPoints
}

function generateTitle(script: string, contentType: string, targetRegion: string): string {
  const topics = {
    educational: "Tutorial",
    "problem-solving": "Solution",
    "seasonal-tips": "Tips",
    "product-demo": "Guide",
  }

  const regionNames = {
    philippines: "Filipino",
    vietnam: "Vietnamese",
    thailand: "Thai",
    indonesia: "Indonesian",
    malaysia: "Malaysian",
  }

  const topicType = topics[contentType as keyof typeof topics] || "Guide"
  const regionName = regionNames[targetRegion as keyof typeof regionNames] || "Southeast Asian"

  // Extract main topic from script
  const words = script.toLowerCase().split(" ")
  let mainTopic = "Farming"

  if (words.includes("rice")) mainTopic = "Rice"
  else if (words.includes("pest") || words.includes("disease")) mainTopic = "Crop Protection"
  else if (words.includes("fertilizer")) mainTopic = "Fertilizer"
  else if (words.includes("harvest")) mainTopic = "Harvest"
  else if (words.includes("plant")) mainTopic = "Planting"

  return `Effective ${mainTopic} ${topicType} for ${regionName} Farmers`
}
