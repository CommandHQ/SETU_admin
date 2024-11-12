// app/(screens)/master/jobtitle-master/page.tsx

"use client";

import React from "react";
import JobtitleMasterCrud from "@/components/adminmasters/JobtitleMasterCrud";

const JobtitleMasterPage: React.FC = () => {
  return (
    <div className="w-full h-screen lg:px-10 mx-auto p-4 bg-slate-100">
      <JobtitleMasterCrud />
    </div>
  );
};

export default JobtitleMasterPage;