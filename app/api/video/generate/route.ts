// app/api/generate-video/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { payload } = await req.json();

    if (!payload) {
      return NextResponse.json(
        { error: "Payload is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Start render request
    const startRes = await fetch("https://api.shotstack.io/stage/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.SHOTSTACK_API_KEY!,
      },
      body: JSON.stringify(payload),
    });

    if (!startRes.ok) {
      const errText = await startRes.text();
      throw new Error(`Shotstack render start failed: ${errText}`);
    }

    const startData = await startRes.json();
    const renderId = startData.response?.id;
    if (!renderId) throw new Error("No render ID returned from Shotstack");

    // 2️⃣ Poll internally until done
    let status = "queued";
    let videoUrl = null;
    const maxAttempts = 30; // ~150s max wait
    let attempts = 0;

    while (attempts < maxAttempts && status !== "done" && status !== "failed") {
      await new Promise((r) => setTimeout(r, 5000)); // wait 5s

      const statusRes = await fetch(`https://api.shotstack.io/stage/render/${renderId}`, {
        headers: {
          "x-api-key": process.env.SHOTSTACK_API_KEY!,
        },
      });

      const statusData = await statusRes.json();
      status = statusData?.response?.status;
      videoUrl = statusData?.response?.url;
      attempts++;
    }

    if (status !== "done") {
      throw new Error(`Video render failed or timed out (status: ${status})`);
    }

    // 3️⃣ Return final URL immediately
    return NextResponse.json({
      renderId,
      status: "done",
      videoUrl,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
