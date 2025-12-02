import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { FullStudentData, ProactiveData, Semester, Student } from '../types';

const COLORS = ['#00E5FF', '#8E24AA', '#FF4081', '#FBC02D', '#4CAF50', '#D32F2F'];
const PROACTIVE_COLORS = ['#00E5FF', '#8E24AA', '#FF4081'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/80 p-2 border border-cyan-500/50 rounded-md">
        <p className="label text-white">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Exam Results Chart
interface ExamResultsChartProps {
  data: { name: string, value: number }[];
}
export const ExamResultsChart: React.FC<ExamResultsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8E24AA" stopOpacity={0.8}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
        <YAxis stroke="#9ca3af" />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.2)' }}/>
        <Bar dataKey="value" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Proactive Chart
interface ProactiveChartProps {
  data: ProactiveData;
}
export const ProactiveChart: React.FC<ProactiveChartProps> = ({ data }) => {
    const chartData = [
        { name: 'Bertanya', value: data.bertanya },
        { name: 'Menjawab', value: data.menjawab },
        { name: 'Menambahkan', value: data.menambahkan },
    ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={PROACTIVE_COLORS[index % PROACTIVE_COLORS.length]} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Assignment Chart
interface AssignmentChartProps {
  score: number;
}
export const AssignmentChart: React.FC<AssignmentChartProps> = ({ score }) => {
    const data = [{ name: 'Nilai Tugas', value: score, fill: '#00E5FF' }];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="60%" 
        outerRadius="90%" 
        barSize={20} 
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="value"
          angleAxisId={0}
        />
        <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-3xl font-bold"
        >
            {`${score.toFixed(0)}`}
        </text>
        <Tooltip />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};


// Shared component for Attendance and Ranking Charts
interface SortedBarChartProps {
    data: { name: string; value: number }[];
    yAxisLabel: string;
}

const SortedBarChart: React.FC<SortedBarChartProps> = ({ data, yAxisLabel }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleMouseEnter = (data: any, index: number) => {
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
                <XAxis dataKey="name" type="category" stroke="#9ca3af" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={70} />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.2)' }}/>
                <Bar dataKey="value" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {data.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            transform={activeIndex === index ? 'scale(1.05)' : 'scale(1)'}
                            style={{ transition: 'transform 0.2s ease-in-out', transformOrigin: 'center bottom' }}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

// Attendance Chart
interface AttendanceChartProps {
    data: { name: string; value: number }[];
}
export const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
    return <SortedBarChart data={data} yAxisLabel="Nilai Kehadiran" />;
};

// Ranking Chart
interface RankingChartProps {
    data: { name: string; value: number }[];
}
export const RankingChart: React.FC<RankingChartProps> = ({ data }) => {
    return <SortedBarChart data={data} yAxisLabel="Total Score" />;
};