"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Unauthorized() {
  const router = useRouter();

  useEffect(() => {
    toast.error("You are not authorized to access this page");
    setTimeout(() => {
      router.push("/auth/login");
    }, 3000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
        <p className="text-gray-500">Redirecting to login page...</p>
      </div>
    </div>
  );
}