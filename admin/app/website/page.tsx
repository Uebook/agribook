'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface WebsiteContent {
  id?: string;
  logo_url?: string;
  logo_text?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
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
  about_description?: string;
  about_image_url?: string;
  about_features?: string[];
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
  android_app_url?: string;
  ios_app_url?: string;
  meta_title?: string;
  meta_description?: string;
  navigation_links?: Array<{ label: string; href: string }>;
  footer_quick_links?: Array<{ label: string; href: string }>;
  footer_categories?: Array<{ label: string; href: string }>;
}

interface Book {
  id: string;
  title: string;
  cover_image_url?: string;
}

interface Author {
  id: string;
  name: string;
  avatar_url?: string;
}

export default function WebsitePage() {
  const [content, setContent] = useState<WebsiteContent>({});
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [authorSearchTerm, setAuthorSearchTerm] = useState('');
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showAuthorSelector, setShowAuthorSelector] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [featureImageFiles, setFeatureImageFiles] = useState<{ [key: number]: File }>({});
  const [featureImagePreviews, setFeatureImagePreviews] = useState<{ [key: number]: string }>({});
  const [uploadingFeatures, setUploadingFeatures] = useState<{ [key: number]: boolean }>({});
  const [statImageFiles, setStatImageFiles] = useState<{ [key: number]: File }>({});
  const [statImagePreviews, setStatImagePreviews] = useState<{ [key: number]: string }>({});
  const [uploadingStats, setUploadingStats] = useState<{ [key: number]: boolean }>({});
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState<string | null>(null);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const API_BASE_URL = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL || window.location.origin)
    : '';

  useEffect(() => {
    fetchContent();
    fetchBooks();
    fetchAuthors();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories?limit=1000`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/website-content`);
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
    } catch (error: any) {
      console.error('Error fetching content:', error);
      setMessage({ type: 'error', text: 'Failed to load website content' });
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/books?status=all&limit=1000`);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/authors?limit=1000`);
      if (!response.ok) throw new Error('Failed to fetch authors');
      const data = await response.json();
      setAuthors(data.authors || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleInputChange = (field: keyof WebsiteContent, value: any) => {
    setContent({ ...content, [field]: value });
  };

  const handleArrayChange = (field: 'featured_book_ids' | 'featured_author_ids' | 'features' | 'statistics' | 'about_features' | 'navigation_links' | 'footer_quick_links' | 'footer_categories', value: any[]) => {
    setContent({ ...content, [field]: value });
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append('file', logoFile);
      formData.append('bucket', 'books');
      formData.append('folder', 'website/logo');
      formData.append('fileName', logoFile.name);
      formData.append('fileType', logoFile.type || 'image/png');

      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload logo');
      }

      const uploadResult = await uploadResponse.json();
      const logoUrl = uploadResult.url || uploadResult.publicUrl || uploadResult.path;
      
      if (!logoUrl) {
        throw new Error('Upload succeeded but no URL returned');
      }

      return logoUrl;
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      throw error;
    } finally {
      setUploadingLogo(false);
    }
  };

  const uploadFeatureImage = async (file: File, index: number): Promise<string> => {
    try {
      setUploadingFeatures({ ...uploadingFeatures, [index]: true });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'books');
      formData.append('folder', 'website/features');
      formData.append('fileName', file.name);
      formData.append('fileType', file.type || 'image/png');

      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload feature image');
      }

      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.url || uploadResult.publicUrl || uploadResult.path;
      
      if (!imageUrl) {
        throw new Error('Upload succeeded but no URL returned');
      }

      return imageUrl;
    } finally {
      setUploadingFeatures({ ...uploadingFeatures, [index]: false });
    }
  };

  const handleFeatureImageChange = (index: number, file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      setFeatureImageFiles({ ...featureImageFiles, [index]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeatureImagePreviews({ ...featureImagePreviews, [index]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => {
    const features = content.features || [];
    const newFeature = {
      title: '',
      description: '',
      image_url: '',
    };
    handleArrayChange('features', [...features, newFeature]);
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const features = [...(content.features || [])];
    features[index] = { ...features[index], [field]: value };
    handleArrayChange('features', features);
  };

  const removeFeature = (index: number) => {
    const features = content.features || [];
    const newFeatures = features.filter((_, i) => i !== index);
    handleArrayChange('features', newFeatures);
    // Clean up file state
    const newFiles = { ...featureImageFiles };
    const newPreviews = { ...featureImagePreviews };
    delete newFiles[index];
    delete newPreviews[index];
    setFeatureImageFiles(newFiles);
    setFeatureImagePreviews(newPreviews);
  };

  const uploadStatImage = async (file: File, index: number): Promise<string> => {
    try {
      setUploadingStats({ ...uploadingStats, [index]: true });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'books');
      formData.append('folder', 'website/statistics');
      formData.append('fileName', file.name);
      formData.append('fileType', file.type || 'image/png');

      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload stat image');
      }

      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.url || uploadResult.publicUrl || uploadResult.path;
      
      if (!imageUrl) {
        throw new Error('Upload succeeded but no URL returned');
      }

      return imageUrl;
    } finally {
      setUploadingStats({ ...uploadingStats, [index]: false });
    }
  };

  const handleStatImageChange = (index: number, file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      setStatImageFiles({ ...statImageFiles, [index]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setStatImagePreviews({ ...statImagePreviews, [index]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addStatistic = () => {
    const statistics = content.statistics || [];
    const newStat = {
      value: '',
      label: '',
      icon_url: '',
    };
    handleArrayChange('statistics', [...statistics, newStat]);
  };

  const updateStatistic = (index: number, field: string, value: string) => {
    const statistics = [...(content.statistics || [])];
    statistics[index] = { ...statistics[index], [field]: value };
    handleArrayChange('statistics', statistics);
  };

  const removeStatistic = (index: number) => {
    const statistics = content.statistics || [];
    const newStatistics = statistics.filter((_, i) => i !== index);
    handleArrayChange('statistics', newStatistics);
    // Clean up file state
    const newFiles = { ...statImageFiles };
    const newPreviews = { ...statImagePreviews };
    delete newFiles[index];
    delete newPreviews[index];
    setStatImageFiles(newFiles);
    setStatImagePreviews(newPreviews);
  };

  const handleAboutImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      setAboutImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAboutImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAboutImage = async (): Promise<string | null> => {
    if (!aboutImageFile) return null;

    try {
      setUploadingAboutImage(true);
      const formData = new FormData();
      formData.append('file', aboutImageFile);
      formData.append('bucket', 'books');
      formData.append('folder', 'website/about');
      formData.append('fileName', aboutImageFile.name);
      formData.append('fileType', aboutImageFile.type || 'image/png');

      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload about image');
      }

      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.url || uploadResult.publicUrl || uploadResult.path;
      
      if (!imageUrl) {
        throw new Error('Upload succeeded but no URL returned');
      }

      return imageUrl;
    } catch (error: any) {
      console.error('Error uploading about image:', error);
      throw error;
    } finally {
      setUploadingAboutImage(false);
    }
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadHeroImage = async (): Promise<string | null> => {
    if (!heroImageFile) return null;

    try {
      setUploadingHeroImage(true);
      const formData = new FormData();
      formData.append('file', heroImageFile);
      formData.append('bucket', 'books');
      formData.append('folder', 'website/hero');
      formData.append('fileName', heroImageFile.name);
      formData.append('fileType', heroImageFile.type || 'image/png');

      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload hero image');
      }

      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.url || uploadResult.publicUrl || uploadResult.path;
      
      if (!imageUrl) {
        throw new Error('Upload succeeded but no URL returned');
      }

      return imageUrl;
    } catch (error: any) {
      console.error('Error uploading hero image:', error);
      throw error;
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const addAboutFeature = () => {
    const aboutFeatures = content.about_features || [];
    handleArrayChange('about_features', [...aboutFeatures, '']);
  };

  const updateAboutFeature = (index: number, value: string) => {
    const aboutFeatures = [...(content.about_features || [])];
    aboutFeatures[index] = value;
    handleArrayChange('about_features', aboutFeatures);
  };

  const removeAboutFeature = (index: number) => {
    const aboutFeatures = content.about_features || [];
    const newFeatures = aboutFeatures.filter((_, i) => i !== index);
    handleArrayChange('about_features', newFeatures);
  };

  const addNavigationLink = () => {
    const links = content.navigation_links || [];
    handleArrayChange('navigation_links', [...links, { label: '', href: '' }]);
  };

  const updateNavigationLink = (index: number, field: 'label' | 'href', value: string) => {
    const links = [...(content.navigation_links || [])];
    links[index] = { ...links[index], [field]: value };
    handleArrayChange('navigation_links', links);
  };

  const removeNavigationLink = (index: number) => {
    const links = content.navigation_links || [];
    handleArrayChange('navigation_links', links.filter((_, i) => i !== index));
  };

  const addFooterQuickLink = () => {
    const links = content.footer_quick_links || [];
    handleArrayChange('footer_quick_links', [...links, { label: '', href: '' }]);
  };

  const updateFooterQuickLink = (index: number, field: 'label' | 'href', value: string) => {
    const links = [...(content.footer_quick_links || [])];
    links[index] = { ...links[index], [field]: value };
    handleArrayChange('footer_quick_links', links);
  };

  const removeFooterQuickLink = (index: number) => {
    const links = content.footer_quick_links || [];
    handleArrayChange('footer_quick_links', links.filter((_, i) => i !== index));
  };

  const addFooterCategory = () => {
    const categories = content.footer_categories || [];
    handleArrayChange('footer_categories', [...categories, { label: '', href: '' }]);
  };

  const updateFooterCategory = (index: number, field: 'label' | 'href', value: string) => {
    const categories = [...(content.footer_categories || [])];
    categories[index] = { ...categories[index], [field]: value };
    handleArrayChange('footer_categories', categories);
  };

  const removeFooterCategory = (index: number) => {
    const categories = content.footer_categories || [];
    handleArrayChange('footer_categories', categories.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      
      // Upload logo if a new file was selected
      let logoUrl = content.logo_url;
      if (logoFile) {
        logoUrl = await uploadLogo();
        handleInputChange('logo_url', logoUrl);
      }
      
      // Upload hero image if a new file was selected
      let heroImageUrl = content.hero_image_url;
      if (heroImageFile) {
        const uploadedUrl = await uploadHeroImage();
        if (uploadedUrl) {
          heroImageUrl = uploadedUrl;
        }
      }
      
      // Upload feature images
      const features = [...(content.features || [])];
      for (let i = 0; i < features.length; i++) {
        if (featureImageFiles[i]) {
          const imageUrl = await uploadFeatureImage(featureImageFiles[i], i);
          features[i].image_url = imageUrl;
        }
      }
      
      // Upload statistic images
      const statistics = [...(content.statistics || [])];
      for (let i = 0; i < statistics.length; i++) {
        if (statImageFiles[i]) {
          const imageUrl = await uploadStatImage(statImageFiles[i], i);
          statistics[i].icon_url = imageUrl;
        }
      }
      
      // Upload about image
      let aboutImageUrl = content.about_image_url;
      if (aboutImageFile) {
        const uploadedUrl = await uploadAboutImage();
        if (uploadedUrl) {
          aboutImageUrl = uploadedUrl;
        }
      }
      
      const saveData = { ...content };
      if (logoUrl) {
        saveData.logo_url = logoUrl;
      }
      if (heroImageUrl) {
        saveData.hero_image_url = heroImageUrl;
      }
      if (aboutImageUrl) {
        saveData.about_image_url = aboutImageUrl;
      }
      saveData.features = features;
      saveData.statistics = statistics;
      
      const response = await fetch(`${API_BASE_URL}/api/website-content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      setMessage({ type: 'success', text: 'Website content saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
      setLogoFile(null);
      setLogoPreview(null);
      setFeatureImageFiles({});
      setFeatureImagePreviews({});
      setStatImageFiles({});
      setStatImagePreviews({});
      setAboutImageFile(null);
      setAboutImagePreview(null);
      setHeroImageFile(null);
      setHeroImagePreview(null);
    } catch (error: any) {
      console.error('Error saving content:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save content' });
    } finally {
      setSaving(false);
    }
  };

  const toggleBookSelection = (bookId: string) => {
    const currentIds = content.featured_book_ids || [];
    const newIds = currentIds.includes(bookId)
      ? currentIds.filter(id => id !== bookId)
      : [...currentIds, bookId];
    handleInputChange('featured_book_ids', newIds);
  };

  const toggleAuthorSelection = (authorId: string) => {
    const currentIds = content.featured_author_ids || [];
    const newIds = currentIds.includes(authorId)
      ? currentIds.filter(id => id !== authorId)
      : [...currentIds, authorId];
    handleInputChange('featured_author_ids', newIds);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(bookSearchTerm.toLowerCase())
  );

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(authorSearchTerm.toLowerCase())
  );

  const toggleCategorySelection = (categoryId: string) => {
    const currentIds = content.featured_category_ids || [];
    const newIds = currentIds.includes(categoryId)
      ? currentIds.filter(id => id !== categoryId)
      : [...currentIds, categoryId];
    handleInputChange('featured_category_ids', newIds);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="text-center">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">Website Content Management</h1>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>

              {message && (
                <div className={`mb-4 p-4 rounded-lg ${
                  message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-8">
                {/* Logo & Branding */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Logo & Branding</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Upload Logo Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="w-full px-3 py-2 border border-black rounded-md"
                      />
                      {(logoPreview || content.logo_url) && (
                        <div className="mt-4">
                          <img
                            src={logoPreview || content.logo_url || ''}
                            alt="Logo preview"
                            className="max-w-[200px] max-h-[100px] object-contain border border-black rounded"
                          />
                        </div>
                      )}
                      {uploadingLogo && (
                        <p className="mt-2 text-sm text-black">Uploading logo...</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Logo Text</label>
                      <input
                        type="text"
                        value={content.logo_text || ''}
                        onChange={(e) => handleInputChange('logo_text', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                        placeholder="Agribook"
                      />
                    </div>
                  </div>
                </section>

                {/* Hero Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Hero Section</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Hero Title</label>
                      <input
                        type="text"
                        value={content.hero_title || ''}
                        onChange={(e) => handleInputChange('hero_title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Hero Subtitle</label>
                      <textarea
                        value={content.hero_subtitle || ''}
                        onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Upload Hero Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageChange}
                        className="w-full px-3 py-2 border border-black rounded-md"
                      />
                      {(heroImagePreview || content.hero_image_url) && (
                        <div className="mt-4">
                          <img
                            src={heroImagePreview || content.hero_image_url || ''}
                            alt="Hero preview"
                            className="max-w-[500px] max-h-[400px] object-contain border border-black rounded"
                          />
                        </div>
                      )}
                      {uploadingHeroImage && (
                        <p className="mt-2 text-sm text-black">Uploading image...</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Button 1 Text</label>
                        <input
                          type="text"
                          value={content.hero_button_1_text || ''}
                          onChange={(e) => handleInputChange('hero_button_1_text', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Button 1 Link</label>
                        <input
                          type="text"
                          value={content.hero_button_1_link || ''}
                          onChange={(e) => handleInputChange('hero_button_1_link', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Button 2 Text</label>
                        <input
                          type="text"
                          value={content.hero_button_2_text || ''}
                          onChange={(e) => handleInputChange('hero_button_2_text', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Button 2 Link</label>
                        <input
                          type="text"
                          value={content.hero_button_2_link || ''}
                          onChange={(e) => handleInputChange('hero_button_2_link', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Stat: Books</label>
                        <input
                          type="number"
                          value={content.stat_books || 0}
                          onChange={(e) => handleInputChange('stat_books', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Stat: Authors</label>
                        <input
                          type="number"
                          value={content.stat_authors || 0}
                          onChange={(e) => handleInputChange('stat_authors', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Stat: Readers</label>
                        <input
                          type="number"
                          value={content.stat_readers || 0}
                          onChange={(e) => handleInputChange('stat_readers', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Features Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Why Choose Agribook? (Features)</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Features Section Title</label>
                      <input
                        type="text"
                        value={content.features_title || ''}
                        onChange={(e) => handleInputChange('features_title', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Features Section Subtitle</label>
                      <input
                        type="text"
                        value={content.features_subtitle || ''}
                        onChange={(e) => handleInputChange('features_subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
                      >
                        + Add Feature
                      </button>
                    </div>
                    <div className="space-y-6">
                      {(content.features || []).map((feature: any, index: number) => (
                        <div key={index} className="border border-black rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-black">Feature {index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-black mb-2">Feature Title</label>
                              <input
                                type="text"
                                value={feature.title || ''}
                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-black rounded-md"
                                placeholder="e.g., Vast Library"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-black mb-2">Upload Feature Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFeatureImageChange(index, e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-black rounded-md"
                              />
                              {(featureImagePreviews[index] || feature.image_url) && (
                                <div className="mt-2">
                                  <img
                                    src={featureImagePreviews[index] || feature.image_url || ''}
                                    alt={`Feature ${index + 1} preview`}
                                    className="max-w-[200px] max-h-[150px] object-contain border border-black rounded"
                                  />
                                </div>
                              )}
                              {uploadingFeatures[index] && (
                                <p className="mt-2 text-sm text-black">Uploading image...</p>
                              )}
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-black mb-2">Feature Description</label>
                              <textarea
                                value={feature.description || ''}
                                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-black rounded-md"
                                rows={3}
                                placeholder="e.g., Access hundreds of eBooks covering all aspects of agriculture..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!content.features || content.features.length === 0) && (
                        <p className="text-gray-500 text-center py-8">No features added yet. Click "Add Feature" to get started.</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Statistics Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Statistics Banner</h2>
                  <div className="space-y-4">
                    <div>
                      <button
                        type="button"
                        onClick={addStatistic}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
                      >
                        + Add Statistic
                      </button>
                    </div>
                    <div className="space-y-6">
                      {(content.statistics || []).map((stat: any, index: number) => (
                        <div key={index} className="border border-black rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-black">Statistic {index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => removeStatistic(index)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-black mb-2">Stat Value</label>
                              <input
                                type="text"
                                value={stat.value || ''}
                                onChange={(e) => updateStatistic(index, 'value', e.target.value)}
                                className="w-full px-3 py-2 border border-black rounded-md"
                                placeholder="e.g., 500, 10.0K, 4.8"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-black mb-2">Stat Label</label>
                              <input
                                type="text"
                                value={stat.label || ''}
                                onChange={(e) => updateStatistic(index, 'label', e.target.value)}
                                className="w-full px-3 py-2 border border-black rounded-md"
                                placeholder="e.g., Total Books"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-black mb-2">Upload Icon/Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleStatImageChange(index, e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-black rounded-md"
                              />
                              {(statImagePreviews[index] || stat.icon_url) && (
                                <div className="mt-2">
                                  <img
                                    src={statImagePreviews[index] || stat.icon_url || ''}
                                    alt={`Stat ${index + 1} icon`}
                                    className="max-w-[60px] max-h-[60px] object-contain border border-black rounded"
                                  />
                                </div>
                              )}
                              {uploadingStats[index] && (
                                <p className="mt-2 text-sm text-black">Uploading icon...</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!content.statistics || content.statistics.length === 0) && (
                        <p className="text-gray-500 text-center py-8">No statistics added yet. Click "Add Statistic" to get started.</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* About Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">About Agribook</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">About Section Title</label>
                      <input
                        type="text"
                        value={content.about_title || ''}
                        onChange={(e) => handleInputChange('about_title', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">About Description</label>
                      <textarea
                        value={content.about_description || ''}
                        onChange={(e) => handleInputChange('about_description', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                        rows={5}
                        placeholder="Enter the about description text..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Upload About Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAboutImageChange}
                        className="w-full px-3 py-2 border border-black rounded-md"
                      />
                      {(aboutImagePreview || content.about_image_url) && (
                        <div className="mt-4">
                          <img
                            src={aboutImagePreview || content.about_image_url || ''}
                            alt="About preview"
                            className="max-w-[400px] max-h-[300px] object-contain border border-black rounded"
                          />
                        </div>
                      )}
                      {uploadingAboutImage && (
                        <p className="mt-2 text-sm text-black">Uploading image...</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">About Features (Checkmark List)</label>
                      <button
                        type="button"
                        onClick={addAboutFeature}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
                      >
                        + Add Feature
                      </button>
                      <div className="space-y-3">
                        {(content.about_features || []).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateAboutFeature(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-black rounded-md"
                              placeholder="e.g., Expert-curated content"
                            />
                            <button
                              type="button"
                              onClick={() => removeAboutFeature(index)}
                              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {(!content.about_features || content.about_features.length === 0) && (
                          <p className="text-gray-500 text-center py-4">No features added yet. Click "Add Feature" to get started.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Categories Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Explore Categories</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Categories Section Title</label>
                      <input
                        type="text"
                        value={content.categories_title || ''}
                        onChange={(e) => handleInputChange('categories_title', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Categories Section Subtitle</label>
                      <input
                        type="text"
                        value={content.categories_subtitle || ''}
                        onChange={(e) => handleInputChange('categories_subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                      />
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCategorySelector(!showCategorySelector)}
                        className="w-full px-4 py-2 border border-black rounded-md text-left bg-gray-50 hover:bg-gray-100 text-black"
                      >
                        Select Categories to Display ({content.featured_category_ids?.length || 0} selected)
                      </button>
                      {showCategorySelector && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Search categories..."
                              value={categorySearchTerm}
                              onChange={(e) => setCategorySearchTerm(e.target.value)}
                              className="w-full px-3 py-2 border border-black rounded-md mb-2"
                            />
                            {filteredCategories.map(category => (
                              <label key={category.id} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={content.featured_category_ids?.includes(category.id) || false}
                                  onChange={() => toggleCategorySelection(category.id)}
                                  className="mr-2"
                                />
                                <span className="text-black">{category.name}</span>
                                {category.icon && <span className="ml-2">{category.icon}</span>}
                              </label>
                            ))}
                            {filteredCategories.length === 0 && (
                              <p className="text-gray-500 text-center py-4">No categories found</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Featured Books */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Featured Books</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Books Section Title</label>
                      <input
                        type="text"
                        value={content.books_title || ''}
                        onChange={(e) => handleInputChange('books_title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Books Section Subtitle</label>
                      <input
                        type="text"
                        value={content.books_subtitle || ''}
                        onChange={(e) => handleInputChange('books_subtitle', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowBookSelector(!showBookSelector)}
                        className="w-full px-4 py-2 border border-black rounded-md text-left bg-gray-50 hover:bg-gray-100 text-black"
                      >
                        Select Featured Books ({content.featured_book_ids?.length || 0} selected)
                      </button>
                      {showBookSelector && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Search books..."
                              value={bookSearchTerm}
                              onChange={(e) => setBookSearchTerm(e.target.value)}
                              className="w-full px-3 py-2 border rounded-md mb-2"
                            />
                            {filteredBooks.map(book => (
                              <label key={book.id} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={content.featured_book_ids?.includes(book.id) || false}
                                  onChange={() => toggleBookSelection(book.id)}
                                  className="mr-2"
                                />
                                <span className="text-black">{book.title}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Featured Authors */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Featured Authors</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Authors Section Title</label>
                      <input
                        type="text"
                        value={content.authors_title || ''}
                        onChange={(e) => handleInputChange('authors_title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Authors Section Subtitle</label>
                      <input
                        type="text"
                        value={content.authors_subtitle || ''}
                        onChange={(e) => handleInputChange('authors_subtitle', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowAuthorSelector(!showAuthorSelector)}
                        className="w-full px-4 py-2 border border-black rounded-md text-left bg-gray-50 hover:bg-gray-100 text-black"
                      >
                        Select Featured Authors ({content.featured_author_ids?.length || 0} selected)
                      </button>
                      {showAuthorSelector && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Search authors..."
                              value={authorSearchTerm}
                              onChange={(e) => setAuthorSearchTerm(e.target.value)}
                              className="w-full px-3 py-2 border rounded-md mb-2"
                            />
                            {filteredAuthors.map(author => (
                              <label key={author.id} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={content.featured_author_ids?.includes(author.id) || false}
                                  onChange={() => toggleAuthorSelection(author.id)}
                                  className="mr-2"
                                />
                                <span className="text-black">{author.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* App Download Links */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">App Download Links</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Android App URL</label>
                      <input
                        type="url"
                        value={content.android_app_url || ''}
                        onChange={(e) => handleInputChange('android_app_url', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                        placeholder="https://play.google.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">iOS App URL</label>
                      <input
                        type="url"
                        value={content.ios_app_url || ''}
                        onChange={(e) => handleInputChange('ios_app_url', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                        placeholder="https://apps.apple.com/..."
                      />
                    </div>
                  </div>
                </section>

                {/* Navigation Links */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Navigation Menu</h2>
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={addNavigationLink}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
                    >
                      + Add Navigation Link
                    </button>
                    <div className="space-y-3">
                      {(content.navigation_links || []).map((link: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 border border-black rounded-lg p-3 bg-gray-50">
                          <input
                            type="text"
                            value={link.label || ''}
                            onChange={(e) => updateNavigationLink(index, 'label', e.target.value)}
                            className="flex-1 px-3 py-2 border border-black rounded-md"
                            placeholder="Link Label (e.g., Home)"
                          />
                          <input
                            type="text"
                            value={link.href || ''}
                            onChange={(e) => updateNavigationLink(index, 'href', e.target.value)}
                            className="flex-1 px-3 py-2 border border-black rounded-md"
                            placeholder="Link URL (e.g., #home)"
                          />
                          <button
                            type="button"
                            onClick={() => removeNavigationLink(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {(!content.navigation_links || content.navigation_links.length === 0) && (
                        <p className="text-gray-500 text-center py-4">No navigation links added yet. Click "Add Navigation Link" to get started.</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* CTA Section */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">CTA Section (Call to Action)</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">CTA Title</label>
                      <input
                        type="text"
                        value={content.cta_title || ''}
                        onChange={(e) => handleInputChange('cta_title', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">CTA Subtitle</label>
                      <textarea
                        value={content.cta_subtitle || ''}
                        onChange={(e) => handleInputChange('cta_subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Button 1 Text</label>
                        <input
                          type="text"
                          value={content.cta_button_1_text || ''}
                          onChange={(e) => handleInputChange('cta_button_1_text', e.target.value)}
                          className="w-full px-3 py-2 border border-black rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Button 1 Link</label>
                        <input
                          type="text"
                          value={content.cta_button_1_link || ''}
                          onChange={(e) => handleInputChange('cta_button_1_link', e.target.value)}
                          className="w-full px-3 py-2 border border-black rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Button 2 Text</label>
                        <input
                          type="text"
                          value={content.cta_button_2_text || ''}
                          onChange={(e) => handleInputChange('cta_button_2_text', e.target.value)}
                          className="w-full px-3 py-2 border border-black rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Button 2 Link</label>
                        <input
                          type="text"
                          value={content.cta_button_2_link || ''}
                          onChange={(e) => handleInputChange('cta_button_2_link', e.target.value)}
                          className="w-full px-3 py-2 border border-black rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <section className="border-b pb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Footer</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Footer Description</label>
                      <textarea
                        value={content.footer_description || ''}
                        onChange={(e) => handleInputChange('footer_description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Email</label>
                      <input
                        type="email"
                        value={content.footer_email || ''}
                        onChange={(e) => handleInputChange('footer_email', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Phone</label>
                      <input
                        type="text"
                        value={content.footer_phone || ''}
                        onChange={(e) => handleInputChange('footer_phone', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Support Email</label>
                      <input
                        type="email"
                        value={content.footer_support_email || ''}
                        onChange={(e) => handleInputChange('footer_support_email', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">Copyright Text</label>
                      <input
                        type="text"
                        value={content.footer_copyright || ''}
                        onChange={(e) => handleInputChange('footer_copyright', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">Footer Quick Links</label>
                      <button
                        type="button"
                        onClick={addFooterQuickLink}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
                      >
                        + Add Quick Link
                      </button>
                      <div className="space-y-3">
                        {(content.footer_quick_links || []).map((link: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 border border-black rounded-lg p-3 bg-gray-50">
                            <input
                              type="text"
                              value={link.label || ''}
                              onChange={(e) => updateFooterQuickLink(index, 'label', e.target.value)}
                              className="flex-1 px-3 py-2 border border-black rounded-md"
                              placeholder="Link Label (e.g., Home)"
                            />
                            <input
                              type="text"
                              value={link.href || ''}
                              onChange={(e) => updateFooterQuickLink(index, 'href', e.target.value)}
                              className="flex-1 px-3 py-2 border border-black rounded-md"
                              placeholder="Link URL (e.g., #home)"
                            />
                            <button
                              type="button"
                              onClick={() => removeFooterQuickLink(index)}
                              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {(!content.footer_quick_links || content.footer_quick_links.length === 0) && (
                          <p className="text-gray-500 text-center py-4">No quick links added yet. Click "Add Quick Link" to get started.</p>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">Footer Categories</label>
                      <button
                        type="button"
                        onClick={addFooterCategory}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
                      >
                        + Add Category Link
                      </button>
                      <div className="space-y-3">
                        {(content.footer_categories || []).map((category: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 border border-black rounded-lg p-3 bg-gray-50">
                            <input
                              type="text"
                              value={category.label || ''}
                              onChange={(e) => updateFooterCategory(index, 'label', e.target.value)}
                              className="flex-1 px-3 py-2 border border-black rounded-md"
                              placeholder="Category Label (e.g., Organic Farming)"
                            />
                            <input
                              type="text"
                              value={category.href || ''}
                              onChange={(e) => updateFooterCategory(index, 'href', e.target.value)}
                              className="flex-1 px-3 py-2 border border-black rounded-md"
                              placeholder="Link URL (e.g., #books)"
                            />
                            <button
                              type="button"
                              onClick={() => removeFooterCategory(index)}
                              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {(!content.footer_categories || content.footer_categories.length === 0) && (
                          <p className="text-gray-500 text-center py-4">No category links added yet. Click "Add Category Link" to get started.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Meta Information */}
                <section>
                  <h2 className="text-xl font-semibold text-black mb-4">Meta Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Page Title</label>
                      <input
                        type="text"
                        value={content.meta_title || ''}
                        onChange={(e) => handleInputChange('meta_title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Meta Description</label>
                      <textarea
                        value={content.meta_description || ''}
                        onChange={(e) => handleInputChange('meta_description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
