// productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios/axiosInstance';

// ============================================================
// INTERFACES / TYPES
// ============================================================

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    is_active: boolean;
    product_count: number;
    created_at: string;
}

export interface Material {
    id: number;
    name: string;
    description?: string;
    image?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductImage {
    id: number;
    image: string;
    alt_text?: string;
    is_primary: boolean;
    order: number;
}

export interface StoreServiceImage {
    id: number;
    image: string;
    alt_text?: string;
    is_primary: boolean;
    order: number;
}

export interface Specification {
    id: number;
    name: string;
    value: string;
    order: number;
    product?: number;
}

export interface Review {
    id: number;
    user_name: string;
    user_avatar?: string;
    rating: number;
    title: string;
    comment: string;
    is_verified_purchase: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductListItem {
    id: number;
    name: string;
    slug: string;
    category?: any; // Can be string in list, Category object in detail
    description?: string;
    product_type: string;
    base_price: string;
    is_price_visible: boolean;
    primary_image?: string;
    is_customizable: boolean;
    is_in_stock: boolean;
    is_low_stock: boolean;
    is_featured: boolean;
    average_rating: number;
    review_count: number;
    created_at: string;
}

export interface ProductDetail extends ProductListItem {
    category?: Category;
    images?: ProductImage[];
    materials?: Material[];
    specifications?: Specification[];
    reviews?: Review[];
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    customization_note?: string;
    stock_quantity: number;
    updated_at: string;
}

export interface QuotationRequest {
    id: number;
    user_name?: string;
    product?: number;
    product_name?: string;
    quote_type: string;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
    project_title: string;
    service_type?: string;
    description: string;
    quantity?: number;
    urgency?: string;
    custom_dimensions?: string;
    preferred_materials?: string;
    additional_requirements?: string;
    budget_range_min?: number;
    budget_range_max?: number;
    required_by?: string;
    status: string;
    quoted_price?: number;
    quoted_delivery_time?: string;
    admin_notes?: string;
    quote_valid_until?: string;
    attachments?: any[];
    created_at: string;
    updated_at: string;
    quoted_at?: string;
}

export interface ServiceBooking {
    id: number;
    user_name?: string;
    product?: number;
    product_name?: string;
    service_type: string;
    description: string;
    preferred_date: string;
    preferred_time?: string;
    confirmed_date?: string;
    confirmed_time?: string;
    service_address?: number;
    service_address_details?: {
        street_address: string;
        city: string;
        state: string;
        country: string;
        zip_code: string;
    };
    status: string;
    admin_notes?: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
}

export interface StoreService {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    icon_name?: string;
    image?: string;
    images: StoreServiceImage[];
    is_active: boolean;
    order: number;
    created_at: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    focus_keyword?: string;
}

export interface ProductState {
    // Categories
    categories: Category[];
    categoriesLoading: boolean;
    categoriesError: string | null;

    // Products
    products: ProductListItem[];
    productsTotal: number;
    productsLoading: boolean;
    productsError: string | null;

    // Featured Products
    featuredProducts: ProductListItem[];
    featuredLoading: boolean;

    // Current Product
    currentProduct: ProductDetail | null;
    currentProductLoading: boolean;
    currentProductError: string | null;

    // Search Results
    searchResults: ProductListItem[];
    searchLoading: boolean;

    // Materials
    materials: Material[];
    materialsLoading: boolean;

    // Store Services
    services: StoreService[];
    servicesLoading: boolean;
    servicesError: string | null;

    // Quotations
    quotations: QuotationRequest[];
    quotationsLoading: boolean;
    quotationsError: string | null;

    // Service Bookings
    bookings: ServiceBooking[];
    bookingsLoading: boolean;
    bookingsError: string | null;

    // General
    generalError: string | null;
}

const initialState: ProductState = {
    categories: [],
    categoriesLoading: false,
    categoriesError: null,
    products: [],
    productsTotal: 0,
    productsLoading: false,
    productsError: null,
    featuredProducts: [],
    featuredLoading: false,
    currentProduct: null,
    currentProductLoading: false,
    currentProductError: null,
    searchResults: [],
    searchLoading: false,
    materials: [],
    materialsLoading: false,
    services: [],
    servicesLoading: false,
    servicesError: null,
    quotations: [],
    quotationsLoading: false,
    quotationsError: null,
    bookings: [],
    bookingsLoading: false,
    bookingsError: null,
    generalError: null,
};

// ============================================================
// THUNKS
// ============================================================

// ========== CATEGORIES ==========

export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/products/categories/');
            // Backend returns { success, message, data: { results: [...] } }
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : data.results || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const fetchCategoryDetail = createAsyncThunk(
    'products/fetchCategoryDetail',
    async (categoryId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/products/categories/${categoryId}/`);
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch category');
        }
    }
);

export const createCategory = createAsyncThunk(
    'products/createCategory',
    async (categoryData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/products/categories/', categoryData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create category');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'products/updateCategory',
    async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/products/categories/${id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update category');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'products/deleteCategory',
    async (categoryId: number, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/products/categories/${categoryId}/`);
            return categoryId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
        }
    }
);

