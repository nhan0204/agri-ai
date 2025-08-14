import { NextResponse, NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    const response = await fetch("https://api.shotstack.io/edit/stage/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.SHOTSTACK_API_KEY!,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Render ID:", data);

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}
