import React, { PropsWithChildren, Suspense } from "react";

import AuthLoading from "./loading";

export default function AuthLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<AuthLoading />}>{children}</Suspense>;
}
