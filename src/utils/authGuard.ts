import { getSession } from "@/app/internal-actions/auth";
import { getPathname, getSearchParam } from "@/app/internal-actions/url";
import { redirect } from "next/navigation";

export const authGuard = async (inverted?: "inverted") => {
  const pathname = getPathname();
  const redirectTo = getSearchParam("redirectTo");

  const session = await getSession();
  if (!inverted && !session?.user) {
    redirect(`/auth?redirectTo=${pathname}`);
  } else if (inverted && session?.user) {
    redirect(redirectTo ?? "/");
  }

  return session;
};
