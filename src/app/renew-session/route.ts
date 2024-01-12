import { NextResponse } from "next/server";
import { renewSession } from "../internal-actions/auth";

export const GET = async () => {
  await renewSession();

  return new NextResponse();
};
