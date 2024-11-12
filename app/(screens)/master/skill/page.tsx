// app/(screens)/master/skill-master/page.tsx

"use client";

import SkillMasterCrud from "@/components/adminmasters/SkillMasterCrud";
import React from "react";

const SkillMasterPage: React.FC = () => {
  return (
    <div className="w-full h-screen lg:px-10 mx-auto p-4 bg-slate-100">
      <SkillMasterCrud />
    </div>
  );
};

export default SkillMasterPage;