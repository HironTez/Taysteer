import { headers } from "next/headers";

export const getUrl = () => {
  const headersList = headers();
  const url = headersList.get("x-url")!;

  return url;
};

export const getPathname = () => {
  const headersList = headers();
  const pathname = headersList.get("x-pathname")!;

  return pathname;
};

export const getSearchParam = (name: string) => {
  const headersList = headers();
  const search = headersList.get("x-search");
  if (!search) return null;

  const searchParams = new URLSearchParams(search);
  const searchParam = searchParams.get(name);

  return searchParam;
};
