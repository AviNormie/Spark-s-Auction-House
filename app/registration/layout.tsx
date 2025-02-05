import { Toaster } from "@/components/ui/toaster";
import type React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-black overflow-hidden">
        {/* Moving dots background */}
        <div className="absolute inset-0 bg-dots pointer-events-none"></div>

        {children}
        <Toaster />
      </body>
    </html>
  );
}
