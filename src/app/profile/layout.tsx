import React, { PropsWithChildren, Suspense } from "react";

import ProfileLoading from "./loading";

export default function ProfileLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<ProfileLoading />}>{children}</Suspense>;
}
