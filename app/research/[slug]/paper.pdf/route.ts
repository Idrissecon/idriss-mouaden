import { servePublicationDocument } from "@/lib/serve-publication-document";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  return servePublicationDocument(request, "research", (await params).slug);
}
