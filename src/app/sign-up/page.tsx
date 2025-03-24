"use client";
import { LoginForm } from "@/components/Form/login-form";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

export default function page() {
  const { data: session } = useSession();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
    <div className="w-full max-w-sm md:max-w-3xl">
      <LoginForm />
    </div>
  </div>
  );
}
