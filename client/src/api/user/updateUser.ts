import baseUrl from "../../utils/apiBaseUrl";
import { UpdateUserType } from "../../types";

export const updateUser = async ({
  username,
  email,
  password,
}: UpdateUserType) => {
  try {
    const response = await fetch(`${baseUrl}/user/update`, {
      method: "PUT",
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
