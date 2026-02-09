/**
 * API Client for Website
 * Fetches data from the admin panel APIs
 */

import type {
    BooksResponse,
    AuthorsResponse,
    CategoriesResponse,
    WebsiteContent,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/admin';

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Request failed' }));
                throw new Error(error.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // Get featured books
    async getFeaturedBooks(limit: number = 6) {
        return this.request<BooksResponse>(`/api/books?status=active&limit=${limit}`);
    }

    // Get all books with pagination
    async getBooks(page: number = 1, limit: number = 12) {
        return this.request<BooksResponse>(`/api/books?page=${page}&limit=${limit}&status=active`);
    }

    // Get books by category
    async getBooksByCategory(categoryId: string, page: number = 1, limit: number = 12) {
        return this.request<BooksResponse>(
            `/api/books?category=${categoryId}&page=${page}&limit=${limit}&status=active`
        );
    }

    // Get all categories
    async getCategories() {
        return this.request<CategoriesResponse>('/api/categories');
    }

    // Get featured authors
    async getFeaturedAuthors(limit: number = 4) {
        return this.request<AuthorsResponse>(`/api/authors?limit=${limit}`);
    }

    // Get all authors
    async getAuthors(page: number = 1, limit: number = 12) {
        return this.request<AuthorsResponse>(`/api/authors?page=${page}&limit=${limit}`);
    }

    // Get website content/settings
    async getWebsiteContent() {
        return this.request<WebsiteContent>('/api/website-content');
    }
}

export const apiClient = new ApiClient();
export default apiClient;
