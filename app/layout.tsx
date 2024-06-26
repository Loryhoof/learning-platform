import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learn Thai | 100 Core Thai Words",
  description: "Learn 100 Most Common Thai Words",
};

function NavBar() {
  return (
    <div className="flex flex-row justify-between p-4 border-b font-semibold">
      <div>Learn Anything</div>
      {/* <div>Login</div> */}
    </div> 
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics></Analytics>
      <body className={inter.className}>
        {/* <NavBar/> */}
        {children}
      </body>
    </html>
  );
}
