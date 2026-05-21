import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OUTSMART — The MiMo Gauntlet",
  description: "Human vs AI intelligence arena. Four challenges, one goal: outsmart the machine.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
