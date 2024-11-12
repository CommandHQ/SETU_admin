import React from 'react';
import { Card } from '@/components/ui/card';
import { User, Clock, ArrowUpRight } from 'lucide-react';
import NumberTicker from "../ui/number-ticker"
import { db } from '@/lib/db';

// Define async functions to get counts from the database
const users = async () => {
  return await db.user.count();
};

const posts = async () => {
  return await db.post.count();
};

const admins = async () => {
  return await db.user.count({
    where: {
      role: "admin",
    },
  });
};

const jobs = async () => {
  return await db.job.count();
};;

const getIconByType = (type: string) => {
  switch (type) {
    case 'Total User':
      return <User className="h-5 w-5 text-blue-500" />;
    case 'Total Post':
      return <Clock className="h-5 w-5 text-green-500" />;
    case 'Total Admin':
      return <ArrowUpRight className="h-5 w-5 text-purple-500" />;
    default:
      return <User className="h-5 w-5 text-blue-500" />;
  }
};

const getColorByType = (type: string) => {
  switch (type) {
    case 'Total User':
      return 'bg-blue-50';
    case 'Total Post':
      return 'bg-green-50';
    case 'Total Admin':
      return 'bg-purple-50';
    default:
      return 'bg-blue-50';
  }
};

const getPercentageByType = (type: string) => {
  switch (type) {
    case 'Total User':
      return '+12%';
    case 'Total Post':
      return '+8%';
    case 'Total Admin':
      return '+15%';
    default:
      return '+10%';
  }
};

const getDescriptionByType = (type: string) => {
  switch (type) {
    case 'Total User':
      return 'Available entries';
    case 'Total Post':
      return 'New entries this month';
    case 'Total Admin':
      return 'Updated in last 7 days';
    default:
      return 'Total entries';
  }
};

const StatsCard = async ({ type }: { type: string }) => {
  let count = 1;
  if (type === "Total User") {
    count = await users();
  } else if (type === "Total Post") {
    count = await posts();
  } else if (type === "Total Admin") { 
    count = await admins();
  } else if (type === "Total Job") {
    count = await jobs();
  }

  return (
    <Card className="p-6 flex-1 bg-white shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium mb-6">{type}</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <NumberTicker 
                value={count} 
                className="text-4xl font-semibold" 
              />
            </div>
            <p className="text-sm text-gray-500">
              {getDescriptionByType(type)}
            </p>
          </div>
        </div>
        <div className={`rounded-full p-3 ${getColorByType(type)}`}>
          {getIconByType(type)}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;