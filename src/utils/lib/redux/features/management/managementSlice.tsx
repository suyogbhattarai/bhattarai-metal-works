import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios/axiosInstance';

// ============================================================
// INTERFACES
// ============================================================

export interface AnalyticsData {
    top_searches: { query: string; search_count: number }[];
    top_views: { product__name: string; view_count: number }[];
    seo_suggestions: {
        id: number;
        name: string;
        slug: string;
        missing: string[];
        suggestion: string;
    }[];
    summary: {
        total_products: number;
        total_services: number;
        total_queries: number;
    };
}

export interface DashboardOverview {
    recent_quotations: any[];
    seo_alerts: {
        id: number;
        name: string;
        slug: string;
        missing: string[];
        severity: 'high' | 'medium';
    }[];
    stats: {
        total_products: number;
        total_services: number;
        pending_quotations: number;
        staff_count: number;
    };
}

export interface StoreService {
    id: number;
    title: string;
    category: string;
    description: string;
    icon?: string;
    is_active: boolean;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    focus_keyword?: string;
}

export interface StaffProfile {
    id: number;
    user: number;
    user_name?: string;
    user_details?: {
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    user_data?: {
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    staff_type: 'full_time' | 'freelancer';
    designation: string;
    phone_number?: string;
    emergency_contact?: string;
    citizenship_number?: string;
    pan_number?: string;
    is_active: boolean;
    base_salary?: string | number;
    joining_date?: string;
    profile_picture?: string;
    citizenship_front?: string;
    citizenship_back?: string;
    contract_doc?: string;
}

export interface Project {
    id: number;
    title: string;
    client_name?: string;
    status: string;
    deadline?: string;
}

export interface ManagementState {
    analytics: AnalyticsData | null;
    analyticsLoading: boolean;

    overview: DashboardOverview | null;
    overviewLoading: boolean;

    services: StoreService[];
    servicesLoading: boolean;

    staff: StaffProfile[];
    staffLoading: boolean;

    projects: Project[];
    projectsLoading: boolean;

    error: string | null;
}

const initialState: ManagementState = {
    analytics: null,
    analyticsLoading: false,
    overview: null,
    overviewLoading: false,
    services: [],
    servicesLoading: false,
    staff: [],
    staffLoading: false,
    projects: [],
    projectsLoading: false,
    error: null,
};

// ============================================================
// THUNKS
// ============================================================

export const fetchAnalytics = createAsyncThunk(
    'management/fetchAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/products/analytics/dashboard/');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

export const fetchStaff = createAsyncThunk(
    'management/fetchStaff',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/hr/staff/');
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : data.results || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff');
        }
    }
);

export const fetchAttendance = createAsyncThunk(
    'management/fetchAttendance',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/hr/attendance/');
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : data.results || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
        }
    }
);

export const fetchProjects = createAsyncThunk(
    'management/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/projects/list/');
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data : data.results || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
        }
    }
);

export const fetchDashboardOverview = createAsyncThunk(
    'management/fetchDashboardOverview',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/products/overview/');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch overview');
        }
    }
);

export const fetchStoreServices = createAsyncThunk(
    'management/fetchStoreServices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/products/store-services/');
            return response.data.data.results || response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
        }
    }
);

export const createStoreService = createAsyncThunk(
    'management/createStoreService',
    async (formData: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/products/store-services/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to create service');
        }
    }
);

export const updateStoreService = createAsyncThunk(
    'management/updateStoreService',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/products/store-services/${id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to update service');
        }
    }
);

export const deleteStoreService = createAsyncThunk(
    'management/deleteStoreService',
    async (id: number, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/products/store-services/${id}/`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
        }
    }
);

// Projects
export const createProject = createAsyncThunk(
    'management/createProject',
    async (formData: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/projects/', formData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create project');
        }
    }
);

export const updateProject = createAsyncThunk(
    'management/updateProject',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/projects/${id}/`, data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update project');
        }
    }
);

