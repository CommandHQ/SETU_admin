import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import ClientProvider from "@/app/ClientProvider";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SETU",
  description: "Connect. Collaborate. Grow in the veterinary community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}