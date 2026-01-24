'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import RoleGuard from '@/components/dashboard/RoleGuard';
import DataTable from '@/components/dashboard/DataTable';
import { useToast, ToastContainer } from '@/components/toast';
import { LoadingSpinner } from '@/components/Loading';
import {
    fetchAllUsers,
    changeUserRole,
    deleteAdminUser,
    bulkUserAction,
    clearAdminError
} from '@/utils/lib/redux/features/auth/authSlice';

export default function UsersPage() {
    const dispatch = useDispatch();
    const { toasts, removeToast, showSuccess, showError } = useToast();
    
    // Redux state
    const { adminUsers, adminUsersTotal, adminLoading, adminError, user } = useSelector(
        (state: RootState) => state.auth
    );
    
    // Local state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'staff' | 'user'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before rendering (prevent hydration mismatch)
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (adminError) {
            showError(adminError);
            dispatch(clearAdminError());
        }
    }, [adminError, dispatch, showError, mounted]);

    useEffect(() => {
        if (!mounted) return;

        const loadUsers = async () => {
            try {
                const params: any = {
                    page: currentPage,
                    page_size: 20,
                };
                
                if (searchTerm) params.search = searchTerm;
                if (statusFilter !== 'all') params.status = statusFilter;
                if (roleFilter !== 'all') params.role = roleFilter;
                
                await dispatch(fetchAllUsers(params) as any);
            } catch (error: any) {
                showError(error.message || 'Failed to load users');
            }
        };

        loadUsers();
    }, [searchTerm, statusFilter, roleFilter, currentPage, dispatch, showError, mounted]);

    const handleRoleChange = async (userId: number, newRole: 'admin' | 'staff' | 'user') => {
        try {
            await dispatch(changeUserRole({ userId, role: newRole }) as any);
            showSuccess(`User role changed to ${newRole}`);
        } catch (error: any) {
            showError(error.message || 'Failed to change user role');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await dispatch(deleteAdminUser(userId) as any);
                showSuccess('User deleted successfully');
            } catch (error: any) {
                showError(error.message || 'Failed to delete user');
            }
        }
    };

    const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
        if (selectedUsers.length === 0) {
            showError('Please select at least one user');
            return;
        }

        if (confirm(`Are you sure you want to ${action} ${selectedUsers.length} user(s)?`)) {
            try {
                await dispatch(bulkUserAction({ userIds: selectedUsers, action }) as any);
                showSuccess(`${selectedUsers.length} user(s) ${action}d successfully`);
                setSelectedUsers([]);
            } catch (error: any) {
                showError(error.message || `Failed to ${action} users`);
            }
        }
    };

    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            setSelectedUsers(adminUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: number, isSelected: boolean) => {
        if (isSelected) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" text="Loading..." />
            </div>
        );
    }

    const stats = {
        admins: adminUsers?.filter((u: any) => u.role === 'admin').length || 0,
        staff: adminUsers?.filter((u: any) => u.role === 'staff').length || 0,
        users: adminUsers?.filter((u: any) => u.role === 'user').length || 0,
    };

    const columns = [
        {
            key: 'select',
            label: '',
            render: (_: any, row: any) => (
                <input
                    type="checkbox"
                    checked={selectedUsers.includes(row.id)}
                    onChange={(e) => handleSelectUser(row.id, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
            )
        },
        {
            key: 'profile_picture',
            label: 'Avatar',
            render: (value: string, row: any) => (
                value ? (
                    <img src={value} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-[#f6423a] to-[#e03229] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {row.first_name?.[0] || row.username?.[0] || 'U'}
                    </div>
                )
            )
        },
        {
            key: 'username',
            label: 'Username'
        },
        {
            key: 'email',
            label: 'Email'
        },
        {
            key: 'first_name',
            label: 'Name',
            render: (_: string, row: any) => `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'N/A'
        },
        {
            key: 'role',
            label: 'Role',
            render: (value: string, row: any) => (
                <select
                    value={value}
                    onChange={(e) => handleRoleChange(row.id, e.target.value as any)}
                    disabled={row.id === user?.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium border-none cursor-pointer ${
                        value === 'admin' ? 'bg-red-500/20 text-red-400' :
                        value === 'staff' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                    } ${row.id === user?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                </select>
            )
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (value: boolean) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    value ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                }`}>
                    {value ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: 'date_joined',
            label: 'Joined',
            render: (value: string) => new Date(value).toLocaleDateString()
        },
        {
            key: 'last_login',
            label: 'Last Login',
            render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Never'
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_: any, row: any) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleDeleteUser(row.id)}
                        disabled={row.id === user?.id}
                        className="px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title={row.id === user?.id ? 'Cannot delete yourself' : 'Delete user'}
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <RoleGuard allowedRoles={['admin']}>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
                    <p className="text-gray-400">Manage user accounts, roles, and permissions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                        <p className="text-purple-400 text-sm font-medium mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-white">{adminUsersTotal}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-red-400 text-sm font-medium mb-1">Admins</p>
                        <p className="text-3xl font-bold text-white">{stats.admins}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-blue-400 text-sm font-medium mb-1">Staff</p>
                        <p className="text-3xl font-bold text-white">{stats.staff}</p>
                    </div>
                    <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4">
                        <p className="text-gray-400 text-sm font-medium mb-1">Users</p>
                        <p className="text-3xl font-bold text-white">{stats.users}</p>
                    </div>
                </div>

                {/* Filters and Bulk Actions */}
                <div className="bg-[#111e48]/40 backdrop-blur-xl rounded-xl p-6 border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Search by username or email..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2 bg-[#111e48] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value as any);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2 bg-[#111e48] border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                            >
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Role
                            </label>
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value as any);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2 bg-[#111e48] border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                                <option value="user">User</option>
                            </select>
                        </div>

                        {/* Bulk Actions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Bulk Actions
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBulkAction('activate')}
                                    disabled={selectedUsers.length === 0}
                                    className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Activate
                                </button>
                                <button
                                    onClick={() => handleBulkAction('deactivate')}
                                    disabled={selectedUsers.length === 0}
                                    className="flex-1 px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Deactivate
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Select All */}
                    {adminUsers && adminUsers.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                            <input
                                type="checkbox"
                                checked={selectedUsers.length === adminUsers.length && adminUsers.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                            />
                            <span className="text-sm text-gray-400">
                                {selectedUsers.length > 0
                                    ? `${selectedUsers.length} user(s) selected`
                                    : 'Select all users'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Users Table */}
                <div className="bg-[#111e48]/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                    {adminLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <LoadingSpinner size="lg" text="Loading users..." />
                        </div>
                    ) : adminUsers && adminUsers.length > 0 ? (
                        <>
                            <DataTable
                                columns={columns}
                                data={adminUsers}
                                loading={adminLoading}
                            />
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-gray-400 text-sm">
                                    Showing {adminUsers.length} of {adminUsersTotal} users
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 text-white text-sm">
                                        Page {currentPage}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={adminUsers.length < 20}
                                        className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-gray-400">No users found</p>
                        </div>
                    )}
                </div>
            </div>
        </RoleGuard>
    );
}