import baseUrl from "../../utils/apiBaseUrl";

export const getFollowed = async (id: number) => {
  try {
    const response = await fetch(`${baseUrl}/followed/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
