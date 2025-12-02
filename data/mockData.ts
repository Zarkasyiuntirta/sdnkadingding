import { FullStudentData, MATA_PELAJARAN, SEMESTERS, Student, Semester, Subject } from '../types';

const students: Student[] = [
  { id: '1', name: 'Budi Santoso', nim: '12345', photo: 'https://picsum.photos/seed/Budi/100/100' },
  { id: '2', name: 'Citra Lestari', nim: '12346', photo: 'https://picsum.photos/seed/Citra/100/100' },
  { id: '3', name: 'Dewi Anggraini', nim: '12347', photo: 'https://picsum.photos/seed/Dewi/100/100' },
  { id: '4', name: 'Eko Prasetyo', nim: '12348', photo: 'https://picsum.photos/seed/Eko/100/100' },
  { id: '5', name: 'Fitriani', nim: '12349', photo: 'https://picsum.photos/seed/Fitriani/100/100' },
  { id: '6', name: 'Guntur Saputra', nim: '12350', photo: 'https://picsum.photos/seed/Guntur/100/100' },
  { id: '7', name: 'Haniyah', nim: '12351', photo: 'https://picsum.photos/seed/Haniyah/100/100' },
  { id: '8', name: 'Indra Wijaya', nim: '12352', photo: 'https://picsum.photos/seed/Indra/100/100' },
  { id: '9', name: 'Joko Susilo', nim: '12353', photo: 'https://picsum.photos/seed/Joko/100/100' },
  { id: '10', name: 'Kartika Sari', nim: '12354', photo: 'https://picsum.photos/seed/Kartika/100/100' },
  { id: '11', name: 'Lina Marlina', nim: '12355', photo: 'https://picsum.photos/seed/Lina/100/100' },
  { id: '12', name: 'Muhammad Ridwan', nim: '12356', photo: 'https://picsum.photos/seed/Muhammad/100/100' },
  { id: '13', name: 'Nina Agustina', nim: '12357', photo: 'https://picsum.photos/seed/Nina/100/100' },
  { id: '14', name: 'Oscar Maulana', nim: '12358', photo: 'https://picsum.photos/seed/Oscar/100/100' },
  { id: '15', name: 'Putri Wulandari', nim: '12359', photo: 'https://picsum.photos/seed/Putri/100/100' },
  { id: '16', name: 'Qori Ramadhan', nim: '12360', photo: 'https://picsum.photos/seed/Qori/100/100' },
  { id: '17', name: 'Rina Novita', nim: '12361', photo: 'https://picsum.photos/seed/Rina/100/100' },
  { id: '18', name: 'Siti Aminah', nim: '12362', photo: 'https://picsum.photos/seed/Siti/100/100' },
  { id: '19', name: 'Taufik Hidayat', nim: '12363', photo: 'https://picsum.photos/seed/Taufik/100/100' },
  { id: '20', name: 'Umar Abdullah', nim: '12364', photo: 'https://picsum.photos/seed/Umar/100/100' },
  { id: '21', name: 'Vina Panduwinata', nim: '12365', photo: 'https://picsum.photos/seed/Vina/100/100' },
  { id: '22', name: 'Wahyu Nugroho', nim: '12366', photo: 'https://picsum.photos/seed/Wahyu/100/100' },
  { id: '23', name: 'Yoga Pratama', nim: '12367', photo: 'https://picsum.photos/seed/Yoga/100/100' },
  { id: '24', name: 'Zainal Abidin', nim: '12368', photo: 'https://picsum.photos/seed/Zainal/100/100' },
  { id: '25', name: 'Amelia Putri', nim: '12369', photo: 'https://picsum.photos/seed/Amelia/100/100' },
  { id: '26', name: 'Bambang Irawan', nim: '12370', photo: 'https://picsum.photos/seed/Bambang/100/100' },
  { id: '27', name: 'Cynthia Bella', nim: '12371', photo: 'https://picsum.photos/seed/Cynthia/100/100' },
  { id: '28', name: 'Dodi Firmansyah', nim: '12372', photo: 'https://picsum.photos/seed/Dodi/100/100' },
  { id: '29', name: 'Elisa Wijaya', nim: '12373', photo: 'https://picsum.photos/seed/Elisa/100/100' },
  { id: '30', name: 'Fajar Sidik', nim: '12374', photo: 'https://picsum.photos/seed/Fajar/100/100' },
  { id: '31', name: 'Gita Gutawa', nim: '12375', photo: 'https://picsum.photos/seed/Gita/100/100' },
  { id: '32', name: 'Hendra Gunawan', nim: '12376', photo: 'https://picsum.photos/seed/Hendra/100/100' },
  { id: '33', name: 'Irma Suryani', nim: '12377', photo: 'https://picsum.photos/seed/Irma/100/100' },
  { id: '34', name: 'Jefri Nichol', nim: '12378', photo: 'https://picsum.photos/seed/Jefri/100/100' },
  { id: '35', name: 'Kevin Sanjaya', nim: '12379', photo: 'https://picsum.photos/seed/Kevin/100/100' },
];

const generateRandomScore = (min = 60, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getInitialData = (): FullStudentData[] => students.map(student => ({
  studentInfo: student,
  attendance: {
    hadir: generateRandomScore(15, 20),
    totalPertemuan: 20,
  },
  subjects: MATA_PELAJARAN.reduce((acc, subject) => {
    acc[subject] = {
      examScores: SEMESTERS.reduce((scores, semester) => {
        scores[semester] = generateRandomScore();
        return scores;
        // FIX: Import `Semester` type from `../types`
      }, {} as { [key in Semester]?: number }),
      proactive: {
        bertanya: generateRandomScore(0, 5),
        menjawab: generateRandomScore(1, 6),
        menambahkan: generateRandomScore(0, 4),
      },
      assignment: {
        selesai: generateRandomScore(8, 10),
        tidakSelesai: 10 - generateRandomScore(8, 10),
        jumlah: 10,
      },
    };
    return acc;
    // FIX: Import `Subject` type from `../types`
  }, {} as { [key in Subject]?: any }),
}));

export const studentCredentials = students.map(s => ({ username: s.name, password: '12345' }));