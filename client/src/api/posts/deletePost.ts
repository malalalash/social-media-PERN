import baseUrl from "../../utils/apiBaseUrl";

export const deletePost = async ({
  id,
  public_id,
}: {
  id: number;
  public_id: string | null;
}) => {
  try {
    const response = await fetch(`${baseUrl}/post/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        public_id,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
