"use client"
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { getUserStats } from '@/services/AdminDashboard/getUserStats';


const UserOverview = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userData, setUserData] = useState([
    { name: 'Veteran', value: 0, color: '#ed1f17' },
    { name: 'Serving', value: 0, color: '#009efa' },
    { name: 'Spouse', value: 0, color: '#f4bc2b' },
    { name: 'Civilian', value: 0, color: '#b0b0eb' },
  ]);

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const stats = await getUserStats();
        setUserData([
          { name: 'Veteran', value: stats.VETERAN, color: '#ed1f17' },
          { name: 'Serving', value: stats.SERVING, color: '#009efa' },
          { name: 'Spouse', value: stats.SPOUSE, color: '#f4bc2b' },
          { name: 'Civilian', value: stats.CIVILIAN, color: '#b0b0eb' },
        ]);
      } catch (error) {
        console.error('Failed to load user statistics:', error);
      }
    };

    loadUserStats();
  }, []);

  const renderActiveShape = (props:any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-xl font-bold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={payload.color}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={payload.color}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={payload.color}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={payload.color} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          className="text-sm"
        >
          {`${value.toLocaleString()} Users`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
          className="text-xs"
        >
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">User Overview</CardTitle>
        <Users />
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={userData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {userData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserOverview;