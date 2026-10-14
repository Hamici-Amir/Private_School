import { getStudents } from '@/features/students/services/students.service'

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  level: string
  classId: string
  date: string
  status: AttendanceStatus
}

export async function getAttendance(): Promise<AttendanceRecord[]> {
  const students = await getStudents()
  return students.flatMap((student, studentIndex) => Array.from({ length: 5 }, (_, dayIndex) => {
    const statusIndex = (studentIndex + dayIndex) % 16
    const status: AttendanceStatus = statusIndex === 0 ? 'absent' : statusIndex === 1 ? 'late' : statusIndex === 2 ? 'excused' : 'present'
    return { id: `attendance-${student.id}-${dayIndex}`, studentId: student.id, studentName: `${student.firstName} ${student.lastName}`, level: student.level, classId: student.classId, date: `2026-09-${String(dayIndex + 1).padStart(2, '0')}`, status }
  }))
}
