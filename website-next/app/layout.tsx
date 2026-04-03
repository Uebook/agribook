import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/api/client";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  try {
    const websiteContent = await apiClient.getWebsiteContent();
    return {
      title: websiteContent?.meta_title || "Agribook - Your Agricultural Knowledge Hub",
      description: websiteContent?.meta_description || "Discover thousands of agricultural eBooks, audiobooks, and resources.",
    };
  } catch (error) {
    return {
      title: "Agribook - Your Agricultural Knowledge Hub",
      description: "Discover thousands of agricultural eBooks, audiobooks, and resources.",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let websiteContent = null;
  try {
    websiteContent = await apiClient.getWebsiteContent();
  } catch (error) {
    console.error("Failed to fetch website content for layout:", error);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="glass sticky top-0 z-50 border-b border-foreground/5 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="text-3xl font-black text-primary flex items-center gap-3 hover:scale-105 transition-transform">
                {websiteContent?.logo_url && (
                  <div className="w-10 h-10 relative">
                    <Image src={websiteContent.logo_url} alt="Logo" fill className="object-contain" />
                  </div>
                )}
                <span className="tracking-tight">{websiteContent?.logo_text || 'Agribook'}</span>
              </Link>

              <div className="hidden md:flex items-center space-x-10">
                <Link href="/#categories" className="text-sm font-bold text-muted-foreground hover:text-primary transition-all">
                  Categories
                </Link>
                <Link href="/#books" className="text-sm font-bold text-muted-foreground hover:text-primary transition-all">
                  Books
                </Link>
                <Link href="/#authors" className="text-sm font-bold text-muted-foreground hover:text-primary transition-all">
                  Authors
                </Link>
                <Link href="/admin" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-vibrant transition-all shadow-premium text-sm">
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className="bg-gray-950 text-white pt-24 pb-12 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-4 gap-16 mb-20">
              <div className="col-span-1 md:col-span-1">
                <h3 className="text-3xl font-black mb-6 text-white tracking-tight">{websiteContent?.logo_text || 'Agribook'}</h3>
                <p className="text-muted-foreground/80 leading-relaxed mb-8">
                  {websiteContent?.footer_description || 'Your trusted partner in agricultural knowledge and growth. Empowering farmers globally.'}
                </p>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer border border-white/10">
                    <span className="text-xl">🐦</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer border border-white/10">
                    <span className="text-xl">📘</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer border border-white/10">
                    <span className="text-xl">📸</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Explore</h4>
                <ul className="space-y-4 text-muted-foreground/80 font-medium">
                  <li><Link href="/#categories" className="hover:text-primary transition-all inline-block hover:translate-x-1">Categories</Link></li>
                  <li><Link href="/#books" className="hover:text-primary transition-all inline-block hover:translate-x-1">Books</Link></li>
                  <li><Link href="/#authors" className="hover:text-primary transition-all inline-block hover:translate-x-1">Authors</Link></li>
                  <li><Link href="/#features" className="hover:text-primary transition-all inline-block hover:translate-x-1">Features</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Categories</h4>
                <ul className="space-y-4 text-muted-foreground/80 font-medium">
                  <li className="hover:text-primary transition-all inline-block hover:translate-x-1 cursor-pointer">Crop Management</li>
                  <li className="hover:text-primary transition-all inline-block hover:translate-x-1 cursor-pointer">Livestock</li>
                  <li className="hover:text-primary transition-all inline-block hover:translate-x-1 cursor-pointer">Organic Farming</li>
                  <li className="hover:text-primary transition-all inline-block hover:translate-x-1 cursor-pointer">Smart Technology</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Reach Us</h4>
                <ul className="space-y-6 text-muted-foreground/80">
                  <li className="flex items-start gap-4">
                    <span className="text-primary mt-1">✉️</span>
                    <div>
                      <div className="text-white text-sm font-bold mb-1">Email Us</div>
                      <div className="text-sm">{websiteContent?.footer_email || 'support@agribook.com'}</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-primary mt-1">📞</span>
                    <div>
                      <div className="text-white text-sm font-bold mb-1">Call Us</div>
                      <div className="text-sm">{websiteContent?.footer_phone || '+91 1234567890'}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-muted-foreground/60 text-sm font-medium">
                {websiteContent?.footer_copyright || `© ${new Date().getFullYear()} Agribook. All rights reserved.`}
              </p>
              <div className="flex gap-8 text-sm font-medium text-muted-foreground/60">
                <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
