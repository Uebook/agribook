import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agribook - Your Agricultural Knowledge Hub",
  description: "Discover thousands of agricultural eBooks, audiobooks, and resources. Learn from experts and grow your farming knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-2xl font-bold text-green-600">
                Agribook
              </Link>

              <div className="hidden md:flex items-center space-x-8">
                <Link href="/#categories" className="text-gray-700 hover:text-green-600 transition-colors">
                  Categories
                </Link>
                <Link href="/#books" className="text-gray-700 hover:text-green-600 transition-colors">
                  Books
                </Link>
                <Link href="/#authors" className="text-gray-700 hover:text-green-600 transition-colors">
                  Authors
                </Link>
                <Link href="/admin" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Agribook</h3>
                <p className="text-gray-400">Your trusted partner in agricultural knowledge and growth.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/#categories" className="hover:text-white transition-colors">Categories</Link></li>
                  <li><Link href="/#books" className="hover:text-white transition-colors">Books</Link></li>
                  <li><Link href="/#authors" className="hover:text-white transition-colors">Authors</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/#categories" className="hover:text-white transition-colors">Crop Management</Link></li>
                  <li><Link href="/#categories" className="hover:text-white transition-colors">Livestock</Link></li>
                  <li><Link href="/#categories" className="hover:text-white transition-colors">Organic Farming</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Email: support@agribook.com</li>
                  <li>Phone: +91 1234567890</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Agribook. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
