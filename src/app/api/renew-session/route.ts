import { NextResponse } from "next/server";
import { renewSession } from "../../internal-actions/auth";

export const POST = async (req: Request) => {
  const data = await req.text();
  if (data === process.env.AUTH_SECRET) {
    const cookieList = await renewSession();

    return NextResponse.json(cookieList);
  }

  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
};
