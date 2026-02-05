import React from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | MetronicCloud",
  description: "Securely sign in to your MetronicCloud account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
