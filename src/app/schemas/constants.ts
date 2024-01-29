import { z } from "zod";
import { zfd } from "zod-form-data";

const MAX_FILE_SIZE = 2000000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const imageObject = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 20MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    ".jpg, .jpeg, .png, svg and .webp files are accepted.",
  );

export const image = zfd.file(imageObject);

export const imageOptional = zfd.file(imageObject.optional());
