import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Loaded as a variable font (no fixed `weight`) so the hero can drive `wght`
 * 100→900 and `wdth` per character under the cursor.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mithileshoff.vercel.app"),
  title: "Mithilesh KS — Developer & Designer",
  description:
    "Full stack developer and designer based in Chennai, India. Building practical products with Next.js, React, Python and FastAPI.",
  openGraph: {
    title: "Mithilesh KS — Developer & Designer",
    description: "Full stack developer and designer based in Chennai, India.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="bg-void text-chalk min-h-full">{children}</body>
    </html>
  );
}
