import React from "react";
import { Edit } from "../../edit/Edit";

type EditByUsernameProps = {
  params: { username: string };
};

export default function EditByUsername({ params }: EditByUsernameProps) {
  return <Edit username={params.username} />;
}
