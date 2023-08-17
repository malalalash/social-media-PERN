import baseUrl from "../../utils/apiBaseUrl";

export const addPost = async ({
  description,
  image,
}: {
  description: string;
  image: string | null;
}) => {
  try {
    const response = await fetch(`${baseUrl}/post/create`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        description,
        img: image,
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
