// app/(screens)/master/fieldofstudy-master/page.tsx

"use client";

import React from "react";
import FieldofstudyMasterCrud from "@/components/adminmasters/FieldofstudyMasterCrud";

const FieldofstudyMasterPage: React.FC = () => {
  return (
    <div className="w-full h-full lg:px-10 mx-auto p-4 bg-slate-100">
      <FieldofstudyMasterCrud />
    </div>
  );
};

export default FieldofstudyMasterPage;