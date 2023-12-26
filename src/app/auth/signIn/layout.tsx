import React, { PropsWithChildren, Suspense } from "react";

import SignInLoading from "./loading";

const SignInLayout = ({ children }: PropsWithChildren) => {
  return <Suspense fallback={<SignInLoading />}>{children}</Suspense>;
};

export default SignInLayout;
