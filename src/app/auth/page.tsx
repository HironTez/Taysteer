import AuthClient from "./client";
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Auth = async () => {
  // Exit the page if already logged in
  const session = await getServerSession();
  if (session) return redirect("/");

  return <AuthClient />;
};

export default Auth;
