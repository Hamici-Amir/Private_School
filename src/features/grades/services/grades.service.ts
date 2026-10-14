import { getStudents } from '@/features/students/services/students.service'
import { getSubjects } from '@/features/subjects/services/subjects.service'

export interface GradeRecord {
  id: string
  studentId: string
  studentName: string
  level: string
  classId: string
  subjectId: string
  subjectName: string
  score: number
  maxScore: 20
  term: 'term1' | 'term2' | 'term3'
  status: 'passed' | 'attention'
}

export async function getGrades(): Promise<GradeRecord[]> {
  const [students, subjects] = await Promise.all([getStudents(), getSubjects()])
  return students.flatMap((student, studentIndex) => subjects.filter((subject) => subject.levels.includes(student.level)).slice(0, 4).map((subject, subjectIndex) => {
    const score = 8 + ((studentIndex * 3 + subjectIndex * 2) % 13)
    return { id: `grade-${student.id}-${subject.id}`, studentId: student.id, studentName: `${student.firstName} ${student.lastName}`, level: student.level, classId: student.classId, subjectId: subject.id, subjectName: subject.name, score, maxScore: 20 as const, term: 'term1' as const, status: score >= 10 ? 'passed' as const : 'attention' as const }
  }))
}
