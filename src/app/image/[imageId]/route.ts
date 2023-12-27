import { prisma } from "@/db";
import { StatusCodes } from "http-status-codes";

export const GET = async (
  _request: Request,
  { params: { imageId } }: { params: { imageId: string } },
) => {
  try {
    const image = await prisma.image.findUnique({ where: { id: imageId } });
    if (image?.value) return new Response(image.value);
  } catch {
    return new Response(null, { status: StatusCodes.BAD_REQUEST });
  }
  return new Response(null, { status: StatusCodes.NOT_FOUND });
};
