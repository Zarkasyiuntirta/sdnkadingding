
import React, { useState, useContext, useMemo, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getInitialData } from '../data/mockData';
import { FullStudentData, MATA_PELAJARAN, SEMESTERS, Subject, Semester } from '../types';
import { Card, Select, StudentInfoCard } from './UI';
import { ExamResultsChart, ProactiveChart, AssignmentChart, AttendanceChart, RankingChart } from './Charts';
import { UpdateExamTable, UpdateProactiveTable, UpdateAssignmentTable, UpdateAttendanceTable } from './AdminTables';

type AdminView = 'Ujian' | 'Proaktif' | 'Tugas' | 'Daftar Hadir';

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [studentData, setStudentData] = useState<FullStudentData[]>(getInitialData());

  const [selectedStudentName, setSelectedStudentName] = useState(authContext?.user?.role === 'student' ? authContext.user.name : studentData[0].studentInfo.name);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Matematika');
  const [selectedSemester, setSelectedSemester] = useState<Semester>('Mid Semester 1');
  const [adminView, setAdminView] = useState<AdminView>('Ujian');

  const studentNames = useMemo(() => studentData.map(s => s.studentInfo.name), [studentData]);
  
  const selectedStudentData = useMemo(() => {
    return studentData.find(s => s.studentInfo.name === selectedStudentName) || studentData[0];
  }, [studentData, selectedStudentName]);

  const calculateOverallTotalScore = useCallback((student: FullStudentData): number => {
    let totalAvgExamScore = 0;
    let totalNilaiProaktif = 0;
    let totalNilaiTugas = 0;

    MATA_PELAJARAN.forEach(subject => {
        const subjectData = student.subjects[subject];
        if (subjectData) {
            const examScores = Object.values(subjectData.examScores).filter(s => typeof s === 'number') as number[];
            const avgExamScore = examScores.length > 0 ? examScores.reduce((a, b) => a + b, 0) / examScores.length : 0;
            totalAvgExamScore += avgExamScore;

            const totalProaktif = subjectData.proactive.bertanya + subjectData.proactive.menjawab + subjectData.proactive.menambahkan;
            const nilaiProaktif = totalProaktif >= student.attendance.totalPertemuan ? 100 : 50;
            totalNilaiProaktif += nilaiProaktif;

            const nilaiTugas = subjectData.assignment.jumlah > 0 ? (subjectData.assignment.selesai / subjectData.assignment.jumlah) * 100 : 0;
            totalNilaiTugas += nilaiTugas;
        }
    });

    const avgNilaiUjian = totalAvgExamScore / MATA_PELAJARAN.length;
    const avgNilaiProaktif = totalNilaiProaktif / MATA_PELAJARAN.length;
    const avgNilaiTugas = totalNilaiTugas / MATA_PELAJARAN.length;
    
    const nilaiDaftarHadir = student.attendance.totalPertemuan > 0 ? (student.attendance.hadir / student.attendance.totalPertemuan) * 100 : 0;

    const finalScore = (avgNilaiUjian * 0.4) + (nilaiDaftarHadir * 0.1) + (avgNilaiProaktif * 0.2) + (avgNilaiTugas * 0.3);
    
    return finalScore;
  }, []);

  const calculateSubjectScore = useCallback((student: FullStudentData, subject: Subject): number => {
    const subjectData = student.subjects[subject];
    if (!subjectData) return 0;

    const examScores = Object.values(subjectData.examScores).filter(s => typeof s === 'number') as number[];
    const avgExamScore = examScores.length > 0 ? examScores.reduce((a, b) => a + b, 0) / examScores.length : 0;
    
    const nilaiUjian = avgExamScore;
    const nilaiDaftarHadir = student.attendance.totalPertemuan > 0 ? (student.attendance.hadir / student.attendance.totalPertemuan) * 100 : 0;
    
    const totalProaktif = subjectData.proactive.bertanya + subjectData.proactive.menjawab + subjectData.proactive.menambahkan;
    const nilaiProaktif = totalProaktif >= student.attendance.totalPertemuan ? 100 : 50;

    const nilaiTugas = subjectData.assignment.jumlah > 0 ? (subjectData.assignment.selesai / subjectData.assignment.jumlah) * 100 : 0;
    
    return (nilaiUjian * 0.4) + (nilaiDaftarHadir * 0.1) + (nilaiProaktif * 0.2) + (nilaiTugas * 0.3);
  }, []);

  const classRankings = useMemo(() => {
    return studentData.map(student => ({
      name: student.studentInfo.name,
      score: calculateOverallTotalScore(student)
    })).sort((a, b) => b.score - a.score);
  }, [studentData, calculateOverallTotalScore]);

  const subjectRankings = useMemo(() => {
      return studentData.map(student => ({
          name: student.studentInfo.name,
          score: calculateSubjectScore(student, selectedSubject)
      })).sort((a, b) => b.score - a.score);
  }, [studentData, selectedSubject, calculateSubjectScore]);

  const currentStudentClassRank = useMemo(() => {
    return classRankings.findIndex(r => r.name === selectedStudentName) + 1;
  }, [classRankings, selectedStudentName]);

  const currentStudentSubjectRank = useMemo(() => {
      return subjectRankings.findIndex(r => r.name === selectedStudentName) + 1;
  }, [subjectRankings, selectedStudentName]);

  const currentStudentSubjectScore = useMemo(() => {
      return calculateSubjectScore(selectedStudentData, selectedSubject);
  }, [selectedStudentData, selectedSubject, calculateSubjectScore]);

  const examChartData = useMemo(() => {
      return MATA_PELAJARAN.map(subject => ({
          name: subject,
          value: selectedStudentData.subjects[subject]?.examScores[selectedSemester] || 0
      }));
  }, [selectedStudentData, selectedSemester]);
  
  const proactiveChartData = selectedStudentData.subjects[selectedSubject]?.proactive;
  
  const assignmentScore = useMemo(() => {
      const assignment = selectedStudentData.subjects[selectedSubject]?.assignment;
      if (!assignment || assignment.jumlah === 0) return 0;
      return (assignment.selesai / assignment.jumlah) * 100;
  }, [selectedStudentData, selectedSubject]);

  const attendanceChartData = useMemo(() => studentData.map(s => ({
    name: s.studentInfo.name,
    value: s.attendance.totalPertemuan > 0 ? (s.attendance.hadir / s.attendance.totalPertemuan) * 100 : 0
  })).sort((a,b) => b.value - a.value), [studentData]);


  if (!authContext || !authContext.user) return null;
  const { user, logout } = authContext;

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://picsum.photos/seed/space/1920/1080')" }}>
      <div className="min-h-screen bg-black/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold font-orbitron text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">
            Assessment Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, <span className="font-bold text-white">{user.name}</span></span>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </header>

        <main className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
                {user.role === 'admin' && (
                    <Select value={selectedStudentName} onChange={setSelectedStudentName} options={studentNames} label="Select Student" />
                )}
                 <Select value={selectedSubject} onChange={setSelectedSubject} options={MATA_PELAJARAN} label="Select Subject" />
            </div>
            <div className="lg:col-span-3">
                 <Select value={selectedSemester} onChange={setSelectedSemester} options={SEMESTERS} label="Select Semester (for Exam Chart)" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 h-[450px]">
              {selectedStudentData && <StudentInfoCard 
                studentData={selectedStudentData} 
                totalScore={classRankings.find(r => r.name === selectedStudentName)?.score || 0} 
                classRank={currentStudentClassRank}
                subjectRank={currentStudentSubjectRank}
                subjectScore={currentStudentSubjectScore}
                />}
            </div>
            <div className="lg:col-span-3 h-[450px]">
              <Card title={`Hasil Ujian: ${selectedSemester}`}>
                <ExamResultsChart data={examChartData} />
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card title="Proaktif">
                {proactiveChartData && <ProactiveChart data={proactiveChartData} />}
            </Card>
             <Card title="Nilai Tugas">
                <AssignmentChart score={assignmentScore} />
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card title="Nilai Daftar Hadir"><AttendanceChart data={attendanceChartData} /></Card>
            <Card title="Ranking Kelas (Overall)"><RankingChart data={classRankings.map(r => ({ name: r.name, value: r.score }))} /></Card>
          </div>
          
          {user.role === 'admin' && (
            <Card title="Admin Panel: Update Data" className="mt-8">
                <div className="flex border-b border-cyan-500/30 mb-4">
                    {(['Ujian', 'Proaktif', 'Tugas', 'Daftar Hadir'] as AdminView[]).map(view => (
                        <button key={view} onClick={() => setAdminView(view)} className={`py-2 px-4 font-orbitron transition-colors ${adminView === view ? 'border-b-2 border-cyan-400 text-cyan-300' : 'text-gray-400 hover:text-white'}`}>
                            {view}
                        </button>
                    ))}
                </div>
                {adminView === 'Ujian' && <UpdateExamTable data={studentData} setData={setStudentData} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />}
                {adminView === 'Proaktif' && <UpdateProactiveTable data={studentData} setData={setStudentData} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />}
                {adminView === 'Tugas' && <UpdateAssignmentTable data={studentData} setData={setStudentData} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />}
                {adminView === 'Daftar Hadir' && <UpdateAttendanceTable data={studentData} setData={setStudentData} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />}
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
