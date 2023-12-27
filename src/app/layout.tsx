import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/Header/Header";
import Footer from "./footer/Footer";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "./shadcnui/components/ui/toaster";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    description: "Your #1 bike renting website!",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="logo.png" sizes="any" />
            </head>
            <body className={`${poppins.className} relative`}>
                <AuthProvider>
                    <Header />
                    <main>{children}</main>
                    <Toaster />
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
