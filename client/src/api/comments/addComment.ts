import baseUrl from "../../utils/apiBaseUrl";

export const addComment = async ({
  content,
  postId,
}: {
  content: string;
  postId: number;
}) => {
  try {
    const response = await fetch(`${baseUrl}/comments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        postId,
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
