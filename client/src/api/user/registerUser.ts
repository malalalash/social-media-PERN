import apiBaseUrl from "../../utils/apiBaseUrl";

const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await fetch(`${apiBaseUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
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

export default registerUser;
