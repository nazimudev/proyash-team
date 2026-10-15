import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Proyash | Small Acts of Kindness. Lasting Change.",
  description:
    "Proyash is a social welfare organization in Madhupur, Tangail, Bangladesh, supporting people in need, helping students continue their education, and encouraging tree plantation.",
  openGraph: {
    title: "Proyash",
    description:
      "Supporting people in need, helping students move forward, and growing a greener future in Madhupur, Tangail.",
    type: "website",
    locale: "en_BD",
  },
};

export const viewport = {
  themeColor: "#166534",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-forest focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
          {children}
      </body>
    </html>
  );
}
