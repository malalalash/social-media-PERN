type UserType = {
  id: number;
  username: string;
  email: string;
  avatar: string;
  bg_img: string;
};

export interface UserState {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

export type PostType = {
  id: number;
  description: string;
  img: string | null;
  user_id: number;
  likes: number;
  created_at: string;
  username: string;
  avatar: string;
  public_id: string | null;
};

type CommentsType = {
  avatar: string;
  content: string;
  id: number;
  post_id: number;
  user_id: number;
  username: string;
  created_at: string;
};

export type CommentsData = {
  comments: CommentsType[];
};

export type UpdateUserType = {
  username: string;
  email: string;
  password: string;
};

export type SearchUserType = {
  id: number;
  username: string;
  avatar: string;
};
