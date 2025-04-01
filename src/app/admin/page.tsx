"use client"

import { RequireAdmin } from "@/components/auth/require-admin"
import { AdminDashboard } from "@/components/admin/dashboard"

export default function AdminPage() {
  return (
    <RequireAdmin>
      <AdminDashboard />
    </RequireAdmin>
  )
} 