
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { system, prompt, lang } = await req.json();

    if (!system || !prompt || !lang) {
      return NextResponse.json(
        { error: "System, prompt and Language are required" },
        { status: 400 }
      )
    }
 
    console.log("System: ", system);
    console.log("Prompt: ", prompt);

    const result = await generateText({
      model: openai.languageModel('gpt-4.1-mini'),
      system,
      prompt,
      providerOptions: { openai: { language: lang }}
    })

    if (!result.text) {
      return NextResponse.json(
        { error: "No script generated" },
        { status: 502 }
      )
    }

    console.log(result.text)

    return NextResponse.json({ data: result.text })
  } catch(error) {
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    )
  }
}