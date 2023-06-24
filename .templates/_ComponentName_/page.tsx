import React from "react";
import _ComponentName_Client from "./client";
import { getServerSession } from "next-auth";

const _ComponentName_ = async () => {
  const session = await getServerSession();

  return <_ComponentName_Client session={session} />;
};

export default _ComponentName_;
