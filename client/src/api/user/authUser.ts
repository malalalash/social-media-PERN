import baseUrl from "../../utils/apiBaseUrl";

const checkAuth = async () => {
  try {
    const response = await fetch(`${baseUrl}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default checkAuth;
