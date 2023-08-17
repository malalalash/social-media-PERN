import baseUrl from "../../utils/apiBaseUrl";

export const updateBg = async ({ image }: { image: string }) => {
  try {
    const response = await fetch(`${baseUrl}/upload/background`, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        image,
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
