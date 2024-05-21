import { prisma } from "@/db";
import { noop } from "@/utils/function";
import { StatusCodes } from "http-status-codes";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params: { imageId } }: { params: { imageId: string } },
) => {
  try {
    const image = await prisma.image
      .findUnique({ where: { id: imageId } })
      .catch(noop);

    if (!image?.value) {
      return new NextResponse(null, { status: StatusCodes.NOT_FOUND });
    }

    const headers = new Headers(request.headers);

    headers.set("Content-Type", image.mime);
    headers.set("Content-Length", image.value.length.toString());

    return new NextResponse(image.value, { headers });
  } catch {
    return new NextResponse(null, { status: StatusCodes.BAD_REQUEST });
  }
};
