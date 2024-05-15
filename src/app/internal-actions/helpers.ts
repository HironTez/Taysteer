export const getCreateImageVariable = async (image: File | undefined) => {
  if (!image) return {};

  const mime = image.type;
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return {
    create: {
      value: buffer,
      mime,
    },
  };
};
