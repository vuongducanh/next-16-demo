"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = () => {
      router.replace("/login");
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [router]);

  return null;
}
