import { Inter, Urbanist } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import Navbar from "@/components/navbar";
import LenisScroll from "@/components/lenis";
import Footer from "@/components/footer";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

const urbanist = Urbanist({
    variable: "--font-urbanist",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Buildify – PrebuiltUI",
        template: "%s | Buildify",
    },
    description:
        "Buildify is a modern AI agents template by PrebuiltUI. Build, launch and scale intelligent AI agents with production-ready components and workflows.",
    keywords: [
        "AI agents",
        "AI agent builder",
        "AI SaaS template",
        "PrebuiltUI",
        "Next.js AI template",
        "Tailwind CSS UI",
        "AI workflow automation",
    ],
    authors: [{ name: "PrebuiltUI" }],
    creator: "PrebuiltUI",
    applicationName: "Buildify",
    appleWebApp: {
        title: "Buildify",
        capable: true,
        statusBarStyle: "default",
    },
    openGraph: {
        title: "Buildify – Build, Launch & Scale with AI Agents",
        description:
            "A production-ready AI agents template built with PrebuiltUI. Launch faster with scalable workflows and modern UI.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Buildify – Build, Launch & Scale with AI Agents",
        description:
            "A modern AI agents template by PrebuiltUI to build, launch and scale faster.",
    },
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <LenisScroll />
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
