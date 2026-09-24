import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Mona_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});
/** Display voice for headlines only (variable width axis). */
const mona = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mona",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Folio — AI portfolio & CV builder",
    template: "%s · Folio",
  },
  description:
    "Build a live, shareable portfolio in the Folio app. AI polishes every word and tailors your CV to any job. Public profiles live at folio.app/u/<handle>.",
  openGraph: {
    title: "Folio — AI portfolio & CV builder",
    description:
      "Build a live, shareable portfolio. AI polishes it. Tailor it to any job.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

/** Clerk only wraps once a publishable key is configured (keeps preview builds green). */
function AppProviders({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <>{children}</>;
  return <ClerkProvider afterSignOutUrl="/">{children}</ClerkProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable} ${mona.variable}`} suppressHydrationWarning>
      <head>
        {/* Progressive enhancement: reveal-on-scroll hidden states only apply once JS runs. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
