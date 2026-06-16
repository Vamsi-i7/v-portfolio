import { lazy, Suspense, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { initAnalytics } from '@/lib/analytics'

// Lazy Load Public Pages
const Home = lazy(() => import('@/pages/public/Home').then(m => ({ default: m.Home })))

// Lazy Load Admin Pages
const Login = lazy(() => import('@/pages/admin/Login').then(m => ({ default: m.Login })))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard').then(m => ({ default: m.Dashboard })))
const Settings = lazy(() => import('@/pages/admin/Settings').then(m => ({ default: m.Settings })))
const ProjectsList = lazy(() => import('@/pages/admin/Projects').then(m => ({ default: m.ProjectsList })))
const ProjectForm = lazy(() => import('@/pages/admin/Projects/ProjectForm').then(m => ({ default: m.ProjectForm })))
const ExperienceList = lazy(() => import('@/pages/admin/Experience').then(m => ({ default: m.ExperienceList })))
const ExperienceForm = lazy(() => import('@/pages/admin/Experience/ExperienceForm').then(m => ({ default: m.ExperienceForm })))
const JourneyList = lazy(() => import('@/pages/admin/Journey').then(m => ({ default: m.JourneyList })))
const JourneyForm = lazy(() => import('@/pages/admin/Journey/JourneyForm').then(m => ({ default: m.JourneyForm })))
const SkillsList = lazy(() => import('@/pages/admin/Skills').then(m => ({ default: m.SkillsList })))
const SkillForm = lazy(() => import('@/pages/admin/Skills/SkillForm').then(m => ({ default: m.SkillForm })))
const AchievementsList = lazy(() => import('@/pages/admin/Achievements').then(m => ({ default: m.AchievementsList })))
const AchievementForm = lazy(() => import('@/pages/admin/Achievements/AchievementForm').then(m => ({ default: m.AchievementForm })))
const CertificatesList = lazy(() => import('@/pages/admin/Certificates').then(m => ({ default: m.CertificatesList })))
const CertificateForm = lazy(() => import('@/pages/admin/Certificates/CertificateForm').then(m => ({ default: m.CertificateForm })))
const CodingProfilesPage = lazy(() => import('@/pages/admin/CodingProfiles').then(m => ({ default: m.CodingProfilesPage })))

/**
 * Component to handle analytics initialization
 */
function AnalyticsTracker() {
  useEffect(() => {
    initAnalytics()
  }, [])

  return null
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <AnalyticsTracker />
        <PublicLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <Home />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/admin/login',
    element: (
      <>
        <AnalyticsTracker />
        <Suspense fallback={null}>
          <Login />
        </Suspense>
      </>
    ),
  },
  {
    path: '/admin',
    element: (
      <>
        <AnalyticsTracker />
        <ProtectedRoute />
      </>
    ),
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={null}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: 'settings',
            element: (
              <Suspense fallback={null}>
                <Settings />
              </Suspense>
            ),
          },
          {
            path: 'projects',
            element: (
              <Suspense fallback={null}>
                <ProjectsList />
              </Suspense>
            ),
          },
          {
            path: 'projects/new',
            element: (
              <Suspense fallback={null}>
                <ProjectForm />
              </Suspense>
            ),
          },
          {
            path: 'projects/:id',
            element: (
              <Suspense fallback={null}>
                <ProjectForm />
              </Suspense>
            ),
          },
          {
            path: 'experience',
            element: (
              <Suspense fallback={null}>
                <ExperienceList />
              </Suspense>
            ),
          },
          {
            path: 'experience/new',
            element: (
              <Suspense fallback={null}>
                <ExperienceForm />
              </Suspense>
            ),
          },
          {
            path: 'experience/:id',
            element: (
              <Suspense fallback={null}>
                <ExperienceForm />
              </Suspense>
            ),
          },
          {
            path: 'journey',
            element: (
              <Suspense fallback={null}>
                <JourneyList />
              </Suspense>
            ),
          },
          {
            path: 'journey/new',
            element: (
              <Suspense fallback={null}>
                <JourneyForm />
              </Suspense>
            ),
          },
          {
            path: 'journey/:id/edit',
            element: (
              <Suspense fallback={null}>
                <JourneyForm />
              </Suspense>
            ),
          },
          {
            path: 'skills',
            element: (
              <Suspense fallback={null}>
                <SkillsList />
              </Suspense>
            ),
          },
          {
            path: 'skills/new',
            element: (
              <Suspense fallback={null}>
                <SkillForm />
              </Suspense>
            ),
          },
          {
            path: 'skills/:id/edit',
            element: (
              <Suspense fallback={null}>
                <SkillForm />
              </Suspense>
            ),
          },
          {
            path: 'achievements',
            element: (
              <Suspense fallback={null}>
                <AchievementsList />
              </Suspense>
            ),
          },
          {
            path: 'achievements/new',
            element: (
              <Suspense fallback={null}>
                <AchievementForm />
              </Suspense>
            ),
          },
          {
            path: 'achievements/:id/edit',
            element: (
              <Suspense fallback={null}>
                <AchievementForm />
              </Suspense>
            ),
          },
          {
            path: 'certificates',
            element: (
              <Suspense fallback={null}>
                <CertificatesList />
              </Suspense>
            ),
          },
          {
            path: 'certificates/new',
            element: (
              <Suspense fallback={null}>
                <CertificateForm />
              </Suspense>
            ),
          },
          {
            path: 'certificates/:id/edit',
            element: (
              <Suspense fallback={null}>
                <CertificateForm />
              </Suspense>
            ),
          },
          {
            path: 'coding-profiles',
            element: (
              <Suspense fallback={null}>
                <CodingProfilesPage />
              </Suspense>
            ),
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
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App
