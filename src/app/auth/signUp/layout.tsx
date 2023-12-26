import React, { PropsWithChildren, Suspense } from "react";

import SignUpLoading from "./loading";

export default function SignUpLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<SignUpLoading />}>{children}</Suspense>;
}
