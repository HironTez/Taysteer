import React from "react";
import Profile from "../page";

type ProfileByUsernameProps = {
  params: { username: string };
};

export default async function ProfileByUsername({
  params,
}: ProfileByUsernameProps) {
  return <Profile username={params.username} />;
}
