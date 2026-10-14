import type { ComponentProps } from 'react'
import { DayPicker } from 'react-day-picker'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { buttonVariants } from './button-variants'

import 'react-day-picker/style.css'

export type CalendarProps = ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col gap-2 sm:flex-row',
        month: 'flex flex-col gap-4',
        month_caption: 'relative flex items-center justify-center pt-1',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'absolute start-1 top-0 size-8 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'absolute end-1 top-0 size-8 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        month_grid: 'w-full border-collapse space-x-1',
        weekdays: 'flex justify-center',
        weekday: 'text-muted-foreground w-8 rounded-md font-normal text-[0.8rem]',
        week_number: 'text-muted-foreground w-8 rounded-md font-normal text-[0.8rem]',
        day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal aria-selected:opacity-100',
        ),
        range_start: 'rounded-s-md',
        range_end: 'rounded-e-md',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className }) => {
          const Icon = orientation === 'left' ? ChevronLeftIcon : ChevronRightIcon
          return <Icon className={cn('size-4', className)} aria-hidden="true" />
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
