import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function PortfolioReview({ searchParams }: { searchParams: Promise<{ page?: string; width?: string }> }) {
  if (process.env.VERCEL_ENV !== "preview") notFound();
  const query = await searchParams;
  const pages = ["/", "/about", "/research", "/writing", "/experience", "/resume", "/#contact"];
  const widths = [320, 390, 768, 1280];
  const page = pages.includes(query.page ?? "") ? query.page! : "/";
  const width = widths.includes(Number(query.width)) ? Number(query.width) : 390;
  return (
    <main style={{ padding: "24px", overflowX: "auto" }}>
      <p>Preview review · {width}px · {page}</p>
      <iframe title={`Portfolio at ${width}px`} src={page} style={{ width, height: 1050, border: "1px solid #aaa", background: "#f4efe5" }} />
    </main>
  );
}
