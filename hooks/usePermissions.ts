"use client";

import { useAuth } from "../context/AuthContext";

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.role) return false;
    return user.role === role;
  };

  const isAdmin = (): boolean => {
    return hasRole("Admin");
  };

  return {
    hasPermission,
    hasRole,
    isAdmin,

    canCreateItem: () => hasPermission("create_item"),
    canUpdateItem: () => hasPermission("update_item"),
    canDeleteItem: () => hasPermission("delete_item"),
    canReadItem: () => hasPermission("read_item"),
    canReadItemForSale: () => hasPermission("read_item_for_sale"),
    canUploadImage: () => hasPermission("upload_image"),

    canCreateTransaction: () => hasPermission("create_transaction"),
    canCreateSaleTransaction: () => hasPermission("create_sale_transaction"),
    canReadTransactions: () => hasPermission("read_transactions"),
    canReadOwnTransactions: () => hasPermission("read_own_transactions"),

    canViewReports: () => hasPermission("view_reports") || isAdmin(),
    canExportReports: () => hasPermission("export_reports"),

    canManageUsers: () => hasPermission("manage_users"),
    canAssignRoles: () => hasPermission("assign_roles"),

    canVerifyBlockchain: () => hasPermission("verify_blockchain"),
  };
}
