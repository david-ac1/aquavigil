import { NextResponse } from "next/server";
import { renderDossierPdf } from "@/lib/dossiers-store";

type Params = {
  params: Promise<{ dossierId: string }>;
};

export async function GET(_: Request, context: Params) {
  const { dossierId } = await context.params;
  const content = await renderDossierPdf(dossierId);

  if (!content) {
    return NextResponse.json({ error: "Dossier not found." }, { status: 404 });
  }

  return new NextResponse(Buffer.from(content), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"${dossierId}.pdf\"`,
      "Cache-Control": "no-store",
    },
  });
}
