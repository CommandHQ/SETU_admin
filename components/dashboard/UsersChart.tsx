"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getUserData } from "@/services/AdminDashboard/getUserData";
import { Activity } from "lucide-react";

type UserData = {
  name: string;
  users: number;
};

const UsersChart = () => {
  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData();
        const formattedData = data.map((item: { name: string; users: unknown }) => ({
          name: item.name,
          users: Number(item.users),
        }));
        setUserData(formattedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Active Users</h1>
        <Activity/>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={userData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsersChart;
