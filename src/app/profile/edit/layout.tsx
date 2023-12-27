import React, { PropsWithChildren, Suspense } from "react";

import EditLoading from "./loading";

export default function EditLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<EditLoading />}>{children}</Suspense>;
}