export const createStaff = createAsyncThunk(
    'management/createStaff',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/hr/staff/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: 'Failed to create staff' });
        }
    }
);

export const updateStaff = createAsyncThunk(
    'management/updateStaff',
    async ({ id, data }: { id: number, data: FormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/hr/staff/${id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update staff' });
        }
    }
);

export const deleteStaff = createAsyncThunk(
    'management/deleteStaff',
    async (id: number, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/hr/staff/${id}/`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete staff');
        }
    }
);

// ============================================================
// SLICE
// ============================================================

const managementSlice = createSlice({
    name: 'management',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalytics.pending, (state) => {
                state.analyticsLoading = true;
            })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.analyticsLoading = false;
                state.analytics = action.payload;
            })
            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.analyticsLoading = false;
                state.error = action.payload as string;
            })
            // Staff
            .addCase(fetchStaff.pending, (state) => {
                state.staffLoading = true;
            })
            .addCase(fetchStaff.fulfilled, (state, action) => {
                state.staffLoading = false;
                state.staff = action.payload;
            })
            .addCase(fetchStaff.rejected, (state, action) => {
                state.staffLoading = false;
                state.error = action.payload as string;
            })
            // Attendance
            .addCase(fetchAttendance.pending, (state) => {
                state.staffLoading = true;
            })
            .addCase(fetchAttendance.fulfilled, (state, action) => {
                state.staffLoading = false;
                // You might want a separate state for attendance, but for now sharing staffLoading
            })
            .addCase(fetchAttendance.rejected, (state, action) => {
                state.staffLoading = false;
                state.error = action.payload as string;
            })
            // Projects
            .addCase(fetchProjects.pending, (state) => {
                state.projectsLoading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.projectsLoading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.projectsLoading = false;
                state.error = action.payload as string;
            })
            // Create Project
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.unshift(action.payload);
            })
            // Update Project
            .addCase(updateProject.fulfilled, (state, action) => {
                const idx = state.projects.findIndex(p => p.id === action.payload.id);
                if (idx !== -1) state.projects[idx] = action.payload;
            })
            // Create Staff
            .addCase(createStaff.pending, (state) => {
                state.staffLoading = true;
            })
            .addCase(createStaff.fulfilled, (state, action) => {
                state.staffLoading = false;
                state.staff.push(action.payload);
            })
            .addCase(updateStaff.fulfilled, (state, action) => {
                const idx = state.staff.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.staff[idx] = action.payload;
                state.staffLoading = false;
            })
            // Delete Staff
            .addCase(deleteStaff.fulfilled, (state, action) => {
                state.staff = state.staff.filter(s => s.id !== action.payload);
            })
            .addCase(createStaff.rejected, (state, action) => {
                state.staffLoading = false;
                state.error = action.payload as string;
            })
            // Overview
            .addCase(fetchDashboardOverview.pending, (state) => {
                state.overviewLoading = true;
            })
            .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
                state.overviewLoading = false;
                state.overview = action.payload;
            })
            .addCase(fetchDashboardOverview.rejected, (state, action) => {
                state.overviewLoading = false;
                state.error = action.payload as string;
            })
            // Services
            .addCase(fetchStoreServices.pending, (state) => {
                state.servicesLoading = true;
            })
            .addCase(fetchStoreServices.fulfilled, (state, action) => {
                state.servicesLoading = false;
                state.services = action.payload;
            })
            .addCase(fetchStoreServices.rejected, (state, action) => {
                state.servicesLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createStoreService.fulfilled, (state, action) => {
                state.services.unshift(action.payload);
            })
            .addCase(updateStoreService.fulfilled, (state, action) => {
                const idx = state.services.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.services[idx] = action.payload;
            })
            .addCase(deleteStoreService.fulfilled, (state, action) => {
                state.services = state.services.filter(s => s.id !== action.payload);
            });
    },
});

export const { clearError } = managementSlice.actions;
export default managementSlice.reducer;
