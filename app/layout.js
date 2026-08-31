import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "CareerPilot AI — Stop Guessing. Start Applying Smarter.",
  description:
    "CareerPilot AI helps you upload your resume, analyze it against job descriptions, discover missing skills, track applications, and prepare for interviews using AI — all in one platform.",
  keywords:
    "AI resume analysis, job matching, skill gap analysis, application tracking, AI interview prep, career platform",
  openGraph: {
    title: "CareerPilot AI — Stop Guessing. Start Applying Smarter.",
    description:
      "The AI-powered career platform that helps you land your dream job faster.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#020817] text-slate-200 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
