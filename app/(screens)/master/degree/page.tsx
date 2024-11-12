// app/(screens)/master/degree-master/page.tsx

"use client";

import React from "react";
import DegreeMasterCrud from "@/components/adminmasters/DegreeMasterCrud";

const DegreeMasterPage: React.FC = () => {
  return (
    <div className="w-full h-screen lg:px-10 mx-auto p-4 bg-slate-100">
      <DegreeMasterCrud />
    </div>
  );
};

export default DegreeMasterPage;