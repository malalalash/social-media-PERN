import baseUrl from "../../utils/apiBaseUrl";

export const getLikes = async (id: number) => {
  try {
    const response = await fetch(`${baseUrl}/likes?postId=${id}`, {
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
