import { NextResponse } from "next/server";
import connectToDB from "@/app/utils/database";
import Article from "@/app/models/article";

export async function GET() {
  try {
    await connectToDB();
    const articles = await Article.find().sort({ createdAt: -1 });

    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": "public, s-maxage=60",
        "CDN-Cache-Control": "public, s-maxage=60",
      },
    });
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
