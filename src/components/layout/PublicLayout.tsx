import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Navbar } from '@/components/layout/Navbar'
import { MobileNav } from '@/components/layout/MobileNav'
import { ScrollProgress } from '@/components/ui-custom/ScrollProgress'

export function PublicLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-base text-foreground font-body">
      <ScrollProgress />
      <Navbar />
      
      {/* 
        main wrapper pushes content down below fixed Navbar on desktop,
        and leaves room for fixed MobileNav on mobile.
      */}
      <main className="flex-1 pt-16 pb-20 md:pb-0 overflow-x-hidden">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <MobileNav />
    </div>
  )
}
