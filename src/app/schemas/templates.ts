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

export const image = (prefix?: string, suffix?: string) =>
  zfd.file(
    z
      .instanceof(File)
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        `${prefix} image max file size is 20MB. ${suffix}`,
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        `${prefix} image should be in one of the following formats: [.jpg, .jpeg, .png, .svg, .webp]. ${suffix}`,
      ),
  );

export const string = (max: number, prefix?: string, suffix?: string) =>
  zfd.text(
    z
      .string()
      .max(
        max,
        `${prefix}can be maximal ${max} characters long. ${suffix}`
          .trim()
          .toLocaleUpperCase(),
      ),
  );

export const title = (prefix?: string, suffix?: string) =>
  string(50, `${prefix} title`.trimStart(), suffix);

export const description = (prefix?: string, suffix?: string) =>
  string(500, `${prefix} description`.trimStart(), suffix);
