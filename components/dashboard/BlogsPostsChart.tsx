// BlogsPostsChart.tsx
"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getTopCoursesData } from "@/services/AdminDashboard/getTopCoursesData";
import { Album } from "lucide-react";

interface ChartData {
  name: string;
  enrollments: number;
  revenue: number;
}

const BlogsPostsChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTopCoursesData();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching course sales data:", error);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-sm">{label}</p>
          <p className="text-purple-500 text-sm">
            Enrollments: {payload[0].value}
          </p>
          <p className="text-pink-500 text-sm">
            Revenue: ${payload[1].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format long names
  const formatXAxisLabel = (label: string) => {
    return label.length > 15 ? `${label.substring(0, 12)}...` : label;
  };

  return (
    <div className="bg-white rounded-lg p-4 h-full shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Top Selling Courses</h1>
        <Album/>
      </div>
      <div className="h-[calc(100%)]"> {/* Adjust height to account for header */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            barSize={20}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }} // Increased bottom margin
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ 
                fill: "#3e4042",
                fontSize: 12,
                width: 100,
                textAnchor: 'end',
                dy: 10
              }}
              tickFormatter={formatXAxisLabel}
              tickLine={false}
              interval={0}
              height={60}
            />
            <YAxis 
              axisLine={false} 
              tick={{ fill: "#3e4042", fontSize: 12 }} 
              tickLine={false}
              yAxisId="left"
              width={60}
            />
            <YAxis 
              axisLine={false} 
              tick={{ fill: "#3e4042", fontSize: 12 }} 
              tickLine={false}
              yAxisId="right"
              orientation="right"
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              align="center"
              verticalAlign="top"
              wrapperStyle={{ 
                paddingTop: "10px",
                paddingBottom: "20px",
                fontSize: "12px"
              }}
            />
            <Bar
              dataKey="enrollments"
              fill="#a78ced"
              legendType="circle"
              radius={[10, 10, 0, 0]}
              yAxisId="left"
              name="Enrollments"
            />
            <Bar
              dataKey="revenue"
              fill="#f78398"
              legendType="circle"
              radius={[10, 10, 0, 0]}
              yAxisId="right"
              name="Revenue ($)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BlogsPostsChart;