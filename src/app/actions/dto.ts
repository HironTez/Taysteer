export const response = <T>(data: T) => ({
  success: true as true,
  data,
});

export const error = <T extends object>(
  message: string,
  fields: [keyof T]
) => ({
  success: false as false,
  errors: [
    {
      message,
      path: fields,
    },
  ],
});
