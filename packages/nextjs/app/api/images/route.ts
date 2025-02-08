import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const imagesDirectory = path.join(process.cwd(), "public/assets");

  try {
    const imageFiles = fs.readdirSync(imagesDirectory);
    const images = imageFiles.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)).map(file => `/assets/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error reading images directory:", error);
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
