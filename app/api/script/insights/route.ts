import { NextRequest, NextResponse } from 'next/server';
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'text is required' },
        { status: 400 }
      );
    }

    console.log("Extracting insights from text: ", text)

    const result = await generateObject({
      model: openai.languageModel('gpt-4o-mini'),
      schema:  z.object({
        insights: z.array(z.string())
      }),
      system: 
        `You are a South East Asian linguist specializing in agriculture. ` +
        `one insight must has no more than 3 words ` +
        `insights must be of string array`,
      prompt: `Extract agricultural insights from the following text:\n"""${text}"""`,
    });

    const insights = result.object.insights;

    if (!insights || !Array.isArray(insights)) {
      return NextResponse.json(
        { error: 'Openai return invalid insights' },
        { status: 502 }
      );
    }

    console.log("Extracted insights: ", insights)

    return NextResponse.json({ data: insights })
  } catch (err: any) {
    console.error('Transcription failed:', err);
    return NextResponse.json(
      { error: 'Failed to transcribe audio', details: err.message },
      { status: 500 }
    );
  }
}
