import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SakuTera",
    short_name: "SakuTera",
    description: "PWA pribadi SakuTera untuk flow onboarding dan dashboard.",
    start_url: "/onboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fffdfa",
    theme_color: "#fffdfa",
    icons: [
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
