export const getFromSessionStorage = (key: string): string | null => {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setToSessionStorage = (key: string, value: string | number | null): void => {
  sessionStorage.setItem(key, JSON.stringify(value));
};