// ========== MATERIALS ==========

export const fetchMaterials = createAsyncThunk(
    'products/fetchMaterials',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/products/materials/');
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : data.results || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch materials');
        }
    }
);

export const createMaterial = createAsyncThunk(
    'products/createMaterial',
    async (materialData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/products/materials/', materialData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create material');
        }
    }
);

export const updateMaterial = createAsyncThunk(
    'products/updateMaterial',
    async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/products/materials/${id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update material');
        }
    }
);

export const deleteMaterial = createAsyncThunk(
    'products/deleteMaterial',
    async (materialId: number, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/products/materials/${materialId}/`);
            return materialId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete material');
        }
    }
);

// ========== STORE SERVICES ==========

export const fetchStoreServices = createAsyncThunk(
    'products/fetchStoreServices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/products/store-services/');
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : data.results || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
        }
    }
);

// ========== PRODUCTS ==========


export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (
        params: {
            category?: string;
            is_featured?: boolean;
            product_type?: string;
            min_price?: number;
            max_price?: number;
            in_stock?: boolean;
            search?: string;
            ordering?: string;
            page?: number;
            page_size?: number;
        } = {},
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.get('/products/', { params });
            const data = response.data.data || response.data;

            // Handle paginated and non-paginated responses
            if (data.results) {
                return {
                    results: data.results,
                    count: data.count || data.results.length,
                };
            }

            return {
                results: Array.isArray(data) ? data : [],
                count: Array.isArray(data) ? data.length : 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const fetchFeaturedProducts = createAsyncThunk(
    'products/fetchFeaturedProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/products/featured/');
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : data.results || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
        }
    }
);

export const fetchProductDetail = createAsyncThunk(
    'products/fetchProductDetail',
    async (slug: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/products/${slug}/`);
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (productData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/products/', productData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data || response.data;
        } catch (error: any) {
            // Return the full error data if available, or just the message
            if (error.response?.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('Failed to create product');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ slug, data }: { slug: string; data: FormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/products/${slug}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data || response.data;
        } catch (error: any) {
            if (error.response?.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('Failed to update product');
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (slug: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/products/${slug}/`);
            return slug;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
        }
    }
);

export const searchProducts = createAsyncThunk(
    'products/searchProducts',
    async (query: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/products/search/?q=${query}`);
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : data.results || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

// ========== QUOTATIONS ==========

export const fetchQuotations = createAsyncThunk(
    'products/fetchQuotations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/products/quotations/');
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : data.results || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch quotations');
        }
    }
);

export const createQuotation = createAsyncThunk(
    'products/createQuotation',
    async (quotationData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/products/quotations/', quotationData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create quotation');
        }
    }
);

export const updateQuotation = createAsyncThunk(
    'products/updateQuotation',
    async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/products/quotations/${id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update quotation');
        }
    }
);

export const deleteQuotation = createAsyncThunk(
    'products/deleteQuotation',
    async (quotationId: number, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/products/quotations/${quotationId}/`);
            return quotationId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete quotation');
        }
    }
);

// ========== SERVICE BOOKINGS ==========

export const fetchBookings = createAsyncThunk(
    'products/fetchBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/products/bookings/');
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : data.results || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
);

export const createBooking = createAsyncThunk(
    'products/createBooking',
    async (bookingData: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/products/bookings/', bookingData);
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
        }
    }
);

export const updateBooking = createAsyncThunk(
    'products/updateBooking',
    async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/products/bookings/${id}/`, data);
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update booking');
        }
    }
);

export const deleteBooking = createAsyncThunk(
    'products/deleteBooking',
    async (bookingId: number, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/products/bookings/${bookingId}/`);
            return bookingId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete booking');
        }
    }
);

// ========== REVIEWS ==========

export const createReview = createAsyncThunk(
    'products/createReview',
    async ({ slug, data }: { slug: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/products/${slug}/reviews/`, data);
            return response.data.data || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
        }
    }
);

