export const autoLoading = (
  func: () => Promise<any>,
  setLoading: (state: boolean) => void
) => {
  return async () => {
    setLoading(true);
    await func();
    setLoading(false);
  };
};
