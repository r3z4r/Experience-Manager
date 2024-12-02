import { NextResponse } from "next/server";
import { fetchPages, createPage } from "@/app/(frontend)/_lib/api";
import { defaultTemplate } from "./default/route";

export async function GET() {
  try {
    const pages = await fetchPages();
    return NextResponse.json(pages);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const page = await createPage({
      title: body.name || "New Page",
      description: body.description,
      htmlContent: body.html || defaultTemplate.html,
      cssContent: body.css || defaultTemplate.css,
      gjsData: body.gjsData,
    });
    return NextResponse.json(page);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
