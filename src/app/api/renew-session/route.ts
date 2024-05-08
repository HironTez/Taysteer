import { NextResponse } from "next/server";
import { renewSession } from "../../internal-actions/auth";

export const GET = async () => {
  const cookieList = await renewSession();

  return NextResponse.json(cookieList);
};
