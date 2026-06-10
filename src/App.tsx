import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Login } from '@/pages/admin/Login'
import { Dashboard } from '@/pages/admin/Dashboard'

// Public site placeholder
function PublicPlaceholder() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="card-elevated max-w-md w-full">
        <h1 className="text-3xl font-display font-bold mb-4">V Portfolio</h1>
        <p className="text-muted-foreground mb-6">
          Public site structure will be built in Wave 3.
        </p>
        <a href="/admin/login" className="text-accent hover:underline text-sm font-medium">
          Admin Login
        </a>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicPlaceholder />,
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          // Future admin routes will go here
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
