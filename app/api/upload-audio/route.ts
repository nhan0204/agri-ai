import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "da4ecwtmi",
  api_key: process.env.CLOUDINARY_API_KEY || "478799935735844",
  api_secret: process.env.CLOUDINARY_API_SECRET || "sjcGaUyjauvhKTGqQNd2O-AOUBw",
});

export async function POST(req: NextRequest) {
  try {
    console.log("Received audio upload request");

    // Parse the request to get the audio file
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;

    if (!audioFile) {
      console.error("No audio file provided in request");
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    console.log("Processing audio file of size:", audioFile.size, "type:", audioFile.type);

    // Convert Blob to Buffer for Cloudinary upload
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    console.log("Starting Cloudinary upload");
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        {
          resource_type: "video", // Audio files are treated as video in Cloudinary
          folder: "speech_audio",
          format: "mp3", // Ensure the output format is mp3
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload success:", result);
            resolve(result);
          }
        }
      ).end(buffer);
    });

    // Extract the secure URL from Cloudinary response
    const cloudinaryUrl = (uploadResult as any).secure_url;
    console.log("Cloudinary secure URL:", cloudinaryUrl);

    if (!cloudinaryUrl) {
      console.error("Failed to get Cloudinary URL for audio");
      return NextResponse.json({ error: "Failed to get Cloudinary URL" }, { status: 500 });
    }

    return NextResponse.json({ url: cloudinaryUrl }, { status: 200 });
  } catch (error) {
    console.error("Error in audio upload:", error);
    return NextResponse.json(
      { error: `Failed to upload audio: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}