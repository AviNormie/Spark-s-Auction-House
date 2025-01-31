import { ReactNode } from "react";

export default function StartupLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      {children}
    </div>
  );
}
