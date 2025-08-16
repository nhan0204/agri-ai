import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const renderId = searchParams.get("renderId");

    if (!renderId) {
      return NextResponse.json(
        { error: "Missing renderId parameter" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.shotstack.io/edit/stage/render/${renderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.SHOTSTACK_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Shotstack API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
