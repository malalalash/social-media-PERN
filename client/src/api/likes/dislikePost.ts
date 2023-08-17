import baseUrl from "../../utils/apiBaseUrl";

export const dislikePost = async (id: number) => {
  try {
    const response = await fetch(`${baseUrl}/post/${id}/dislike`, {
      method: "DELETE",
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
