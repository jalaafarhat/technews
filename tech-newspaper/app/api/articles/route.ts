// /app/api/articles/route.ts
import { NextResponse } from "next/server";
import connectToDB from "@/app/utils/database";
import Article from "@/app/models/article";

export async function GET() {
  try {
    console.log("Attempting to connect to DB...");
    await connectToDB();
    console.log("Connected to DB, fetching articles...");

    const articles = await Article.find().sort({ createdAt: -1 });
    console.log("Found articles:", articles.length);

    return NextResponse.json(articles);
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
