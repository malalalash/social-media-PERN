import apiBaseUrl from "../../utils/apiBaseUrl";

const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default loginUser;
