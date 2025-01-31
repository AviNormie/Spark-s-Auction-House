// app/admin/auction/layout.tsx
import React, { ReactNode } from "react";

// This layout is specific to the /admin/auction section
export default function AuctionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>; // Only renders children (i.e., content from page.tsx)
}
