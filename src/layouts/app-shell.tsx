import { Outlet } from 'react-router'

import { Breadcrumbs } from '@/components/navigation/breadcrumbs'
import { GlobalSearch } from '@/components/navigation/global-search'
import { Header } from '@/components/navigation/header'
import { MobileNav } from '@/components/navigation/mobile-nav'
import { Sidebar } from '@/components/navigation/sidebar'

/** Authenticated application shell: sidebar + header + breadcrumbs + routed content. */
export function AppShell() {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <MobileNav />
      <GlobalSearch />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main id="main" role="main" className="flex-1 p-4 sm:p-6">
          <div className="mx-auto mb-4 w-full max-w-7xl">
            <Breadcrumbs />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
