import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getUrl = () => {
  const headersList = headers();
  return headersList.get("x-url")!;
};

export const getPathname = () => {
  const headersList = headers();
  return headersList.get("x-pathname")!;
};

export const getSearchParam = (name: string) => {
  const headersList = headers();
  const search = headersList.get("x-search");
  if (!search) return null;

  const searchParams = new URLSearchParams(search);
  return searchParams.get(name);
};

export const revalidatePage = () => {
  revalidatePath(getUrl(), "page");
};