// ============================================================
// SLICE
// ============================================================

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
            state.currentProductError = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        clearGeneralError: (state) => {
            state.generalError = null;
        },
    },
    extraReducers: (builder) => {
        // ========== CATEGORIES ==========
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.categoriesLoading = true;
                state.categoriesError = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categoriesLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categoriesLoading = false;
                state.categoriesError = action.payload as string;
            });

        builder
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.id !== action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            });

        // ========== MATERIALS ==========
        builder
            .addCase(fetchMaterials.pending, (state) => {
                state.materialsLoading = true;
            })
            .addCase(fetchMaterials.fulfilled, (state, action) => {
                state.materialsLoading = false;
                state.materials = action.payload;
            })
            .addCase(fetchMaterials.rejected, (state, action) => {
                state.materialsLoading = false;
                state.generalError = action.payload as string;
            });

        builder
            .addCase(createMaterial.fulfilled, (state, action) => {
                state.materials.push(action.payload);
            })
            .addCase(deleteMaterial.fulfilled, (state, action) => {
                state.materials = state.materials.filter(m => m.id !== action.payload);
            })
            .addCase(updateMaterial.fulfilled, (state, action) => {
                const index = state.materials.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.materials[index] = action.payload;
                }
            });

        // ========== PRODUCTS ==========
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.productsLoading = true;
                state.productsError = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.productsLoading = false;
                state.products = action.payload.results;
                state.productsTotal = action.payload.count;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.productsLoading = false;
                state.productsError = action.payload as string;
            });

        builder
            .addCase(fetchFeaturedProducts.pending, (state) => {
                state.featuredLoading = true;
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.featuredLoading = false;
                state.featuredProducts = action.payload;
            });

        builder
            .addCase(fetchProductDetail.pending, (state) => {
                state.currentProductLoading = true;
                state.currentProductError = null;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.currentProductLoading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.currentProductLoading = false;
                state.currentProductError = action.payload as string;
            });

        builder
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
                state.productsTotal += 1;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p.slug !== action.payload);
                state.productsTotal -= 1;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p.slug === action.payload.slug);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                if (state.currentProduct?.slug === action.payload.slug) {
                    state.currentProduct = action.payload;
                }
            });

        builder
            .addCase(searchProducts.pending, (state) => {
                state.searchLoading = true;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload;
            });

        // ========== QUOTATIONS ==========
        builder
            .addCase(fetchQuotations.pending, (state) => {
                state.quotationsLoading = true;
                state.quotationsError = null;
            })
            .addCase(fetchQuotations.fulfilled, (state, action) => {
                state.quotationsLoading = false;
                state.quotations = action.payload;
            })
            .addCase(fetchQuotations.rejected, (state, action) => {
                state.quotationsLoading = false;
                state.quotationsError = action.payload as string;
            });

        builder
            .addCase(createQuotation.fulfilled, (state, action) => {
                state.quotations.push(action.payload);
            })
            .addCase(deleteQuotation.fulfilled, (state, action) => {
                state.quotations = state.quotations.filter(q => q.id !== action.payload);
            })
            .addCase(updateQuotation.fulfilled, (state, action) => {
                const index = state.quotations.findIndex(q => q.id === action.payload.id);
                if (index !== -1) {
                    state.quotations[index] = action.payload;
                }
            });

        // ========== BOOKINGS ==========
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.bookingsLoading = true;
                state.bookingsError = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.bookingsLoading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.bookingsLoading = false;
                state.bookingsError = action.payload as string;
            });

        builder
            .addCase(createBooking.fulfilled, (state, action) => {
                state.bookings.push(action.payload);
            })
            .addCase(deleteBooking.fulfilled, (state, action) => {
                state.bookings = state.bookings.filter(b => b.id !== action.payload);
            })
            .addCase(updateBooking.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
            });

        // ========== STORE SERVICES ==========
        builder
            .addCase(fetchStoreServices.pending, (state) => {
                state.servicesLoading = true;
                state.servicesError = null;
            })
            .addCase(fetchStoreServices.fulfilled, (state, action) => {
                state.servicesLoading = false;
                state.services = action.payload;
            })
            .addCase(fetchStoreServices.rejected, (state, action) => {
                state.servicesLoading = false;
                state.servicesError = action.payload as string;
            });
    },
});

export const { clearCurrentProduct, clearSearchResults, clearGeneralError } = productSlice.actions;
export default productSlice.reducer;