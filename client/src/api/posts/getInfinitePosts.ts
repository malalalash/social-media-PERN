import baseUrl from "../../utils/apiBaseUrl";

export const getInfinitePosts = async (pageParam: number, limit: number) => {
  try {
    const response = await fetch(
      `${baseUrl}/post/?page=${pageParam}?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
