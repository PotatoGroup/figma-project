const BASE_URL = "https://api.figma.com/v1";

export const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, options);
  return response.json() as T;
};