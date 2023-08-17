import baseUrl from "../../utils/apiBaseUrl";

export const deleteComment = async (id: number) => {
  try {
    const response = await fetch(`${baseUrl}/comments/delete/${id}`, {
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
