import React, { Suspense } from "react";

import _ComponentName_ from "./page";
import _ComponentName_Loading from "./loading";

const _ComponentName_Layout = () => {
  return (
    <Suspense fallback={<_ComponentName_Loading />}>
      <_ComponentName_ />
    </Suspense>
  );
};

export default _ComponentName_Layout;
