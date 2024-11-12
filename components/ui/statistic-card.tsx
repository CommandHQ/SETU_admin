import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatisticCardProps {
  title: string;
  value: number;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({ title, value }) => {
  return (
    <Card className="bg-blue-50">
      <CardHeader>
        <CardTitle className="text-sm text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
      </CardContent>
    </Card>
  );
};