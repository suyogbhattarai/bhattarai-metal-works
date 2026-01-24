// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios/axiosInstance';

// --- Interfaces (Types) ---
interface User {
    id: number;
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    profile_picture?: string;
    role: 'admin' | 'staff' | 'user';
    is_admin: boolean;
    is_staff: boolean;
    is_active?: boolean;
    last_login?: string;
    date_joined?: string;
}

interface Address {
    id: number;
    street_address: string;
    apartment_address?: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    is_default_shipping: boolean;
    is_default_billing: boolean;
}

interface AdminUser {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    role: 'admin' | 'staff' | 'user';
    date_joined: string;
    last_login?: string;
    addresses_count?: number;
    profile_picture?: string;
}

interface AdminUserDetail extends AdminUser {
    addresses?: Address[];
}

interface UserStats {
    total_users: number;
    active_users: number;
    inactive_users: number;
    admins: number;
    staff_members: number;
    regular_users: number;
    new_users_last_30_days: number;
    active_last_7_days: number;
}

interface PaginatedUsers {
    count: number;
    next: string | null;
    previous: string | null;
    results: AdminUser[];
}

interface AuthState {
    user: User | null;
    addresses: Address[];
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    token: string | null;
    refreshToken: string | null;
    
    // Admin specific state
    adminUsers: AdminUser[];
    adminUsersTotal: number;
    selectedUser: AdminUserDetail | null;
    userStats: UserStats | null;
    adminLoading: boolean;
    adminError: string | null;
}

// Load initial state from localStorage
const loadAuthFromStorage = (): Partial<AuthState> => {
    if (typeof window === 'undefined') return {};
    
    try {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
            const user = JSON.parse(userStr);
            return {
                token,
                refreshToken,
                user,
                isAuthenticated: true,
            };
        }
    } catch (error) {
        console.error('Error loading auth from storage:', error);
        // Clear corrupted data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }
    return {
        token: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
    };
};

const initialState: AuthState = {
    user: null,
    addresses: [],
    loading: false,
    error: null,
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    adminUsers: [],
    adminUsersTotal: 0,
    selectedUser: null,
    userStats: null,
    adminLoading: false,
    adminError: null,
    ...loadAuthFromStorage(),
};

// --- Thunks ---

// 1. Register User
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: any, { rejectWithValue }) => {
        try {
            // Create form data
            const formData = new FormData();
            
            // Required fields
            formData.append('username', userData.username);
            formData.append('email', userData.email);
            formData.append('password', userData.password);
            formData.append('password2', userData.password); // Backend requires password2
            
            // Optional fields
            if (userData.first_name) formData.append('first_name', userData.first_name);
            if (userData.last_name) formData.append('last_name', userData.last_name);
            if (userData.phone_number) formData.append('phone_number', userData.phone_number);
            if (userData.profile_picture) formData.append('profile_picture', userData.profile_picture);
            
            const response = await axiosInstance.post('/accounts/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('Register API Response:', response.data);
            
            // Response: { message, data: { user, tokens: { access, refresh } } }
            const { user, tokens } = response.data.data;

            // Save tokens and user to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', tokens.access);
                localStorage.setItem('refreshToken', tokens.refresh);
                localStorage.setItem('user', JSON.stringify(user));
                console.log('Saved to localStorage:', { user, tokens });
            }

            return { user, tokens };
        } catch (error: any) {
            console.error('Registration error:', error);
            
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorMessage = Object.values(errors).flat().join(', ');
                return rejectWithValue(errorMessage);
            }
            
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// 2. Login User
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/accounts/login/', credentials);
            
            console.log('Login API Response:', response.data);
            
            // Response: { message, data: { user, tokens: { access, refresh } } }
            const { user, tokens } = response.data.data;

            // Save tokens and user to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', tokens.access);
                localStorage.setItem('refreshToken', tokens.refresh);
                localStorage.setItem('user', JSON.stringify(user));
                console.log('Saved to localStorage:', { user, tokens });
            }

            return { user, tokens };
        } catch (error: any) {
            console.error('Login error:', error);
            
            if (error.response) {
                const errorMessage = error.response?.data?.message 
                    || error.response?.data?.error 
                    || 'Invalid username or password';
                return rejectWithValue(errorMessage);
            } else if (error.request) {
                return rejectWithValue('Network error. Please check your connection.');
            } else {
                return rejectWithValue(error.message || 'Login failed');
            }
        }
    }
);

