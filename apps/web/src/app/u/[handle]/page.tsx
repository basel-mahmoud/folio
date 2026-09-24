import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicByHandle } from "@/lib/services/portfolio";
import { PortfolioView } from "@/components/portfolio-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const bundle = await getPublicByHandle(handle.toLowerCase());
  if (!bundle) return { title: "Not found" };
  const { portfolio: p } = bundle;
  const title = `${p.name || handle} — ${p.headline || "Portfolio"}`;
  const description = p.bio || `${p.name}'s portfolio on Folio.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "profile" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicPortfolio({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const bundle = await getPublicByHandle(handle.toLowerCase());
  if (!bundle) notFound();
  return <PortfolioView bundle={bundle} handle={handle} />;
}
