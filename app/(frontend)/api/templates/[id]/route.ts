import { NextResponse } from "next/server";
import {
  fetchTemplateById,
  updateTemplate,
  deleteTemplate,
} from "@/app/(frontend)/_actions/templates";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await fetchTemplateById(params.id);
    return NextResponse.json(template);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
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
    const template = await updateTemplate(params.id, {
      title: body.name,
      description: body.description,
      htmlContent: body.html,
      cssContent: body.css,
      gjsData: body.gjsData,
    });
    return NextResponse.json(template);
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
    await deleteTemplate(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
