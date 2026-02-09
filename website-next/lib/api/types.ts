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
    id?: string | null;
    logo_url?: string | null;
    logo_text?: string;
    hero_title?: string;
    hero_subtitle?: string;
    hero_image_url?: string | null;
    hero_button_1_text?: string;
    hero_button_1_link?: string;
    hero_button_2_text?: string;
    hero_button_2_link?: string;
    stat_books?: number;
    stat_authors?: number;
    stat_readers?: number;
    features_title?: string;
    features_subtitle?: string;
    features?: any[];
    categories_title?: string;
    categories_subtitle?: string;
    featured_category_ids?: string[];
    books_title?: string;
    books_subtitle?: string;
    featured_book_ids?: string[];
    authors_title?: string;
    authors_subtitle?: string;
    featured_author_ids?: string[];
    statistics?: any[];
    about_title?: string;
    about_description?: string | null;
    about_image_url?: string | null;
    about_features?: any[];
    cta_title?: string;
    cta_subtitle?: string;
    cta_button_1_text?: string;
    cta_button_1_link?: string;
    cta_button_2_text?: string;
    cta_button_2_link?: string;
    footer_description?: string;
    footer_email?: string;
    footer_phone?: string;
    footer_support_email?: string;
    footer_copyright?: string;
    navigation_links?: any[];
    footer_quick_links?: any[];
    footer_categories?: any[];
    android_app_url?: string | null;
    ios_app_url?: string | null;
    meta_title?: string;
    meta_description?: string;
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
