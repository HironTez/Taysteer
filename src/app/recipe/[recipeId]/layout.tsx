import React, { PropsWithChildren, Suspense } from "react";

import RecipeLoading from "./loading";

export default function RecipeLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<RecipeLoading />}>{children}</Suspense>;
}
