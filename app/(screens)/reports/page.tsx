"use client";
import { Suspense, useState, useEffect } from 'react';
import ReportDetails from '@/components/reports/ReportDetails';
import ReportsTable from '@/components/reports/ReportsTable';
import { getReports } from '@/services/Reports/reportActions';
import { ClipboardList } from 'lucide-react';
import AnalyticsCard from "@/components/common/moduleAnalyticscard";
import { Report } from '@/types';

// Loading skeleton component
const TableSkeleton = () => (
  <div className="flex items-center justify-center p-8">
    <div className="space-y-4 w-full">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded-md w-full"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    total: 0,
    thisMonth: 0,
    recentUpdates: 0
  });

  // Calculate analytics data
  const calculateAnalytics = (reportsData : Report) => {
    if (!reportsData || !Array.isArray(reportsData)) return analytics;

    const total = reportsData.length;
    const currentMonth = new Date().getMonth();
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const thisMonth = reportsData.filter(report => {
      const reportDate = new Date(report.createdAt);
      return reportDate.getMonth() === currentMonth;
    }).length;

    const recentUpdates = reportsData.filter(report => {
      const updateDate = new Date(report.updatedAt);
      return updateDate > oneWeekAgo;
    }).length;

    return { total, thisMonth, recentUpdates };
  };

  // Fetch reports data
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const fetchedReports = await getReports();
        
        if (fetchedReports && Array.isArray(fetchedReports)) {
          setReports(fetchedReports as Report[]);
          const newAnalytics = calculateAnalytics(fetchedReports as unknown as Report);
          setAnalytics(newAnalytics);
        } else {
          console.error('Invalid reports data received:', fetchedReports);
          setReports([]);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto p-2 sm:p-6 w-full">
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="md:p-10 h-screen p-2 sm:p-6 w-full bg-slate-100">
      {/* Analytics Cards */}
      {!loading && analytics && (
        <div className="mb-6">
          <AnalyticsCard
            total={analytics.total}
            thisMonth={analytics.thisMonth}
            recentUpdates={analytics.recentUpdates}
          />
        </div>
      )}

      {/* Reports Table with DataTable Component */}
      <Suspense fallback={<TableSkeleton />}>
        <ReportsTable 
          initialReports={reports}
        />
      </Suspense>
    </div>
  );
}