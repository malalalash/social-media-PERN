import baseUrl from "../../utils/apiBaseUrl";

const logout = async () => {
  try {
    const response = await fetch(`${baseUrl}/logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error(error);
  }
};

export default logout;
