import React, { Suspense } from "react";

import Auth from "./page";
import AuthLoading from "./loading";

const AuthLayout = () => {
  return (
    <Suspense fallback={<AuthLoading />}>
      <Auth />
    </Suspense>
  );
};

export default AuthLayout;
