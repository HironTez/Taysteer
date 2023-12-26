import React, { PropsWithChildren, Suspense } from "react";

import _ComponentName_Loading from "./loading";

export default function _ComponentName_Layout({ children }: PropsWithChildren) {
  return <Suspense fallback={<_ComponentName_Loading />}>{children}</Suspense>;
}
