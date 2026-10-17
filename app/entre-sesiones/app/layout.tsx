import { DM_Sans, Fraunces } from "next/font/google";

const interfaz = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--esapp-font-interfaz",
});

const editorial = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--esapp-font-editorial",
});

export default function EntreSesionesLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <div className={`${interfaz.variable} ${editorial.variable}`}>{children}</div>;
}
