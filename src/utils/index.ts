export const autoLoading = async (
  func: () => Promise<any>,
  setLoading: (state: boolean) => void
) => {
  setLoading(true);
  await func();
  setLoading(false);
};
