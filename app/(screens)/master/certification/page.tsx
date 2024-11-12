// app/(screens)/master/certificationmaster/page.tsx

"use client";

import React from "react";
import CertificationMasterCrud from "@/components/adminmasters/CertificationMasterCrud";

const CertificationMasterPage: React.FC = () => {
  return (
    <div className="w-full h-screen lg:px-10 mx-auto p-4 bg-slate-100">
      <CertificationMasterCrud />
    </div>
  );
};

export default CertificationMasterPage;