import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Parent } from '../types/parents.types'
import { getParentInitials } from '../utils/parents.utils'

/** Initials avatar for a parent (name field only). */
export function ParentAvatar({
  parent,
  size,
  className,
}: {
  parent: Pick<Parent, 'firstName' | 'lastName'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback>{getParentInitials(parent)}</AvatarFallback>
    </Avatar>
  )
}