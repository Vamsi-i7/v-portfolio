import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Navbar } from '@/components/layout/Navbar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/ui-custom/ScrollProgress'

export function PublicLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-base text-foreground font-body">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      
      <main id="main-content" className="flex-1 pt-16 pb-20 md:pb-0 overflow-x-hidden">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
