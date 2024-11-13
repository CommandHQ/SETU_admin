// app/(screens)/master/university-master/page.tsx

"use client";

import UniversityMasterCrud from "@/components/adminmasters/UniversitymasterCrud";
import React from "react";

const UniversityMasterPage: React.FC = () => {
  return (
    <div className="w-full h-full lg:px-10 mx-auto p-4 bg-slate-100">
      <UniversityMasterCrud />
    </div>
  );
};

export default UniversityMasterPage;