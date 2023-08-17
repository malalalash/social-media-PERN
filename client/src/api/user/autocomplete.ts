import baseUrl from "../../utils/apiBaseUrl";

export const autocomplete = async (query: string) => {
  try {
    const response = await fetch(
      `${baseUrl}/users/autocomplete?search=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
