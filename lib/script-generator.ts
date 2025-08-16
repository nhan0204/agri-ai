import { GeneratedScript, Language, Region } from "@/types/video"


interface ScriptGenerationParams {
  insights: string[]
  transcriptions: string
  targetRegion: Region
  contentType: string
  customPrompt?: string
}


export async function generateScript(params: ScriptGenerationParams): Promise<GeneratedScript> {
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
    malaysia: {
      language: "Malay-English mix",
      culturalNotes: "Include Malaysian farming context, use familiar local terms",
      audience: "Malaysian smallholder farmers",
    },
  }

  const context = regionContext[targetRegion as keyof typeof regionContext] || regionContext.philippines

  const systemPrompt = `You are an expert agricultural content creator for TikTok. Create SHORT, cost-effective scripts for voiceover.
                        STRICT REQUIREMENTS:
                        - Maximum 30-45 seconds when spoken (150-200 words MAX)
                        - NO scene descriptions, camera directions, or brackets
                        - Direct, conversational tone in ${context.language}
                        - ONE main farming tip only
                        - Target: ${context.audience}
                        - End with simple call-to-action`

  const userPrompt = `Key insights: ${insights.slice(0, 3).join(", ")}
                      Transcription sample: ${transcriptions.substring(0, 300)}
                      ${customPrompt ? `Focus: ${customPrompt}` : ""}
                      Create a SHORT TikTok voiceover script (30-45 seconds max) that:
                      1. Teaches ONE specific farming technique
                      2. Uses simple, direct language
                      3. Includes practical steps (max 3 steps)
                      4. Ends with engagement question
                      NO scene descriptions. Pure voiceover text only.`


  const regionLanguage: Record<Region, Language> = {
    philippines: "fil",
    vietnam: "vi",
    malaysia: "ms",
  }

  const language: Language = regionLanguage[targetRegion];

  try {
    const response = await fetch("api/script/generate", {
      method: "POST",
      body: JSON.stringify({ system: systemPrompt, prompt: userPrompt, lang: language })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result || !result.data) {
      throw new Error("Api/generate-script error.")
    }

    const script = result.data;  // Access the 'text' property from generateText result

    console.log("Generated script: ", script)

    // Extract key points from the generated script
    const keyPoints = extractKeyPoints(script)

    return {
      title: generateTitle(script, contentType, targetRegion),
      script,
      keyPoints,
      targetAudience: context.audience,
      language: language,
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
