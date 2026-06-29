import type { Metadata } from "next";
import { ServiceWorkerRegistration } from "@/src/features/pwa/components/service-worker-registration";
import "../shared/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "SakuTera",
    template: "%s | SakuTera",
  },
  description: "Landing publik dan PWA shell SakuTera dipisah dari awal.",
  manifest: "/manifest.webmanifest",
  applicationName: "SakuTera",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SakuTera",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-sand font-sans text-ink">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
