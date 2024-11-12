"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";


const CountChart = ({boys,girls}:{boys:number,girls:number}) => {
    const data = [
        {
          name: "Total",
          count: boys+girls,
          fill: "white",
        },
        {
          name: "Womens",
          count: girls,
          fill: "#FE8FB5",
        },
        {
          name: "Mens",
          count: boys,
          fill: "#A07CFE",
        },
      ];
  return (
    <div className='relative w-full h-[75%] '>
        <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
            <RadialBar
                
                background
                dataKey="count"
            />
            </RadialBarChart>
        </ResponsiveContainer>
        <Image src="/menwomen.png" alt='' height={50} width={50} className='absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2'  />
        </div>
  );
};

export default CountChart;