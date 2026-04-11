import type { ReactElement } from 'react'
import { ProtectedRoute } from './ProtectedRoute'

export function AdminRoute({ children }: { children: ReactElement }) {
  return <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>
}
