"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UIExample: React.FC = () => {
  const [value, setValue] = useState("");

  const handleClick = () => {
    alert(`Button clicked! Input Value: ${value}`);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <Input
        placeholder="Enter something..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <Button size="default" onClick={handleClick}>
        Click Me
      </Button>
    </div>
  );
};

export default UIExample;