export const urlMoveDownPath = (url: string) => {
  return url.replace(/\/[A-Za-z0-9\$\-\_\.\+\!\ \*\'\(\)]+(\/)?($|\?)/, "");
};

export const urlAddToPath = (url: string, pathToAdd: string) => {
  return url.replace(
    /(?<=[A-Za-z0-9\$\-\_\.\+\!\ \*\'\(\)])(\/)?(?=$|\?)/,
    `/${pathToAdd.replace(/^\//, "")}`,
  );
};
