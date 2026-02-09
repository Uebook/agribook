// TypeScript interfaces for API responses

export interface Book {
    id: string;
    title: string;
    description: string;
    author_id: string;
    category_id: string;
    cover_image_url: string;
    price: number;
    language: string;
    status: string;
    created_at: string;
    author?: Author;
    category?: Category;
}

export interface Author {
    id: string;
    name: string;
    bio: string;
    avatar_url: string;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: string;
    created_at: string;
}

export interface AudioBook {
    id: string;
    title: string;
    description: string;
    author_id: string;
    category_id: string;
    cover_image_url: string;
    audio_url: string;
    duration: number;
    price: number;
    status: string;
    created_at: string;
}

export interface WebsiteContent {
    platform_name: string;
    support_email: string;
    logo_url?: string;
    about_description?: string;
}

export interface ApiResponse<T> {
    success?: boolean;
    data?: T;
    error?: string;
}

export interface BooksResponse {
    books: Book[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface AuthorsResponse {
    authors: Author[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CategoriesResponse {
    categories: Category[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