// 3. Get User Profile
export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/accounts/profile/');
            console.log('Fetch Profile Response:', response.data);
            
            // Response: { message, data: user }
            const user = response.data.data;
            
            // Update user in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            return user;
        } catch (error: any) {
            console.error('Fetch profile error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

// 4. Update User Profile
export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (formData: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/accounts/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log('Update Profile Response:', response.data);
            
            const user = response.data.data;
            
            // Update user in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            return user;
        } catch (error: any) {
            console.error('Update profile error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

// 5. Fetch Addresses
export const fetchAddresses = createAsyncThunk(
    'auth/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/accounts/addresses/');
            return response.data;
        } catch (error: any) {
            console.error('Fetch addresses error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
        }
    }
);

// 6. Add Address
export const addAddress = createAsyncThunk(
    'auth/addAddress',
    async (addressData: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/accounts/addresses/', addressData);
            return response.data;
        } catch (error: any) {
            console.error('Add address error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to add address');
        }
    }
);

// 7. Update Address
export const updateAddress = createAsyncThunk(
    'auth/updateAddress',
    async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/accounts/addresses/${id}/`, data);
            return response.data;
        } catch (error: any) {
            console.error('Update address error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update address');
        }
    }
);

// 8. Delete Address
export const deleteAddress = createAsyncThunk(
    'auth/deleteAddress',
    async (id: number, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/accounts/addresses/${id}/`);
            return id;
        } catch (error: any) {
            console.error('Delete address error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
        }
    }
);

// ============================================================
// ADMIN ENDPOINTS
// ============================================================

