import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Teacher } from '../types/teachers.types'
import { getTeacherInitials } from '../utils/teachers.utils'

/** Initials avatar for a teacher (name field only). */
export function TeacherAvatar({
  teacher,
  size,
  className,
}: {
  teacher: Pick<Teacher, 'firstName' | 'lastName'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback>{getTeacherInitials(teacher)}</AvatarFallback>
    </Avatar>
  )
}