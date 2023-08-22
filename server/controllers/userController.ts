import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import pool from "../db";
import generateToken from "../utils/generateToken";
import { uploadImage } from "../cloudinary";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // check if user alreaady exists
    const isUser = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (isUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
        status: 400,
      });

      // check if all fields are filled
    }
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        status: 400,
      });

      // check if email is valid
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email",
        status: 400,
      });

      // check if username is valid
    }
    if (!validator.isAlphanumeric(username)) {
      return res.status(400).json({
        message: "Username should contain only letters and numbers",
        status: 400,
      });

      // check if password is strong
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
        status: 400,
      });
    }
    // if everything is ok hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // then create user and generate token

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;",
      [username, email, hashedPassword]
    );

    const userId = newUser.rows[0].id;
    const getUser = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (getUser.rows.length > 0) {
      const avatar = getUser.rows[0].avatar;
      const bg_img = getUser.rows[0].bg_img;
      const payload = {
        userId,
      };

      generateToken(res, payload);
      return res.status(201).json({
        user: { username, email, id: userId, avatar, bg_img },
      });
    } else {
      res.status(500).json({
        message: "An error occurred while creating the user",
        status: 500,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while creating the user",
      status: 500,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const isUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (isUser.rows.length > 0) {
      const user = isUser.rows[0].username;
      const userId = isUser.rows[0].id;
      const avatar = isUser.rows[0].avatar;
      const bg_img = isUser.rows[0].bg_img;
      const storedPassword = isUser.rows[0].password;
      const isPasswordMatch = await bcrypt.compare(password, storedPassword);

      if (isPasswordMatch) {
        const payload = {
          userId,
        };
        generateToken(res, payload);
        res.status(200).json({
          username: user,
          email,
          id: userId,
          avatar,
          bg_img,
        });
      } else {
        res.status(400).json({
          message: "Invalid email or password",
        });
      }
    } else {
      res.status(400).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while logging in",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: "getinhere.pl",
    expires: new Date(0),
    maxAge: 0,
  });

  res.status(200).json({
    status: "success",
    message: "User logged out",
  });
};

export const getUser = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    id: user?.id,
    username: user?.username,
    email: user?.email,
    avatar: user?.avatar,
    bg_img: user?.bg_img,
  });
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        message: "Please provide image",
      });
    }

    const response = await uploadImage(avatar);
    const imageURL = response?.secure_url;

    const updateAvatar = await pool.query(
      `UPDATE users SET avatar = $1 WHERE id = $2`,
      [imageURL, userId]
    );
    return res.status(200).json({
      message: "Avatar updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateBgImg = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        message: "Please provide image",
      });
    }

    const response = await uploadImage(image);
    const imageURL = response?.secure_url;

    const updateBgImage = await pool.query(
      `UPDATE users SET bg_img = $1 WHERE id = $2`,
      [imageURL, userId]
    );
    return res.status(200).json({
      message: "Background image updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const defaultName = req.user?.username;
    const defaultEmail = req.user?.email;
    const { username, email, password } = req.body;

    let updateFields: string[] = [];
    let updateValues: (string | number)[] = [];

    // check if username is valid
    if (username) {
      if (!validator.isAlphanumeric(username)) {
        return res.status(400).json({
          message: "Username should contain only letters and numbers",
          status: 400,
        });
      }
      updateFields.push("username = $1");
      updateValues.push(username);
    } else {
      updateFields.push("username = $1");
      updateValues.push(defaultName);
    }
    // check if email is valid
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          message: "Invalid email",
          status: 400,
        });
      }
      updateFields.push("email = $2");
      updateValues.push(email);
    } else {
      updateFields.push("email = $2");
      updateValues.push(defaultEmail);
    }

    if (password) {
      if (!validator.isStrongPassword(password)) {
        return res.status(400).json({
          message:
            "Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
          status: 400,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = $3");
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        message: "Nothing to update",
        status: 400,
      });
    }

    if (userId) {
      updateValues.push(userId);
    }
    const updateUser = await pool.query(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = $${
        updateValues.length
      } RETURNING *`,
      updateValues
    );

    const newUsername = updateUser.rows[0].username;
    const newEmail = updateUser.rows[0].email;

    return res.status(200).json({
      message: "User updated",
      username: newUsername,
      email: newEmail,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const deleteUser = await pool.query(`DELETE FROM users WHERE id = $1`, [
      userId,
    ]);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const getUser = await pool.query(
      `SELECT username, email, avatar,bg_img FROM users WHERE id = $1`,
      [id]
    );
    if (getUser.rows.length > 0) {
      return res.status(200).json({
        userData: getUser.rows[0],
      });
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getUsersAutocomplete = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        message: "Please provide search query",
      });
    }

    const getUsers = await pool.query(
      `SELECT id, username, avatar FROM users WHERE username ILIKE $1 LIMIT 10`,
      [`%${search}%`]
    );

    return res.status(200).json({
      users: getUsers.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
