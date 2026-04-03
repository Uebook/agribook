import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/lib/api/client';
import type { Book, Author, Category } from '@/lib/api/types';

async function getData() {
  try {
    const [booksRes, authorsRes, categoriesRes, websiteRes] = await Promise.all([
      apiClient.getFeaturedBooks(6),
      apiClient.getFeaturedAuthors(4),
      apiClient.getCategories(),
      apiClient.getWebsiteContent(),
    ]);

    return {
      books: booksRes.books || [],
      authors: authorsRes.authors || [],
      categories: categoriesRes.categories || [],
      websiteContent: websiteRes,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      books: [],
      authors: [],
      categories: [],
      websiteContent: null,
    };
  }
}

export default async function Home() {
  const { books, authors, categories, websiteContent } = await getData();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-background relative py-24 overflow-hidden border-b border-gray-100 dark:border-gray-800">
        {/* Abstract background shapes - subtle primary/secondary glows */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-foreground mb-8 leading-tight">
                {websiteContent?.hero_title || 'Your Agricultural Knowledge Hub'}
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                {websiteContent?.hero_subtitle || 'Discover thousands of eBooks, audiobooks, and expert resources to transform your farming practices'}
              </p>

              <div className="flex flex-wrap gap-5 mb-16">
                <Link
                  href={websiteContent?.hero_button_1_link || '#books'}
                  className="bg-primary hover:bg-primary-vibrant text-white px-10 py-4 rounded-xl font-bold shadow-premium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  {websiteContent?.hero_button_1_text || 'Explore Library'}
                </Link>
                <Link
                  href={websiteContent?.hero_button_2_link || '#features'}
                  className="border-2 border-primary/20 text-primary px-10 py-4 rounded-xl font-bold hover:bg-primary/5 transition-all text-center"
                >
                  {websiteContent?.hero_button_2_text || 'Learn More'}
                </Link>
              </div>

              {/* Fixed Stats Layout */}
              <div className="grid grid-cols-3 gap-10 max-w-lg">
                <div className="group">
                  <div className="text-4xl font-black text-primary mb-1 group-hover:scale-110 transition-transform origin-left">
                    {websiteContent?.stat_books && websiteContent.stat_books > 0 ? `${websiteContent.stat_books}+` : (books.length > 0 ? `${books.length}+` : '500+')}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Books</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-black text-primary mb-1 group-hover:scale-110 transition-transform origin-left">
                    {websiteContent?.stat_authors && websiteContent.stat_authors > 0 ? `${websiteContent.stat_authors}+` : (authors.length > 0 ? `${authors.length}+` : '50+')}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Authors</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-black text-primary mb-1 group-hover:scale-110 transition-transform origin-left">
                    {websiteContent?.stat_readers ? `${websiteContent.stat_readers}+` : '10K+'}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Readers</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl group-hover:bg-primary/30 transition-colors opacity-50" />
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src={websiteContent?.hero_image_url || "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1000&h=750&fit=crop"}
                  alt={websiteContent?.hero_title || "Agricultural Books"}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Glass Element */}
              <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl shadow-glass hidden md:block max-w-xs transition-transform duration-500 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg text-primary">
                    <span className="text-2xl font-bold">🌾</span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Expert Guidance</div>
                    <div className="text-xs text-muted-foreground italic">Curated by top agronomists</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-background relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">{websiteContent?.categories_title || 'Explore Categories'}</h2>
            <p className="text-xl text-muted-foreground">{websiteContent?.categories_subtitle || 'Find books in your area of interest'}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.slice(0, 8).map((category: Category) => (
              <div
                key={category.id}
                className="group glass p-8 rounded-2xl hover:shadow-premium transition-all cursor-pointer transform hover:-translate-y-2 border-foreground/10"
              >
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-foreground/10 group-hover:scale-110 transition-transform">
                  {category.icon || '📚'}
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">{category.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section id="books" className="py-20 bg-muted/5 border-y border-foreground/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">{websiteContent?.books_title || 'Featured Books'}</h2>
            <p className="text-xl text-muted-foreground">{websiteContent?.books_subtitle || 'Discover our most popular agricultural books'}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {books.map((book: Book) => (
              <div key={book.id} className="group bg-background rounded-[2rem] overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-foreground/10">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={book.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-bold text-primary">
                    ₹{book.price}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-2xl text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h3>
                  <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed text-sm">{book.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-vibrant transition-all shadow-premium text-sm">
                      View Details
                    </button>
                    <span className="text-primary font-bold text-sm cursor-pointer hover:underline">Preview →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authors Section */}
      <section id="authors" className="py-20 bg-background border-t border-foreground/5 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">{websiteContent?.authors_title || 'Meet Our Authors'}</h2>
            <p className="text-xl text-muted-foreground">{websiteContent?.authors_subtitle || 'Learn from agricultural experts and industry leaders'}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {authors.map((author: Author) => (
              <div key={author.id} className="group text-center">
                <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-primary to-secondary shadow-premium group-hover:scale-105 transition-transform duration-500">
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white">
                    <Image
                      src={author.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
                      alt={author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="font-bold text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">{author.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 px-4">{author.bio}</p>
                <div className="mt-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-primary cursor-pointer hover:font-bold">Follow</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{websiteContent?.cta_title || 'Start Your Agricultural Journey Today'}</h2>
          <p className="text-xl mb-8 opacity-90">
            {websiteContent?.cta_subtitle || 'Join thousands of farmers and agricultural enthusiasts learning and growing with Agribook'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={websiteContent?.cta_button_1_link || "#books"}
              className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {websiteContent?.cta_button_1_text || 'Browse Books'}
            </Link>
            <Link
              href={websiteContent?.cta_button_2_link || "/admin"}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              {websiteContent?.cta_button_2_text || 'Admin Panel'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
