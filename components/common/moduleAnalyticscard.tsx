import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Clock, TrendingUp } from 'lucide-react';

interface AnalyticsCardProps {
  total: number;
  thisMonth: number;
  recentUpdates: number;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ total, thisMonth, recentUpdates }) => {
  const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
  };

  const cards = [
    {
      title: "Total Entries",
      value: total,
      icon: Award,
      description: "Available entries",
      color: "bg-blue-500",
    },
    {
      title: "Added This Month",
      value: thisMonth,
      icon: Clock,
      description: "New entries this month",
      color: "bg-green-500",
    },
    {
      title: "Recent Updates",
      value: recentUpdates,
      icon: TrendingUp,
      description: "Updated in last 7 days",
      color: "bg-purple-500",
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8 ">
      {cards.map((card, index) => (
        <Card 
          key={index}
          className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white"
        >
          <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full ${card.color}`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium tracking-wide">
              {card.title}
            </CardTitle>
            <card.icon className={`h-5 w-5 ${card.color.replace('bg-', 'text-')} transition-transform duration-300 hover:scale-110`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold">{formatNumber(card.value)}</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
              <div className="h-1 w-16 rounded-full bg-gray-100 overflow-hidden">
                <div 
                  className={`h-full ${card.color} transition-all duration-500`} 
                  style={{ width: '75%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsCard;