import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export interface AvatarGroupItem {
  /** Image source; if falsy, initials are used. */
  src?: string
  name: string
}

interface AvatarGroupProps {
  items: AvatarGroupItem[]
  /** Max avatars to render before showing the "+N" overflow pill. */
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/** Initials helper — handles Arabic/Latin multi-word names. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Stacked avatar list (e.g. "teachers in a class"). RTL-safe. */
export function AvatarGroup({ items, max = 4, size = 'md', className }: AvatarGroupProps) {
  const visible = items.slice(0, max)
  const overflow = items.length - visible.length

  return (
    <div className={cn('flex items-center -space-x-2 rtl:space-x-reverse', className)}>
      {visible.map((item) => (
        <Avatar key={item.name + item.src} size={size} className="ring-background ring-2">
          {item.src ? <AvatarImage src={item.src} alt={item.name} /> : null}
          <AvatarFallback>{initials(item.name)}</AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 ? (
        <Avatar size={size} className="ring-background bg-muted text-muted-foreground ring-2">
          <AvatarFallback className={cn('bg-muted')}>+{overflow}</AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  )
}
