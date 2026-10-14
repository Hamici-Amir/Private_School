import type * as React from 'react'
import { cn } from '@/lib/utils'

/** Vertical rhythm container for a content section. */
function Section({ className, ...props }: React.ComponentProps<'section'>) {
  return <section data-slot="section" className={cn('space-y-4', className)} {...props} />
}

function SectionHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="section-header"
      className={cn('flex flex-col justify-between gap-1 sm:flex-row sm:items-center', className)}
      {...props}
    />
  )
}

function SectionTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2 data-slot="section-title" className={cn('text-base font-semibold', className)} {...props} />
  )
}

function SectionDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="section-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function SectionContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="section-content" className={cn('space-y-3', className)} {...props} />
}

export { Section, SectionContent, SectionDescription, SectionHeader, SectionTitle }
