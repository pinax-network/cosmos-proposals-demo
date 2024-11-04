"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/injective");
  }, [router]);

  return <Loading />;
}
