'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Pagination from '@/components/Pagination';
import apiClient from '@/lib/api/client';

interface Purchase {
  id: string;
  user_id: string;
  book_id?: string;
  audio_book_id?: string;
  amount: number;
  purchased_at: string;
  book_type?: 'book' | 'audio_book';
  user?: {
    name: string;
    email: string;
  };
  book?: {
    title: string;
    cover_image_url: string;
    category?: {
      id: string;
      name: string;
    };
  };
  audio_book?: {
    title: string;
    cover_url: string;
    category?: {
      id: string;
      name: string;
    };
  };
  payment?: {
    payment_method: string;
    transaction_id: string;
    status: string;
  };
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBookType, setSelectedBookType] = useState<string>('all');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [pagination.page, pagination.limit, selectedCategory, selectedBookType]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (selectedBookType !== 'all') {
        params.append('bookType', selectedBookType);
      }
      
      const response = await fetch(`/api/purchases?${params.toString()}`);
      const data = await response.json();
      
      if (data.error) {
        console.error('API Error:', data.error);
        setPurchases([]);
      } else {
        setPurchases(data.purchases || []);
        if (data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: data.pagination.total || 0,
            totalPages: data.pagination.totalPages || 0,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Purchases</h2>
              <button
                onClick={fetchPurchases}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Refresh
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Type
                  </label>
                  <select
                    value={selectedBookType}
                    onChange={(e) => {
                      setSelectedBookType(e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filter changes
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="book">Books</option>
                    <option value="audio_book">Audio Books</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filter changes
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-semibold text-gray-900">{pagination.total}</span> purchases
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                          No purchases found
                        </td>
                      </tr>
                    ) : (
                      purchases.map((purchase) => {
                        const item = purchase.book || purchase.audio_book;
                        const itemType = purchase.book_type || (purchase.book ? 'book' : 'audio_book');
                        const category = purchase.book?.category || purchase.audio_book?.category;
                        
                        return (
                          <tr key={purchase.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {purchase.id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {purchase.user?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {item?.title || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                itemType === 'audio_book' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {itemType === 'audio_book' ? '🎙️ Audio' : '📚 Book'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {category?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              {formatCurrency(purchase.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {purchase.payment?.payment_method || 'UPI'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatDate(purchase.purchased_at)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {pagination.totalPages > 0 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.limit}
                    onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                    onItemsPerPageChange={(limit) => setPagination(prev => ({ ...prev, limit, page: 1 }))}
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

