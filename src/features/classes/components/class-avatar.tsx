import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { getClassInitials } from '../utils/classes.utils'

/** Initials avatar for a class (label field only). */
export function ClassAvatar({
  label,
  size,
  className,
}: {
  label: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback>{getClassInitials(label)}</AvatarFallback>
    </Avatar>
  )
}
