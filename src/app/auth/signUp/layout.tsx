import React, { PropsWithChildren, Suspense } from "react";

import SignUpLoading from "./loading";

const SignUpLayout = ({ children }: PropsWithChildren) => {
  return <Suspense fallback={<SignUpLoading />}>{children}</Suspense>;
};

export default SignUpLayout;
