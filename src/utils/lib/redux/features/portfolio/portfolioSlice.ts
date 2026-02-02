import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/lib/axios/axiosInstance';

export interface PortfolioImage {
    id: number;
    image: string;
    alt_text: string;
    is_primary: boolean;
    order: number;
}

export interface PortfolioCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    project_count: number;
}

export interface PortfolioProject {
    id: number;
    title: string;
    slug: string;
    category: number | null;
    category_detail: PortfolioCategory | null;
    description: string;
    client_name: string;
    client_logo: string | null;
    location: string;
    completion_date: string | null;
    is_featured: boolean;
    order: number;
    images: PortfolioImage[];
    primary_image: PortfolioImage | null;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    created_at: string;
    updated_at: string;
}

interface PortfolioState {
    projects: PortfolioProject[];
    categories: PortfolioCategory[];
    loading: boolean;
    error: string | null;
    totalCount: number;
}

const initialState: PortfolioState = {
    projects: [],
    categories: [],
    loading: false,
    error: null,
    totalCount: 0,
};

export const fetchPortfolioProjects = createAsyncThunk(
    'portfolio/fetchProjects',
    async (params: any = {}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/portfolio/projects/', { params });
            // DRF might return paginated results
            if (response.data.results) {
                return {
                    results: response.data.results,
                    count: response.data.count
                };
            }
            return {
                results: response.data,
                count: response.data.length
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch portfolio projects');
        }
    }
);

export const fetchPortfolioCategories = createAsyncThunk(
    'portfolio/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/portfolio/categories/');
            if (response.data.results) {
                return response.data.results;
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch portfolio categories');
        }
    }
);

export const createPortfolioProject = createAsyncThunk(
    'portfolio/createProject',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/portfolio/projects/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to create project');
        }
    }
);

export const updatePortfolioProject = createAsyncThunk(
    'portfolio/updateProject',
    async ({ slug, formData }: { slug: string; formData: FormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/portfolio/projects/${slug}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to update project');
        }
    }
);

export const deletePortfolioProject = createAsyncThunk(
    'portfolio/deleteProject',
    async (slug: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/portfolio/projects/${slug}/`);
            return slug;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to delete project');
        }
    }
);

export const createPortfolioCategory = createAsyncThunk(
    'portfolio/createCategory',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/portfolio/categories/', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to create category');
        }
    }
);

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Projects
            .addCase(fetchPortfolioProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPortfolioProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.results;
                state.totalCount = action.payload.count;
            })
            .addCase(fetchPortfolioProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Categories
            .addCase(fetchPortfolioCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPortfolioCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchPortfolioCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Project
            .addCase(createPortfolioProject.fulfilled, (state, action) => {
                state.projects.unshift(action.payload);
            })
            // Update Project
            .addCase(updatePortfolioProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.slug === action.payload.slug);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
            })
            // Delete Project
            .addCase(deletePortfolioProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(p => p.slug !== action.payload);
            })
            // Create Category
            .addCase(createPortfolioCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            });
    },
});

export default portfolioSlice.reducer;
