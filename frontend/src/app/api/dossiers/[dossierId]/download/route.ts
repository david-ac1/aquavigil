import { NextResponse } from "next/server";
import { renderDossierText } from "@/lib/dossiers-store";

type Params = {
  params: Promise<{ dossierId: string }>;
};

export async function GET(_: Request, context: Params) {
  const { dossierId } = await context.params;
  const content = renderDossierText(dossierId);

  if (!content) {
    return NextResponse.json({ error: "Dossier not found." }, { status: 404 });
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename=\"${dossierId}.txt\"`,
      "Cache-Control": "no-store",
    },
  });
}
