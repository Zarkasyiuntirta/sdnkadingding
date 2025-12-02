
import React, { ReactNode } from 'react';
import { FullStudentData, Subject } from '../types';

interface CardProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '' }) => (
  <div className={`bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 shadow-lg animate-neon-pulse ${className}`}>
    <h3 className="text-lg font-bold font-orbitron text-cyan-300 mb-4">{title}</h3>
    <div className="h-full">{children}</div>
  </div>
);

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
  label: string;
}

export function Select<T extends string>({ value, onChange, options, label }: SelectProps<T>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export const AnimatedLogo: React.FC = () => (
    <div className="w-24 h-24 bg-cyan-900/50 rounded-full flex items-center justify-center border-2 border-cyan-400 animate-[spin_10s_linear_infinite]">
      <span className="font-orbitron text-2xl font-bold text-cyan-300">SDN</span>
    </div>
);


interface StudentInfoCardProps {
    studentData: FullStudentData;
    totalScore: number;
    classRank: number;
    subjectScore: number;
    subjectRank: number;
}

export const StudentInfoCard: React.FC<StudentInfoCardProps> = ({ studentData, totalScore, classRank, subjectScore, subjectRank }) => {
    return (
        <Card title="Student Profile" className="h-full">
            <div className="flex flex-col items-center justify-center h-full text-center">
                <img src={studentData.studentInfo.photo} alt={studentData.studentInfo.name} className="w-24 h-24 rounded-full border-4 border-cyan-400 mb-4" />
                <h4 className="text-xl font-bold text-white">{studentData.studentInfo.name}</h4>
                <p className="text-gray-400">NIM: {studentData.studentInfo.nim}</p>
                <div className="mt-4 w-full space-y-2">
                    <div className="flex justify-between text-md bg-gray-700/50 p-2 rounded-md">
                        <span className="font-semibold text-cyan-300">Ranking Mapel:</span>
                        <span className="font-bold text-white">#{subjectRank}</span>
                    </div>
                    <div className="flex justify-between text-md bg-gray-700/50 p-2 rounded-md">
                        <span className="font-semibold text-cyan-300">Nilai Mapel:</span>
                        <span className="font-bold text-white">{subjectScore.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-md bg-gray-700/50 p-2 rounded-md">
                        <span className="font-semibold text-cyan-300">Ranking Kelas:</span>
                        <span className="font-bold text-white">#{classRank}</span>
                    </div>
                    <div className="flex justify-between text-md bg-gray-700/50 p-2 rounded-md">
                        <span className="font-semibold text-cyan-300">Total Score:</span>
                        <span className="font-bold text-white">{totalScore.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};