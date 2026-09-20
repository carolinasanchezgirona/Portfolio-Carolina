import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compra completada",
  robots: { index: false, follow: false, nocache: true },
};

export default function PurchaseCompleteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
