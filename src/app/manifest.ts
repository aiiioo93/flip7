import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flip 7 Score",
    short_name: "Flip 7",
    description:
      "Compteur de points pour le jeu Flip 7 — classement en direct, historique des parties.",
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf9f0",
    theme_color: "#fdf9f0",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
