import React, { PropsWithChildren, Suspense } from "react";

import SignInLoading from "./loading";

export default function SignInLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<SignInLoading />}>{children}</Suspense>;
}
