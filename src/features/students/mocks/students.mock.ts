import type { EducationLevel, Student, StudentGender, StudentStatus } from '../types/students.types'

/**
 * Fictional Algerian student records used by the mock service. All data is
 * invented; no real personal information is stored.
 */

interface StudentSeed {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gender: StudentGender
  level: EducationLevel
  classId: string
  status: StudentStatus
  enrollmentDate: string
  guardianName: string
  /** Digits only (e.g. "0550123456"); display formatting happens in utils. */
  guardianPhone: string
  email?: string
  address?: string
}

function makeStudent(seed: StudentSeed): Student {
  return { email: undefined, address: undefined, ...seed }
}

const SEED: StudentSeed[] = [
  // 1AP — enrolled this year
  { id: 's-001', firstName: 'Amine', lastName: 'Benali', birthDate: '2019-03-14', gender: 'male', level: '1AP', classId: 'cl-1ap-a', status: 'active', enrollmentDate: '2025-09-08', guardianName: 'Mohamed Benali', guardianPhone: '0550123456', email: 'amine.benali@mail.dz', address: 'Cité 20 Août, Bab Ezzouar, Alger' },
  { id: 's-002', firstName: 'Yasmine', lastName: 'Belkacem', birthDate: '2019-07-22', gender: 'female', level: '1AP', classId: 'cl-1ap-a', status: 'active', enrollmentDate: '2025-09-08', guardianName: 'Karim Belkacem', guardianPhone: '0661234567', address: 'Rue des Frères Bouadou, Alger' },
  { id: 's-003', firstName: 'Adam', lastName: 'Meziane', birthDate: '2020-01-05', gender: 'male', level: '1AP', classId: 'cl-1ap-a', status: 'active', enrollmentDate: '2025-09-08', guardianName: 'Sofiane Meziane', guardianPhone: '0771234567' },
  // 2AP
  { id: 's-004', firstName: 'Lina', lastName: 'Ferhat', birthDate: '2018-05-11', gender: 'female', level: '2AP', classId: 'cl-2ap-a', status: 'active', enrollmentDate: '2024-09-05', guardianName: 'Nabil Ferhat', guardianPhone: '0550987654', email: 'lina.ferhat@mail.dz' },
  { id: 's-005', firstName: 'Rayan', lastName: 'Hamidi', birthDate: '2018-09-02', gender: 'male', level: '2AP', classId: 'cl-2ap-a', status: 'active', enrollmentDate: '2024-09-05', guardianName: 'Salim Hamidi', guardianPhone: '0660987654', address: 'Hydra, Alger' },
  { id: 's-006', firstName: 'Selma', lastName: 'Bouzid', birthDate: '2017-12-18', gender: 'female', level: '2AP', classId: 'cl-2ap-a', status: 'active', enrollmentDate: '2024-09-05', guardianName: 'Amir Bouzid', guardianPhone: '0770987654' },
  // 3AP
  { id: 's-007', firstName: 'Zinedine', lastName: 'Kacem', birthDate: '2017-04-30', gender: 'male', level: '3AP', classId: 'cl-3ap-a', status: 'active', enrollmentDate: '2023-09-06', guardianName: 'Rachid Kacem', guardianPhone: '0550112233', address: 'El Harrach, Alger' },
  { id: 's-008', firstName: 'Meriem', lastName: 'Saidi', birthDate: '2017-08-09', gender: 'female', level: '3AP', classId: 'cl-3ap-a', status: 'active', enrollmentDate: '2023-09-06', guardianName: 'Farid Saidi', guardianPhone: '0660112233', email: 'meriem.saidi@mail.dz' },
  { id: 's-009', firstName: 'Walid', lastName: 'Guerroudj', birthDate: '2016-11-25', gender: 'male', level: '3AP', classId: 'cl-3ap-a', status: 'inactive', enrollmentDate: '2023-09-06', guardianName: 'Hocine Guerroudj', guardianPhone: '0770112233' },
  // 4AP
  { id: 's-010', firstName: 'Aya', lastName: 'Haddad', birthDate: '2016-02-17', gender: 'female', level: '4AP', classId: 'cl-4ap-a', status: 'active', enrollmentDate: '2022-09-07', guardianName: 'Djamel Haddad', guardianPhone: '0550445566', address: 'Birkhadem, Alger' },
  { id: 's-011', firstName: 'Ilyes', lastName: 'Mansouri', birthDate: '2016-06-03', gender: 'male', level: '4AP', classId: 'cl-4ap-a', status: 'active', enrollmentDate: '2022-09-07', guardianName: 'Sid Ahmed Mansouri', guardianPhone: '0660445566', email: 'ilyes.mansouri@mail.dz' },
  { id: 's-012', firstName: 'Nour', lastName: 'Medjahed', birthDate: '2015-10-12', gender: 'female', level: '4AP', classId: 'cl-4ap-a', status: 'active', enrollmentDate: '2022-09-07', guardianName: 'Larbi Medjahed', guardianPhone: '0770445566' },
  // 5AP
  { id: 's-013', firstName: 'Yacine', lastName: 'Ait Ahmed', birthDate: '2015-01-28', gender: 'male', level: '5AP', classId: 'cl-5ap-a', status: 'active', enrollmentDate: '2021-09-08', guardianName: 'Mouloud Ait Ahmed', guardianPhone: '0550778899', address: 'Bordj El Kiffan, Alger' },
  { id: 's-014', firstName: 'Khadidja', lastName: 'Boulahia', birthDate: '2015-07-19', gender: 'female', level: '5AP', classId: 'cl-5ap-a', status: 'active', enrollmentDate: '2021-09-08', guardianName: 'Abdelkader Boulahia', guardianPhone: '0660778899' },
  { id: 's-015', firstName: 'Bilal', lastName: 'Zerrouki', birthDate: '2014-09-30', gender: 'male', level: '5AP', classId: 'cl-5ap-a', status: 'transferred', enrollmentDate: '2021-09-08', guardianName: 'Noureddine Zerrouki', guardianPhone: '0770778899', email: 'bilal.zerrouki@mail.dz' },
  // 1AM
  { id: 's-016', firstName: 'Marwa', lastName: 'Sellami', birthDate: '2014-03-08', gender: 'female', level: '1AM', classId: 'cl-1am-a', status: 'active', enrollmentDate: '2025-09-05', guardianName: 'Tahar Sellami', guardianPhone: '0550223344', address: 'Cité Mohammadia, Alger' },
  { id: 's-017', firstName: 'Aymen', lastName: 'Djaafar', birthDate: '2014-05-26', gender: 'male', level: '1AM', classId: 'cl-1am-b', status: 'active', enrollmentDate: '2025-09-05', guardianName: 'Fouad Djaafar', guardianPhone: '0660223344' },
  { id: 's-018', firstName: 'Hadjer', lastName: 'Brahimi', birthDate: '2013-12-04', gender: 'female', level: '1AM', classId: 'cl-1am-b', status: 'active', enrollmentDate: '2025-09-05', guardianName: 'Messaoud Brahimi', guardianPhone: '0770223344', email: 'hadjer.brahimi@mail.dz' },
  // 2AM
  { id: 's-019', firstName: 'Mourad', lastName: 'Slimani', birthDate: '2013-06-15', gender: 'male', level: '2AM', classId: 'cl-2am-a', status: 'active', enrollmentDate: '2023-09-06', guardianName: 'Omar Slimani', guardianPhone: '0550556677', address: 'Dely Ibrahim, Alger' },
  { id: 's-020', firstName: 'Assia', lastName: 'Boukhalfa', birthDate: '2013-08-21', gender: 'female', level: '2AM', classId: 'cl-2am-b', status: 'active', enrollmentDate: '2023-09-06', guardianName: 'Bachir Boukhalfa', guardianPhone: '0660556677', email: 'assia.boukhalfa@mail.dz' },
  { id: 's-021', firstName: 'Anis', lastName: 'Cherifi', birthDate: '2012-10-09', gender: 'male', level: '2AM', classId: 'cl-2am-b', status: 'inactive', enrollmentDate: '2023-09-06', guardianName: 'Aziz Cherifi', guardianPhone: '0770556677' },
  // 3AM
  { id: 's-022', firstName: 'Ines', lastName: 'Benyahia', birthDate: '2012-01-11', gender: 'female', level: '3AM', classId: 'cl-3am-a', status: 'active', enrollmentDate: '2022-09-07', guardianName: 'Kamel Benyahia', guardianPhone: '0550998877', address: 'Chéraga, Alger' },
  { id: 's-023', firstName: 'Sofiane', lastName: 'Rahmani', birthDate: '2012-04-27', gender: 'male', level: '3AM', classId: 'cl-3am-a', status: 'active', enrollmentDate: '2022-09-07', guardianName: 'Hamid Rahmani', guardianPhone: '0660998877', email: 'sofiane.rahmani@mail.dz' },
  { id: 's-024', firstName: 'Sara', lastName: 'Lounis', birthDate: '2011-11-16', gender: 'female', level: '3AM', classId: 'cl-3am-a', status: 'suspended', enrollmentDate: '2022-09-07', guardianName: 'Youssef Lounis', guardianPhone: '0770998877' },
  // 4AM
  { id: 's-025', firstName: 'Houssem', lastName: 'Belhadj', birthDate: '2011-02-23', gender: 'male', level: '4AM', classId: 'cl-4am-a', status: 'active', enrollmentDate: '2021-09-08', guardianName: 'Amar Belhadj', guardianPhone: '0550334455', address: 'Kouba, Alger' },
  { id: 's-026', firstName: 'Amel', lastName: 'Ziani', birthDate: '2011-05-14', gender: 'female', level: '4AM', classId: 'cl-4am-a', status: 'active', enrollmentDate: '2021-09-08', guardianName: 'Lounès Ziani', guardianPhone: '0660334455' },
  { id: 's-027', firstName: 'Tarek', lastName: 'Benmoussa', birthDate: '2010-08-31', gender: 'male', level: '4AM', classId: 'cl-4am-a', status: 'active', enrollmentDate: '2021-09-08', guardianName: 'Salah Benmoussa', guardianPhone: '0770334455', email: 'tarek.benmoussa@mail.dz' },
  // 1AS
  { id: 's-028', firstName: 'Chaima', lastName: 'Derradji', birthDate: '2010-03-06', gender: 'female', level: '1AS', classId: 'cl-1as-a', status: 'active', enrollmentDate: '2024-09-05', guardianName: 'Rachid Derradji', guardianPhone: '0550667788', address: 'El Biar, Alger' },
  { id: 's-029', firstName: 'Omar', lastName: 'Khelifi', birthDate: '2010-06-18', gender: 'male', level: '1AS', classId: 'cl-1as-b', status: 'active', enrollmentDate: '2024-09-05', guardianName: 'Mabrouk Khelifi', guardianPhone: '0660667788', email: 'omar.khelifi@mail.dz' },
  { id: 's-030', firstName: 'Rania', lastName: 'Abbas', birthDate: '2009-12-22', gender: 'female', level: '1AS', classId: 'cl-1as-b', status: 'active', enrollmentDate: '2024-09-05', guardianName: 'Nourredine Abbas', guardianPhone: '0770667788' },
  // 2AS
  { id: 's-031', firstName: 'Fares', lastName: 'Bouguerra', birthDate: '2009-04-09', gender: 'male', level: '2AS', classId: 'cl-2as-a', status: 'active', enrollmentDate: '2023-09-06', guardianName: 'Hassan Bouguerra', guardianPhone: '0550889900', address: 'Ben Aknoun, Alger' },
  { id: 's-032', firstName: 'Wissam', lastName: 'Tabet', birthDate: '2009-07-13', gender: 'female', level: '2AS', classId: 'cl-2as-b', status: 'active', enrollmentDate: '2023-09-06', guardianName: 'Mohand Tabet', guardianPhone: '0660889900', email: 'wissam.tabet@mail.dz' },
  { id: 's-033', firstName: 'Nadir', lastName: 'Ould Kaci', birthDate: '2008-11-27', gender: 'male', level: '2AS', classId: 'cl-2as-b', status: 'inactive', enrollmentDate: '2023-09-06', guardianName: 'Smaïn Ould Kaci', guardianPhone: '0770889900' },
  // 3AS
  { id: 's-034', firstName: 'Dounia', lastName: 'Farhi', birthDate: '2008-02-12', gender: 'female', level: '3AS', classId: 'cl-3as-a', status: 'graduated', enrollmentDate: '2020-09-09', guardianName: 'Abderrahmane Farhi', guardianPhone: '0550101010', email: 'dounia.farhi@mail.dz', address: 'Sidi Yahia, Alger' },
  { id: 's-035', firstName: 'Idir', lastName: 'Aouali', birthDate: '2008-05-08', gender: 'male', level: '3AS', classId: 'cl-3as-a', status: 'graduated', enrollmentDate: '2020-09-09', guardianName: 'Belkacem Aouali', guardianPhone: '0660101010', address: 'Tizi Ouzou' },
  { id: 's-036', firstName: 'Melissa', lastName: 'Rachedi', birthDate: '2007-09-03', gender: 'female', level: '3AS', classId: 'cl-3as-a', status: 'graduated', enrollmentDate: '2020-09-09', guardianName: 'Ali Rachedi', guardianPhone: '0770101010', email: 'melissa.rachedi@mail.dz' },
]

/** Builds a fresh copy of the initial student list. */
export function createStudentsMock(): Student[] {
  return SEED.map((seed) => makeStudent(seed))
}
