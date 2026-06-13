import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Login } from '@/pages/admin/Login'
import { Dashboard } from '@/pages/admin/Dashboard'
import { Settings } from '@/pages/admin/Settings'
import { ProjectsList } from '@/pages/admin/Projects'
import { ProjectForm } from '@/pages/admin/Projects/ProjectForm'
import { ExperienceList } from '@/pages/admin/Experience'
import { ExperienceForm } from '@/pages/admin/Experience/ExperienceForm'
import { JourneyList } from '@/pages/admin/Journey'
import { JourneyForm } from '@/pages/admin/Journey/JourneyForm'
import { SkillsList } from '@/pages/admin/Skills'
import { SkillForm } from '@/pages/admin/Skills/SkillForm'
import { AchievementsList } from '@/pages/admin/Achievements'
import { AchievementForm } from '@/pages/admin/Achievements/AchievementForm'
import { CertificatesList } from '@/pages/admin/Certificates'
import { CertificateForm } from '@/pages/admin/Certificates/CertificateForm'
import { CodingProfilesPage } from '@/pages/admin/CodingProfiles'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Home } from '@/pages/public/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
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
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'projects',
            element: <ProjectsList />,
          },
          {
            path: 'projects/new',
            element: <ProjectForm />,
          },
          {
            path: 'projects/:id',
            element: <ProjectForm />,
          },
          {
            path: 'experience',
            element: <ExperienceList />,
          },
          {
            path: 'experience/new',
            element: <ExperienceForm />,
          },
          {
            path: 'experience/:id',
            element: <ExperienceForm />,
          },
          {
            path: 'journey',
            element: <JourneyList />,
          },
          {
            path: 'journey/new',
            element: <JourneyForm />,
          },
          {
            path: 'journey/:id/edit',
            element: <JourneyForm />,
          },
          {
            path: 'skills',
            element: <SkillsList />,
          },
          {
            path: 'skills/new',
            element: <SkillForm />,
          },
          {
            path: 'skills/:id/edit',
            element: <SkillForm />,
          },
          {
            path: 'achievements',
            element: <AchievementsList />,
          },
          {
            path: 'achievements/new',
            element: <AchievementForm />,
          },
          {
            path: 'achievements/:id/edit',
            element: <AchievementForm />,
          },
          {
            path: 'certificates',
            element: <CertificatesList />,
          },
          {
            path: 'certificates/new',
            element: <CertificateForm />,
          },
          {
            path: 'certificates/:id/edit',
            element: <CertificateForm />,
          },
          {
            path: 'coding-profiles',
            element: <CodingProfilesPage />,
          },
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
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App
