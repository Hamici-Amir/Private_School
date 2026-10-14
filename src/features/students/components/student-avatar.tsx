import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Student } from '../types/students.types'
import { getStudentInitials } from '../utils/students.utils'

/** Initials avatar for a student (name field only). */
export function StudentAvatar({
  student,
  size,
  className,
}: {
  student: Pick<Student, 'firstName' | 'lastName'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback>{getStudentInitials(student)}</AvatarFallback>
    </Avatar>
  )
}