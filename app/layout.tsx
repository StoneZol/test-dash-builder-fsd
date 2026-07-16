import { QueryProvider } from '@/4_shared/providers';
import { Footer } from '@/1_widgets/Footer';
import { Header } from '@/1_widgets/Header';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@styles/_global.scss';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Country Dashboard',
    description: 'Country Dashboard Builder',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" className={inter.variable}>
            <body>
                <QueryProvider>
                    <div className="root">
                        <Header />
                        <main>{children}</main>
                        <Footer />
                    </div>
                </QueryProvider>
            </body>
        </html>
    );
}
