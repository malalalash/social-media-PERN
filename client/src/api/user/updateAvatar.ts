import baseUrl from "../../utils/apiBaseUrl";

export const updateAvatar = async ({ image }: { image: string }) => {
  try {
    const response = await fetch(`${baseUrl}/upload/avatar`, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        avatar: image,
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
