import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { AppLayout } from '@/components/app-layout';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'JobTrack Pro',
  description: 'Manage and monitor your job applications with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-RP3HCNL2Y6"></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-RP3HCNL2Y6');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased h-full bg-background">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
        >
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
