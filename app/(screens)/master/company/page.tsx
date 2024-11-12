// app/(screens)/master/company-master/page.tsx

"use client";

import CompanyMasterCrud from "@/components/adminmasters/companyMasterCrud";
import React from "react";

const CompanyMasterPage: React.FC = () => {
  return (
    <div className="w-full h-screen lg:px-10 mx-auto p-4 bg-slate-100">
      <CompanyMasterCrud />
    </div>
  );
};

export default CompanyMasterPage;