import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch voices from ElevenLabs")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      voices: data.voices || [],
      total: data.voices?.length || 0,
    })
  } catch (error) {
    console.error("Error fetching voices:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch voices",
        voices: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
