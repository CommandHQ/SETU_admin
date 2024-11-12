'use client';

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = () => {
      console.log("Logout page reached");
      signOut({ 
        callbackUrl: "/auth/login",
        redirect: true
      })
        .then(() => {
          console.log("Signout completed");
        })
        .catch((error) => {
          console.error("Error during signout:", error);
          router.push("/auth/login");
        });
    };

    performLogout();
  }, [router]);

  return <div>Logging out...</div>;
}
