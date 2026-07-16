import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/4_shared/styles/_global.scss";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Country Dashboard",
    description: "Country Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" className={`${inter.variable}`}>
            <body>{children}</body>
        </html>
    );
}
