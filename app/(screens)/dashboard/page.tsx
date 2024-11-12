import UserCard from "@/components/dashboard/UseCard";
import BlogsPostsChart from "@/components/dashboard/BlogsPostsChart";
import UsersChart from "@/components/dashboard/UsersChart";
import NotificationCard from "@/components/dashboard/NotificationCard";
import CountChartContainer from "@/components/dashboard/CountChartContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import UserOverview from "@/components/dashboard/UserOverview";


const AdminPage =async () => {
  const session = await getServerSession(authOptions);
    console.log(session);
  return (
    <div className="p-6 pt-10 flex gap-4 flex-col md:flex-row bg-slate-100">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Total Admin" />
          <UserCard type="Total User" />
          <UserCard type="Total Post" />
          <UserCard type="Total Job" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="w-full h-[500px]">
          <UsersChart />
        </div>
        {/* BOTTOM CHART */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <BlogsPostsChart />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
      <div>
      <NotificationCard />
      </div>
        <div>
          <UserOverview/>
        </div>
      </div>

    </div>
  );
};

export default AdminPage;