// 9. Fetch All Users (Admin)
export const fetchAllUsers = createAsyncThunk(
    'auth/fetchAllUsers',
    async (
        params: {
            search?: string;
            status?: 'active' | 'inactive';
            role?: 'admin' | 'staff' | 'user';
            ordering?: string;
            page?: number;
            page_size?: number;
        } = {},
        { rejectWithValue }
    ) => {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.search) queryParams.append('search', params.search);
            if (params.status) queryParams.append('status', params.status);
            if (params.role) queryParams.append('role', params.role);
            if (params.ordering) queryParams.append('ordering', params.ordering);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.page_size) queryParams.append('page_size', params.page_size.toString());
            
            const queryString = queryParams.toString();
            const url = `/accounts/users/${queryString ? '?' + queryString : ''}`;
            
            const response = await axiosInstance.get(url);
            console.log('Fetch All Users Response:', response.data);
            
            // Response: { success, message, data: { count, next, previous, results } }
            return response.data.data;
        } catch (error: any) {
            console.error('Fetch all users error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

// 10. Fetch Single User Details (Admin)
export const fetchUserDetails = createAsyncThunk(
    'auth/fetchUserDetails',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/accounts/users/${userId}/`);
            console.log('Fetch User Details Response:', response.data);
            
            // Response: { success, message, data: user }
            return response.data.data;
        } catch (error: any) {
            console.error('Fetch user details error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
        }
    }
);

// 11. Update User (Admin)
export const updateAdminUser = createAsyncThunk(
    'auth/updateAdminUser',
    async (
        { userId, data }: { userId: number; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.put(`/accounts/users/${userId}/`, data);
            console.log('Update Admin User Response:', response.data);
            
            // Response: { success, message, data: user }
            return response.data.data;
        } catch (error: any) {
            console.error('Update admin user error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update user');
        }
    }
);

// 12. Delete User (Admin) - Soft Delete
export const deleteAdminUser = createAsyncThunk(
    'auth/deleteAdminUser',
    async (userId: number, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/accounts/users/${userId}/`);
            console.log(`User ${userId} deleted`);
            
            // Response: 204 No Content
            return userId;
        } catch (error: any) {
            console.error('Delete admin user error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

// 13. Change User Role (Admin)
export const changeUserRole = createAsyncThunk(
    'auth/changeUserRole',
    async (
        { userId, role }: { userId: number; role: 'admin' | 'staff' | 'user' },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.post(`/accounts/users/${userId}/change-role/`, {
                role,
            });
            console.log('Change User Role Response:', response.data);
            
            // Response: { success, message, data: user }
            return response.data.data;
        } catch (error: any) {
            console.error('Change user role error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to change user role');
        }
    }
);

// 14. Bulk User Actions (Admin)
export const bulkUserAction = createAsyncThunk(
    'auth/bulkUserAction',
    async (
        { userIds, action }: { userIds: number[]; action: 'activate' | 'deactivate' | 'delete' },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.post('/accounts/users/bulk-action/', {
                user_ids: userIds,
                action,
            });
            console.log('Bulk User Action Response:', response.data);
            
            // Response: { success, message, data: { updated_count } }
            return response.data.data;
        } catch (error: any) {
            console.error('Bulk user action error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to perform bulk action');
        }
    }
);

// 15. Fetch User Statistics (Admin)
export const fetchUserStats = createAsyncThunk(
    'auth/fetchUserStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/accounts/users/stats/');
            console.log('Fetch User Stats Response:', response.data);
            
            // Response: { success, message, data: stats }
            return response.data.data;
        } catch (error: any) {
            console.error('Fetch user stats error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
        }
    }
);

