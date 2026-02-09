import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/lib/api/client';
import type { Book, Author, Category } from '@/lib/api/types';

async function getData() {
  try {
    const [booksRes, authorsRes, categoriesRes] = await Promise.all([
      apiClient.getFeaturedBooks(6),
      apiClient.getFeaturedAuthors(4),
      apiClient.getCategories(),
    ]);

    return {
      books: booksRes.books || [],
      authors: authorsRes.authors || [],
      categories: categoriesRes.categories || [],
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      books: [],
      authors: [],
      categories: [],
    };
  }
}

export default async function Home() {
  const { books, authors, categories } = await getData();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Your Agricultural Knowledge Hub
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover thousands of eBooks, audiobooks, and expert resources to transform your farming practices
              </p>
              <div className="flex gap-4">
                <Link
                  href="#books"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Explore Books
                </Link>
                <Link
                  href="#features"
                  className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl font-bold text-green-600">{books.length > 0 ? '500+' : '0'}</div>
                  <div className="text-gray-600 mt-1">Books</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600">{authors.length > 0 ? '50+' : '0'}</div>
                  <div className="text-gray-600 mt-1">Authors</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600">10K+</div>
                  <div className="text-gray-600 mt-1">Readers</div>
                </div>
              </div>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop"
                alt="Agricultural Books"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-xl text-gray-600">Find books in your area of interest</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category: Category) => (
              <div
                key={category.id}
                className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-3">{category.icon || '📚'}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section id="books" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Books</h2>
            <p className="text-xl text-gray-600">Discover our most popular agricultural books</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book: Book) => (
              <div key={book.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={book.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">₹{book.price}</span>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authors Section */}
      <section id="authors" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Authors</h2>
            <p className="text-xl text-gray-600">Learn from agricultural experts and industry leaders</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {authors.map((author: Author) => (
              <div key={author.id} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={author.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{author.name}</h3>
                <p className="text-gray-600 line-clamp-3">{author.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Start Your Agricultural Journey Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers and agricultural enthusiasts learning and growing with Agribook
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="#books"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Books
            </Link>
            <Link
              href="/admin"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
