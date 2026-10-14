import type * as React from 'react'
import { cn } from '@/lib/utils'

/** Constrains page content to a consistent, readable width. */
function PageContainer({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="page-container"
      className={cn('mx-auto w-full max-w-7xl space-y-6', className)}
      {...props}
    />
  )
}

function PageHeader({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      data-slot="page-header"
      className={cn('flex flex-col justify-between gap-3 sm:flex-row sm:items-end', className)}
      {...props}
    />
  )
}

function PageTitle({ className, ...props }: React.ComponentProps<'h1'>) {
  return <h1 data-slot="page-title" className={cn('tracking-tight', className)} {...props} />
}

function PageDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="page-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

/** Right-aligned (or end-aligned in RTL) header actions row. */
function PageActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="page-actions"
      className={cn('flex flex-wrap items-center gap-2', className)}
      {...props}
    />
  )
}

function PageContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="page-content" className={cn('space-y-6', className)} {...props} />
}

export { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageTitle }
