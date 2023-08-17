import baseUrl from "../../utils/apiBaseUrl";

export const updatePost = async ({
  postId,
  description,
}: {
  postId: number;
  description: string;
}) => {
  try {
    const response = await fetch(`${baseUrl}/post/update/${postId}`, {
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
