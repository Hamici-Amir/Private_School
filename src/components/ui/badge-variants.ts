import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3 transition-none overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-white',
        outline: 'text-foreground',
        success: 'border-transparent bg-success text-success-foreground',
        warning: 'border-transparent bg-warning text-warning-foreground',
        info: 'border-transparent bg-info text-info-foreground',
        neutral: 'border-transparent bg-muted text-muted-foreground',
        'success-soft': 'border-success/20 bg-success-soft text-success-soft-foreground',
        'warning-soft': 'border-warning/25 bg-warning-soft text-warning-soft-foreground',
        'info-soft': 'border-info/20 bg-info-soft text-info-soft-foreground',
        'destructive-soft': 'border-destructive/20 bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>
