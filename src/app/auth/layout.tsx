import React, { PropsWithChildren, Suspense } from "react";

import AuthLoading from "./loading";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return <Suspense fallback={<AuthLoading />}>{children}</Suspense>;
};

export default AuthLayout;
