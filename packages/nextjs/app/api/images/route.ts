import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const publicDir = path.join(process.cwd(), "public", "assets");

  try {
    const files = fs.readdirSync(publicDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

    const imagePaths = imageFiles.map(file => `/assets/${file}`);
    return NextResponse.json({ images: imagePaths });
  } catch (error) {
    console.error("Error reading assets directory:", error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