// --- Slice ---
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.addresses = [];
            state.isAuthenticated = false;
            state.token = null;
            state.refreshToken = null;
            
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        clearAdminError: (state) => {
            state.adminError = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(action.payload));
            }
        },
    },
    extraReducers: (builder) => {
        // Register
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.tokens.access;
            state.refreshToken = action.payload.tokens.refresh;
            state.error = null;
            
            console.log('Redux state updated after register:', { 
                user: state.user, 
                isAuthenticated: state.isAuthenticated,
                role: state.user?.role 
            });
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.refreshToken = null;
        });

        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.tokens.access;
            state.refreshToken = action.payload.tokens.refresh;
            state.error = null;
            
            console.log('Redux state updated after login:', { 
                user: state.user, 
                isAuthenticated: state.isAuthenticated,
                role: state.user?.role 
            });
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.refreshToken = null;
        });

        // Fetch Profile
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(fetchUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Profile
        builder.addCase(updateUserProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Address - Fetch
        builder.addCase(fetchAddresses.fulfilled, (state, action) => {
            state.addresses = Array.isArray(action.payload) ? action.payload : (action.payload.results || []);
        });

        // Address - Add
        builder.addCase(addAddress.fulfilled, (state, action) => {
            state.addresses.push(action.payload);
        });

        // Address - Update
        builder.addCase(updateAddress.fulfilled, (state, action) => {
            const index = state.addresses.findIndex((addr) => addr.id === action.payload.id);
            if (index !== -1) {
                state.addresses[index] = action.payload;
            }
        });

        // Address - Delete
        builder.addCase(deleteAddress.fulfilled, (state, action) => {
            state.addresses = state.addresses.filter((addr) => addr.id !== action.payload);
        });

        // ============================================================
        // ADMIN ACTIONS
        // ============================================================

        // Fetch All Users
        builder.addCase(fetchAllUsers.pending, (state) => {
            state.adminLoading = true;
            state.adminError = null;
        });
        builder.addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<PaginatedUsers>) => {
            state.adminLoading = false;
            state.adminUsers = action.payload.results;
            state.adminUsersTotal = action.payload.count;
            state.adminError = null;
        });
        builder.addCase(fetchAllUsers.rejected, (state, action) => {
            state.adminLoading = false;
            state.adminError = action.payload as string;
        });

        // Fetch User Details
        builder.addCase(fetchUserDetails.pending, (state) => {
            state.adminLoading = true;
            state.adminError = null;
        });
        builder.addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<AdminUserDetail>) => {
            state.adminLoading = false;
            state.selectedUser = action.payload;
            state.adminError = null;
        });
        builder.addCase(fetchUserDetails.rejected, (state, action) => {
            state.adminLoading = false;
            state.adminError = action.payload as string;
        });

        // Update Admin User
        builder.addCase(updateAdminUser.pending, (state) => {
            state.adminLoading = true;
            state.adminError = null;
        });
        builder.addCase(updateAdminUser.fulfilled, (state, action: PayloadAction<AdminUserDetail>) => {
            state.adminLoading = false;
            state.selectedUser = action.payload;
            
            // Update in users list if present
            const index = state.adminUsers.findIndex((u) => u.id === action.payload.id);
            if (index !== -1) {
                state.adminUsers[index] = action.payload;
            }
            
            state.adminError = null;
        });
        builder.addCase(updateAdminUser.rejected, (state, action) => {
            state.adminLoading = false;
            state.adminError = action.payload as string;
        });

        // Delete Admin User
        builder.addCase(deleteAdminUser.pending, (state) => {
            state.adminLoading = true;
            state.adminError = null;
        });
        builder.addCase(deleteAdminUser.fulfilled, (state, action: PayloadAction<number>) => {
            state.adminLoading = false;
            state.adminUsers = state.adminUsers.filter((u) => u.id !== action.payload);
            if (state.selectedUser?.id === action.payload) {
                state.selectedUser = null;
            }
            state.adminError = null;
        });
        builder.addCase(deleteAdminUser.rejected, (state, action) => {
            state.adminLoading = false;
            state.adminError = action.payload as string;
        });

        // Change User Role
        builder.addCase(changeUserRole.pending, (state) => {
            state.adminLoading = true;
            state.adminError = null;
        });
        builder.addCase(changeUserRole.fulfilled, (state, action: PayloadAction<AdminUserDetail>) => {
            state.adminLoading = false;
            state.selectedUser = action.payload;
            
            // Update in users list if present
            const index = state.adminUsers.findIndex((u) => u.id === action.payload.id);
            if (index !== -1) {
                state.adminUsers[index] = action.payload;
            }
            
            state.adminError = null;
        });
        builder.addCase(changeUserRole.rejected, (state, action) => {
            state.adminLoading = false;
            state.adminError = action.payload as string;
        });

        // Bulk User Action
        builder.addCase(bulkUserAction.pending, (state) => {
            state.adminLoading = true;
            state.adminError = null;
        });
        builder.addCase(bulkUserAction.fulfilled, (state) => {
            state.adminLoading = false;
            state.adminError = null;
        });
        builder.addCase(bulkUserAction.rejected, (state, action) => {
            state.adminLoading = false;
            state.adminError = action.payload as string;
        });

        // Fetch User Stats
        builder.addCase(fetchUserStats.pending, (state) => {
            state.adminLoading = true;
            state.adminError = null;
        });
        builder.addCase(fetchUserStats.fulfilled, (state, action: PayloadAction<UserStats>) => {
            state.adminLoading = false;
            state.userStats = action.payload;
            state.adminError = null;
        });
        builder.addCase(fetchUserStats.rejected, (state, action) => {
            state.adminLoading = false;
            state.adminError = action.payload as string;
        });
    },
});

export const { logout, clearError, clearAdminError, setUser } = authSlice.actions;
export default authSlice.reducer;