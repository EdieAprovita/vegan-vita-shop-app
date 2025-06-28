import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vegan Vita Shop",
  description: "Tienda vegana online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
