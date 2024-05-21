import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

export const newUrl = (path: string, url?: string) => {
  if (!url) url = getUrl();

  const suffix = url.endsWith("/") ? "" : "/";
  return new URL(path, url.concat(suffix)).href;
};

export const revalidatePage = () => {
  revalidatePath(getUrl(), "page");
};

export const redirectPreserveSearchParams: (url: string) => never = (
  url: string,
) => {
  const redirectTo = getSearchParam("redirectTo");
  redirect(`${url}${redirectTo ? `?redirectTo=${redirectTo}` : ""}`);
};
