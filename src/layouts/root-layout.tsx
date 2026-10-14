import { Outlet } from 'react-router'

/** Root layout: accessibility skip-link wrapping the routed application. */
export function RootLayout() {
  return (
    <>
      <a
        href="#main"
        className="bg-primary text-primary-foreground focus:z-50 sr-only rounded-md px-4 py-2 text-sm focus:not-sr-only focus:fixed focus:top-4 focus:start-4"
      >
        Skip to content
      </a>
      <Outlet />
    </>
  )
}
