// app/admin/layout.tsx
import React, { ReactNode } from "react";

// This is the layout for the entire /admin section
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>; // Only renders children (i.e., content from page.tsx)
}
