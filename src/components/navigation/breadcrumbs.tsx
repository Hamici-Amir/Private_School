import { Fragment } from 'react'

import { Link, useLocation } from 'react-router'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useI18n } from '@/hooks/use-i18n'
import { getBreadcrumbs } from '@/lib/breadcrumbs'
import type { TranslationKey } from '@/lib/i18n'

/** Breadcrumb trail derived from the navigation configuration. */
export function Breadcrumbs() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const trail = getBreadcrumbs(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {trail.map((entry, index) => {
          const label = t(entry.labelKey as TranslationKey)
          const isLast = index === trail.length - 1
          return (
            <Fragment key={entry.labelKey}>
              <BreadcrumbItem>
                {entry.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link to={entry.href}>{label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
