import baseUrl from "../../utils/apiBaseUrl";

export const getUser = async (userId: number) => {
  try {
    const response = await fetch(`${baseUrl}/user/${userId}`, {
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
