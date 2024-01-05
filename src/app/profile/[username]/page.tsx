import React from "react";
import { Profile } from "../Profile";

type ProfileByUsernameProps = {
  params: { username: string };
};

export default function ProfileByUsername({ params }: ProfileByUsernameProps) {
  return <Profile username={params.username} />;
}
