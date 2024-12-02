import { NextResponse } from "next/server";
import {
  fetchPageById,
  updatePage,
  deletePage,
} from "@/app/(frontend)/_lib/api";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const page = await fetchPageById(params.id);
    return NextResponse.json(page);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const page = await updatePage(params.id, {
      title: body.name,
      description: body.description,
      htmlContent: body.html,
      cssContent: body.css,
      gjsData: body.gjsData,
    });
    return NextResponse.json(page);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deletePage(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
