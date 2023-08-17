import baseUrl from "../../utils/apiBaseUrl";

export const updateComment = async ({
  commentId,
  description,
}: {
  commentId: number;
  description: string;
}) => {
  try {
    const response = await fetch(`${baseUrl}/comments/update/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
