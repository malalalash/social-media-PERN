import baseUrl from "../../utils/apiBaseUrl";

export const deleteUser = async () => {
  try {
    const response = await fetch(`${baseUrl}/user/delete`, {
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
