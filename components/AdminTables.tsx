import React, { useMemo } from 'react';
import { FullStudentData, MATA_PELAJARAN, Subject, SEMESTERS, Semester, ProactiveData, AssignmentData, AttendanceData, ATTENDANCE_STATUS, AttendanceStatus } from '../types';
import { Select } from './UI';

type AdminTableProps<T> = {
    data: T[];
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    selectedSubject: Subject;
    setSelectedSubject: (subject: Subject) => void;
};

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th className="p-2 border-b border-gray-600 bg-gray-700 text-left text-sm font-semibold text-cyan-300">{children}</th>
);
const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <td className={`p-2 border-b border-gray-700 text-gray-200 ${className ?? ''}`}>{children}</td>
);
const InputCell: React.FC<{ value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ value, onChange }) => (
    <input type="number" value={value} onChange={onChange} className="w-20 bg-gray-800 text-white rounded p-1 border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500" />
);


export const UpdateExamTable: React.FC<AdminTableProps<FullStudentData>> = ({ data, setData, selectedSubject, setSelectedSubject }) => {
    
    const sortedData = useMemo(() => [...data].sort((a, b) => a.studentInfo.name.localeCompare(b.studentInfo.name)), [data]);

    const handleScoreChange = (studentId: string, semester: Semester, value: number) => {
        setData(prevData => prevData.map(student => {
            if (student.studentInfo.id === studentId) {
                const newSubjects = { ...student.subjects };
                if (newSubjects[selectedSubject]) {
                    newSubjects[selectedSubject]!.examScores[semester] = value;
                }
                return { ...student, subjects: newSubjects };
            }
            return student;
        }));
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-orbitron">Update Hasil Ujian</h3>
                <div className="flex gap-4">
                    <Select value={selectedSubject} onChange={setSelectedSubject} options={MATA_PELAJARAN} label="Mata Pelajaran" />
                    <input type="date" className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" defaultValue={new Date().toISOString().substring(0, 10)} />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <TableHeader>Name</TableHeader>
                            <TableHeader>NIM</TableHeader>
                            {SEMESTERS.map(s => <TableHeader key={s}>{s}</TableHeader>)}
                            <TableHeader>Rata-rata</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map(student => {
                            const scores = student.subjects[selectedSubject]?.examScores || {};
                            const validScores = Object.values(scores).filter(s => s !== undefined) as number[];
                            const average = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
                            return (
                                <tr key={student.studentInfo.id} className="hover:bg-gray-700/50">
                                    <TableCell className="font-bold text-white">{student.studentInfo.name}</TableCell>
                                    <TableCell>{student.studentInfo.nim}</TableCell>
                                    {SEMESTERS.map(semester => (
                                        <TableCell key={semester}>
                                            <InputCell value={scores[semester] || 0} onChange={e => handleScoreChange(student.studentInfo.id, semester, parseInt(e.target.value) || 0)} />
                                        </TableCell>
                                    ))}
                                    <TableCell className="font-bold">{average.toFixed(2)}</TableCell>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ... More tables for Proaktif, Tugas, Absensi would follow a similar pattern
export const UpdateProactiveTable: React.FC<AdminTableProps<FullStudentData>> = ({ data, setData, selectedSubject, setSelectedSubject }) => {
    const handleProactiveChange = (studentId: string, field: keyof ProactiveData, value: number) => {
        setData(prevData => prevData.map(s => {
            if (s.studentInfo.id === studentId) {
                const newProactive = { ...s.subjects[selectedSubject]?.proactive, [field]: value } as ProactiveData;
                const newSubjects = { ...s.subjects, [selectedSubject]: { ...s.subjects[selectedSubject], proactive: newProactive }};
                return { ...s, subjects: newSubjects };
            }
            return s;
        }))
    };
    
    return (
         <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-orbitron">Update Proaktif</h3>
                <div className="flex gap-4">
                    <Select value={selectedSubject} onChange={setSelectedSubject} options={MATA_PELAJARAN} label="Mata Pelajaran" />
                    <input type="date" className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" defaultValue={new Date().toISOString().substring(0, 10)} />
                </div>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>NIM</TableHeader>
                        <TableHeader>Bertanya</TableHeader>
                        <TableHeader>Menjawab</TableHeader>
                        <TableHeader>Menambahkan</TableHeader>
                        <TableHeader>Total Proaktif</TableHeader>
                        <TableHeader>Total Pertemuan</TableHeader>
                        <TableHeader>Nilai Proaktif</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {data.map(student => {
                        const proactive = student.subjects[selectedSubject]?.proactive || { bertanya: 0, menjawab: 0, menambahkan: 0};
                        const totalProaktif = proactive.bertanya + proactive.menjawab + proactive.menambahkan;
                        const totalPertemuan = student.attendance.totalPertemuan;
                        const nilaiProaktif = totalProaktif >= totalPertemuan ? 100 : 50;

                        return (
                            <tr key={student.studentInfo.id} className="hover:bg-gray-700/50">
                                <TableCell className="font-bold text-white">{student.studentInfo.name}</TableCell>
                                <TableCell>{student.studentInfo.nim}</TableCell>
                                <TableCell><InputCell value={proactive.bertanya} onChange={e => handleProactiveChange(student.studentInfo.id, 'bertanya', parseInt(e.target.value) || 0)} /></TableCell>
                                <TableCell><InputCell value={proactive.menjawab} onChange={e => handleProactiveChange(student.studentInfo.id, 'menjawab', parseInt(e.target.value) || 0)} /></TableCell>
                                <TableCell><InputCell value={proactive.menambahkan} onChange={e => handleProactiveChange(student.studentInfo.id, 'menambahkan', parseInt(e.target.value) || 0)} /></TableCell>
                                <TableCell>{totalProaktif}</TableCell>
                                <TableCell>{totalPertemuan}</TableCell>
                                <TableCell className="font-bold">{nilaiProaktif}</TableCell>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
         </div>
    );
};

export const UpdateAssignmentTable: React.FC<AdminTableProps<FullStudentData>> = ({ data, setData, selectedSubject, setSelectedSubject }) => {
    const handleAssignmentChange = (studentId: string, field: keyof AssignmentData, value: number) => {
        setData(prevData => prevData.map(s => {
            if (s.studentInfo.id === studentId) {
                const currentAssignment = s.subjects[selectedSubject]?.assignment || { selesai: 0, tidakSelesai: 0, jumlah: 10};
                const newAssignment = { ...currentAssignment, [field]: value };
                if (field === 'selesai' && newAssignment.jumlah > 0) {
                    newAssignment.tidakSelesai = newAssignment.jumlah - newAssignment.selesai;
                }
                const newSubjects = { ...s.subjects, [selectedSubject]: { ...s.subjects[selectedSubject], assignment: newAssignment }};
                return { ...s, subjects: newSubjects };
            }
            return s;
        }))
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-orbitron">Update Nilai Tugas</h3>
                <div className="flex gap-4">
                    <Select value={selectedSubject} onChange={setSelectedSubject} options={MATA_PELAJARAN} label="Mata Pelajaran" />
                    <input type="date" className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" defaultValue={new Date().toISOString().substring(0, 10)} />
                </div>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>NIM</TableHeader>
                        <TableHeader>Tugas Selesai</TableHeader>
                        <TableHeader>Tidak Selesai</TableHeader>
                        <TableHeader>Jumlah Tugas</TableHeader>
                        <TableHeader>Nilai Tugas</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {data.map(student => {
                        const assignment = student.subjects[selectedSubject]?.assignment || { selesai: 0, tidakSelesai: 0, jumlah: 10 };
                        const nilaiTugas = assignment.jumlah > 0 ? (assignment.selesai / assignment.jumlah) * 100 : 0;
                        return(
                            <tr key={student.studentInfo.id} className="hover:bg-gray-700/50">
                                <TableCell className="font-bold text-white">{student.studentInfo.name}</TableCell>
                                <TableCell>{student.studentInfo.nim}</TableCell>
                                <TableCell><InputCell value={assignment.selesai} onChange={e => handleAssignmentChange(student.studentInfo.id, 'selesai', parseInt(e.target.value) || 0)} /></TableCell>
                                <TableCell>{assignment.tidakSelesai}</TableCell>
                                <TableCell>{assignment.jumlah}</TableCell>
                                <TableCell className="font-bold">{nilaiTugas.toFixed(0)}</TableCell>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export const UpdateAttendanceTable: React.FC<AdminTableProps<FullStudentData>> = ({ data, setData, selectedSubject, setSelectedSubject }) => {
    
    const handleAttendanceChange = (studentId: string, field: keyof AttendanceData, value: number) => {
        setData(prevData => prevData.map(s => {
            if (s.studentInfo.id === studentId) {
                const newAttendance = { ...s.attendance, [field]: value };
                return { ...s, attendance: newAttendance };
            }
            return s;
        }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-orbitron">Update Daftar Hadir</h3>
                <div className="flex gap-4 items-end">
                    <Select value={selectedSubject} onChange={setSelectedSubject} options={MATA_PELAJARAN} label="Mata Pelajaran" />
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Pertemuan Ke</label>
                        <input type="number" className="w-28 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" defaultValue="1" />
                    </div>
                    <input type="date" className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" defaultValue={new Date().toISOString().substring(0, 10)} />
                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors h-10">Submit</button>
                </div>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>NIM</TableHeader>
                        <TableHeader>Status Daftar Hadir</TableHeader>
                        <TableHeader>Total Hadir</TableHeader>
                        <TableHeader>Total Pertemuan</TableHeader>
                        <TableHeader>Nilai Daftar Hadir</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {data.map(student => {
                        const { hadir, totalPertemuan } = student.attendance;
                        const nilaiHadir = totalPertemuan > 0 ? (hadir / totalPertemuan) * 100 : 0;
                        return (
                            <tr key={student.studentInfo.id} className="hover:bg-gray-700/50">
                                <TableCell className="font-bold text-white">{student.studentInfo.name}</TableCell>
                                <TableCell>{student.studentInfo.nim}</TableCell>
                                <TableCell>
                                    <select className="bg-gray-800 text-white rounded p-1 border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500">
                                        {ATTENDANCE_STATUS.map(status => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </TableCell>
                                <TableCell><InputCell value={hadir} onChange={e => handleAttendanceChange(student.studentInfo.id, 'hadir', parseInt(e.target.value) || 0)} /></TableCell>
                                <TableCell><InputCell value={totalPertemuan} onChange={e => handleAttendanceChange(student.studentInfo.id, 'totalPertemuan', parseInt(e.target.value) || 0)} /></TableCell>
                                <TableCell className="font-bold">{nilaiHadir.toFixed(0)}</TableCell>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};