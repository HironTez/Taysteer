import React, { PropsWithChildren, Suspense } from "react";

import _ComponentName_Loading from "./loading";

const _ComponentName_Layout = ({ children }: PropsWithChildren) => {
  return <Suspense fallback={<_ComponentName_Loading />}>{children}</Suspense>;
};

export default _ComponentName_Layout;
