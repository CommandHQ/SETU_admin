import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, User2 } from 'lucide-react';
import ShineBorder from '@/components/ui/shine-border';
import { db } from '@/lib/db';

const NotificationCard = async () => {
  // Get the current timestamp for 24 hours ago
  const past24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Fetch both report count and new user count with Prisma
  const [reportCount, newUserCount] = await Promise.all([
    db.report.count({
      where: {
        createdAt: {
          gte: past24Hours,
        },
      },
    }),
    db.user.count({
      where: {
        createdAt: {
          gte: past24Hours,
        },
      },
    }),
  ]);

  return (
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Notifications and Alerts</CardTitle>
          <CardDescription className="text-gray-600">
            Recent system notifications and user reports
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-l-4 border-l-blue-500">
            <User2 className="h-4 w-4 text-blue-500" />
            <AlertTitle className="font-medium">New User Registration</AlertTitle>
            <AlertDescription className="text-sm">
              {newUserCount} new {newUserCount === 1 ? 'user' : 'users'} registered in the last 24 hours
            </AlertDescription>
          </Alert>

          <Alert 
            variant="destructive" 
            className="border-l-4 border-l-red-500"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-medium">Reported Content</AlertTitle>
            <AlertDescription className="text-sm">
              {reportCount} {reportCount === 1 ? 'post' : 'posts'} reported in the last 24 hours
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
  );
};

export default NotificationCard;