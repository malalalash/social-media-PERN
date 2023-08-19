import baseUrl from "../../utils/apiBaseUrl";

export const getComments = async (id: number) => {
  try {
    const response = await fetch(`${baseUrl}/comments?postId=${id}`, {
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
